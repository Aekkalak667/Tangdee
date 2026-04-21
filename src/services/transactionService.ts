import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  Timestamp, 
  runTransaction, 
  doc,
  getDocs,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";

export interface Transaction {
  id?: string;
  uid: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  categoryId: string;
  name: string;
  walletId: string;
  fromWalletId?: string;
  toWalletId?: string;
  note?: string;
  date: any; // Firestore Timestamp
}

export interface GroupedTransactions {
  [date: string]: {
    transactions: Transaction[];
    totalIncome: number;
    totalExpense: number;
  };
}

export interface MonthlySummary {
  [date: string]: {
    totalIncome: number;
    totalExpense: number;
  };
}

/**
 * บันทึกรายการใหม่และอัปเดตยอดเงินในกระเป๋า (Atomic)
 */
export const addTransactionWithUpdate = async (uid: string, txData: Omit<Transaction, 'id' | 'date'>) => {
  try {
    await runTransaction(db, async (transaction) => {
      const walletRef = doc(db, `users/${uid}/wallets`, txData.walletId);
      const walletSnap = await transaction.get(walletRef);

      if (!walletSnap.exists()) {
        throw new Error("Wallet does not exist!");
      }

      const currentBalance = walletSnap.data().balance || 0;
      const newBalance = txData.type === 'income' 
        ? currentBalance + txData.amount 
        : currentBalance - txData.amount;

      // 1. สร้าง Transaction Record
      const txRef = doc(collection(db, "transactions"));
      transaction.set(txRef, {
        ...txData,
        uid,
        date: Timestamp.now(),
      });

      // 2. อัปเดตยอดเงินใน Wallet
      transaction.update(walletRef, { balance: newBalance });
    });
  } catch (error) {
    console.error("Add transaction failed: ", error);
    throw error;
  }
};

/**
 * โอนเงินระหว่างกระเป๋า (Atomic)
 */
export const transferFunds = async (uid: string, data: { fromWalletId: string, toWalletId: string, amount: number, note?: string }) => {
  try {
    await runTransaction(db, async (transaction) => {
      const fromRef = doc(db, `users/${uid}/wallets`, data.fromWalletId);
      const toRef = doc(db, `users/${uid}/wallets`, data.toWalletId);

      const fromSnap = await transaction.get(fromRef);
      const toSnap = await transaction.get(toRef);

      if (!fromSnap.exists() || !toSnap.exists()) {
        throw new Error("One or both wallets do not exist!");
      }

      const fromBalance = fromSnap.data().balance || 0;
      const toBalance = toSnap.data().balance || 0;

      // 1. สร้าง Record การโอน
      const txRef = doc(collection(db, "transactions"));
      transaction.set(txRef, {
        uid,
        amount: data.amount,
        type: 'transfer',
        fromWalletId: data.fromWalletId,
        toWalletId: data.toWalletId,
        walletId: data.fromWalletId, // ผูกกับต้นทางเพื่อให้เห็นในรายการ
        category: 'Transfer',
        categoryId: 'transfer',
        name: `โอนย้ายไปยัง ${toSnap.data().name}`,
        note: data.note,
        date: Timestamp.now(),
      });

      // 2. อัปเดตยอดเงินทั้งสองกระเป๋า
      transaction.update(fromRef, { balance: fromBalance - data.amount });
      transaction.update(toRef, { balance: toBalance + data.amount });
    });
  } catch (error) {
    console.error("Transfer failed: ", error);
    throw error;
  }
};

/**
 * ดึงรายการแบบ Real-time พร้อม Filter และ Grouping (ลบ Mock ออก 100%)
 */
export const subscribeToTransactions = (
  filters: { uid: string, walletId?: string | 'all', month: number, year: number, search?: string },
  onUpdate: (data: GroupedTransactions) => void
) => {
  const startOfMonth = new Date(filters.year, filters.month, 1);
  const endOfMonth = new Date(filters.year, filters.month + 1, 0, 23, 59, 59);

  let q = query(
    collection(db, "transactions"),
    where("uid", "==", filters.uid),
    where("date", ">=", Timestamp.fromDate(startOfMonth)),
    where("date", "<=", Timestamp.fromDate(endOfMonth)),
    orderBy("date", "desc")
  );

  if (filters.walletId && filters.walletId !== 'all') {
    q = query(q, where("walletId", "==", filters.walletId));
  }

  return onSnapshot(q, (snapshot) => {
    const grouped: GroupedTransactions = {};

    snapshot.docs.forEach(doc => {
      const data = { id: doc.id, ...doc.data() } as Transaction;
      
      // ค้นหาข้อความ (Client-side search เนื่องจาก Firestore ทำ Full-text search ไม่ได้ง่ายๆ)
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matches = data.name.toLowerCase().includes(search) || data.category.toLowerCase().includes(search);
        if (!matches) return;
      }

      const dateStr = data.date.toDate().toISOString().split('T')[0];

      if (!grouped[dateStr]) {
        grouped[dateStr] = { transactions: [], totalIncome: 0, totalExpense: 0 };
      }

      grouped[dateStr].transactions.push(data);
      if (data.type === 'income') grouped[dateStr].totalIncome += data.amount;
      if (data.type === 'expense') grouped[dateStr].totalExpense += data.amount;
    });

    onUpdate(grouped);
  });
};

/**
 * ดึงยอดสรุปรายเดือนสำหรับปฏิทิน (ข้อมูลจริง)
 */
export const getDailySummary = async (uid: string, month: number, year: number, walletId?: string | 'all'): Promise<MonthlySummary> => {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  let q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    where("date", ">=", Timestamp.fromDate(startOfMonth)),
    where("date", "<=", Timestamp.fromDate(endOfMonth))
  );

  if (walletId && walletId !== 'all') {
    q = query(q, where("walletId", "==", walletId));
  }

  const snapshot = await getDocs(q);
  const summary: MonthlySummary = {};

  snapshot.docs.forEach(doc => {
    const data = doc.data() as Transaction;
    const dateStr = data.date.toDate().toISOString().split('T')[0];

    if (!summary[dateStr]) {
      summary[dateStr] = { totalIncome: 0, totalExpense: 0 };
    }

    if (data.type === 'income') summary[dateStr].totalIncome += data.amount;
    if (data.type === 'expense') summary[dateStr].totalExpense += data.amount;
  });

  return summary;
};
