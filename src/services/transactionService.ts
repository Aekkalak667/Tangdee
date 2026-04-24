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
 * ลบรายการและอัปเดตยอดเงินในกระเป๋า (Atomic)
 */
export const deleteTransactionWithUpdate = async (uid: string, transactionId: string) => {
  try {
    await runTransaction(db, async (transaction) => {
      const txRef = doc(db, "transactions", transactionId);
      const txSnap = await transaction.get(txRef);

      if (!txSnap.exists()) {
        throw new Error("Transaction does not exist!");
      }

      const txData = txSnap.data() as Transaction;

      if (txData.type === 'transfer') {
        const fromWalletRef = doc(db, `users/${uid}/wallets`, txData.fromWalletId!);
        const toWalletRef = doc(db, `users/${uid}/wallets`, txData.toWalletId!);

        const fromSnap = await transaction.get(fromWalletRef);
        const toSnap = await transaction.get(toWalletRef);

        if (fromSnap.exists()) {
          transaction.update(fromWalletRef, { balance: (fromSnap.data().balance || 0) + txData.amount });
        }
        if (toSnap.exists()) {
          transaction.update(toWalletRef, { balance: (toSnap.data().balance || 0) - txData.amount });
        }
      } else {
        const walletRef = doc(db, `users/${uid}/wallets`, txData.walletId);
        const walletSnap = await transaction.get(walletRef);

        if (walletSnap.exists()) {
          const currentBalance = walletSnap.data().balance || 0;
          const newBalance = txData.type === 'income' 
            ? currentBalance - txData.amount 
            : currentBalance + txData.amount;
          
          transaction.update(walletRef, { balance: newBalance });
        }
      }

      transaction.delete(txRef);
    });
  } catch (error) {
    console.error("Delete transaction failed: ", error);
    throw error;
  }
};

/**
 * อัปเดตรายการและปรับปรุงยอดเงินในกระเป๋า (Atomic)
 */
export const updateTransactionWithUpdate = async (uid: string, transactionId: string, newData: Partial<Transaction>) => {
  try {
    await runTransaction(db, async (transaction) => {
      const txRef = doc(db, "transactions", transactionId);
      const txSnap = await transaction.get(txRef);

      if (!txSnap.exists()) {
        throw new Error("Transaction does not exist!");
      }

      const oldData = txSnap.data() as Transaction;
      const updatedData = { ...oldData, ...newData };

      // รวบรวม Wallet IDs ทั้งหมดที่เกี่ยวข้องเพื่ออ่านค่าก่อน (Firestore Transaction requirement)
      const walletIds = new Set<string>();
      if (oldData.walletId) walletIds.add(oldData.walletId);
      if (oldData.fromWalletId) walletIds.add(oldData.fromWalletId);
      if (oldData.toWalletId) walletIds.add(oldData.toWalletId);
      if (updatedData.walletId) walletIds.add(updatedData.walletId);
      if (updatedData.fromWalletId) walletIds.add(updatedData.fromWalletId);
      if (updatedData.toWalletId) walletIds.add(updatedData.toWalletId);

      const walletSnaps: Record<string, any> = {};
      const walletRefs: Record<string, any> = {};

      for (const id of walletIds) {
        if (!id) continue;
        const ref = doc(db, `users/${uid}/wallets`, id);
        walletRefs[id] = ref;
        const snap = await transaction.get(ref);
        if (snap.exists()) {
          walletSnaps[id] = snap.data().balance || 0;
        }
      }

      const finalBalances: Record<string, number> = { ...walletSnaps };

      // 1. คืนยอดเก่า (Reverse old impact)
      if (oldData.type === 'transfer') {
        if (oldData.fromWalletId && finalBalances[oldData.fromWalletId] !== undefined) {
          finalBalances[oldData.fromWalletId] += oldData.amount;
        }
        if (oldData.toWalletId && finalBalances[oldData.toWalletId] !== undefined) {
          finalBalances[oldData.toWalletId] -= oldData.amount;
        }
      } else {
        if (oldData.walletId && finalBalances[oldData.walletId] !== undefined) {
          finalBalances[oldData.walletId] += (oldData.type === 'income' ? -oldData.amount : oldData.amount);
        }
      }

      // 2. ใส่ผลกระทบใหม่ (Apply new impact)
      if (updatedData.type === 'transfer') {
        if (updatedData.fromWalletId && finalBalances[updatedData.fromWalletId] !== undefined) {
          finalBalances[updatedData.fromWalletId] -= updatedData.amount;
        }
        if (updatedData.toWalletId && finalBalances[updatedData.toWalletId] !== undefined) {
          finalBalances[updatedData.toWalletId] += updatedData.amount;
        }
      } else {
        if (updatedData.walletId && finalBalances[updatedData.walletId] !== undefined) {
          finalBalances[updatedData.walletId] += (updatedData.type === 'income' ? updatedData.amount : -updatedData.amount);
        }
      }

      // 3. อัปเดต Wallets ที่ยอดเปลี่ยน
      for (const id in finalBalances) {
        if (finalBalances[id] !== walletSnaps[id]) {
          transaction.update(walletRefs[id], { balance: finalBalances[id] });
        }
      }

      // 4. อัปเดต Transaction Record
      const txUpdate = { ...newData };
      if (updatedData.type === 'transfer' && updatedData.fromWalletId) {
        txUpdate.walletId = updatedData.fromWalletId;
      }
      transaction.update(txRef, txUpdate);
    });
  } catch (error) {
    console.error("Update transaction failed: ", error);
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
