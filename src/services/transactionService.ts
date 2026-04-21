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
  limit,
  startAfter,
  writeBatch,
  deleteDoc
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
 * ลบรายการทั้งหมดที่ผูกกับกระเป๋าเงินที่ระบุ
 */
export const deleteAllTransactionsByWallet = async (uid: string, walletId: string) => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("uid", "==", uid),
      where("walletId", "==", walletId)
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error deleting transactions by wallet:", error);
    throw error;
  }
};

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
 * Helper สำหรับจัดกลุ่มรายการตามวันที่
 */
export const groupTransactions = (docs: any[], search?: string): GroupedTransactions => {
  const grouped: GroupedTransactions = {};

  docs.forEach(doc => {
    const data = (typeof doc.data === 'function' ? { id: doc.id, ...doc.data() } : doc) as Transaction;
    
    if (search) {
      const s = search.toLowerCase();
      const matches = data.name.toLowerCase().includes(s) || data.category.toLowerCase().includes(s);
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

  return grouped;
};

/**
 * ดึงรายการแบบ Real-time พร้อม Filter, Grouping และ Pagination
 */
export const subscribeToTransactions = (
  filters: { 
    uid: string, 
    walletId?: string | 'all', 
    month: number, 
    year: number, 
    search?: string,
    pageSize?: number,
    lastVisible?: any
  },
  onUpdate: (data: GroupedTransactions, lastDoc: any) => void
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

  if (filters.lastVisible) {
    q = query(q, startAfter(filters.lastVisible));
  }

  if (filters.pageSize) {
    q = query(q, limit(filters.pageSize));
  }

  return onSnapshot(q, (snapshot) => {
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const grouped = groupTransactions(snapshot.docs, filters.search);
    onUpdate(grouped, lastDoc);
  });
};

/**
 * ดึงรายการแบบระบุหน้า (Pagination) - สำหรับ Load More แบบ Static
 */
export const getTransactionsPage = async (
  filters: { 
    uid: string, 
    walletId?: string | 'all', 
    month: number, 
    year: number, 
    pageSize: number,
    lastVisible?: any 
  }
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

  if (filters.lastVisible) {
    q = query(q, startAfter(filters.lastVisible));
  }

  q = query(q, limit(filters.pageSize));

  const snapshot = await getDocs(q);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));

  return { transactions, lastDoc };
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
