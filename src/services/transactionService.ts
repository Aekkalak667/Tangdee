import { db } from "@/lib/firebase.config";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  category: string;
  name: string;
  walletId: string;
  uid: string;
}

export interface DailySummary {
  totalIncome: number;
  totalExpense: number;
}

export interface MonthlySummary {
  [date: string]: DailySummary;
}

export interface GroupedTransactions {
  [date: string]: {
    transactions: Transaction[];
    totalIncome: number;
    totalExpense: number;
  };
}

/**
 * Helper to group and filter transactions by date and search query.
 */
const groupAndFilterTransactions = (
  transactions: Transaction[],
  search?: string
): GroupedTransactions => {
  const grouped: GroupedTransactions = {};

  const filtered = search
    ? transactions.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      )
    : transactions;

  filtered.forEach(t => {
    // Use local date string YYYY-MM-DD
    const year = t.date.getFullYear();
    const month = String(t.date.getMonth() + 1).padStart(2, '0');
    const day = String(t.date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    if (!grouped[dateStr]) {
      grouped[dateStr] = {
        transactions: [],
        totalIncome: 0,
        totalExpense: 0,
      };
    }

    grouped[dateStr].transactions.push(t);
    if (t.type === 'income') {
      grouped[dateStr].totalIncome += t.amount;
    } else {
      grouped[dateStr].totalExpense += t.amount;
    }
  });

  return grouped;
};

/**
 * Fetches transactions for a specific month and year with optional filtering.
 * 
 * @param filters Object containing uid, optional walletId, month (0-11), year, and optional search query.
 * @returns Promise resolving to GroupedTransactions.
 */
export const fetchTransactions = async (filters: {
  uid: string;
  walletId?: string;
  month: number;
  year: number;
  search?: string;
}): Promise<GroupedTransactions> => {
  const { uid, walletId, month, year, search } = filters;
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  let q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<", Timestamp.fromDate(endDate)),
    orderBy("date", "desc")
  );

  if (walletId && walletId !== 'all') {
    q = query(q, where("walletId", "==", walletId));
  }

  const snapshot = await getDocs(q);
  const transactions: Transaction[] = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date.toDate(),
    } as Transaction;
  });

  return groupAndFilterTransactions(transactions, search);
};

/**
 * Subscribes to real-time transaction updates with filtering.
 * 
 * @param filters Object containing uid, optional walletId, month (0-11), year, and optional search query.
 * @param onUpdate Callback function that receives the updated GroupedTransactions.
 * @returns Unsubscribe function.
 */
export const subscribeToTransactions = (
  filters: {
    uid: string;
    walletId?: string;
    month: number;
    year: number;
    search?: string;
  },
  onUpdate: (data: GroupedTransactions) => void
) => {
  const { uid, walletId, month, year, search } = filters;
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  let q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<", Timestamp.fromDate(endDate)),
    orderBy("date", "desc")
  );

  if (walletId && walletId !== 'all') {
    q = query(q, where("walletId", "==", walletId));
  }

  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      } as Transaction;
    });

    onUpdate(groupAndFilterTransactions(transactions, search));
  }, (error) => {
    console.error("Error subscribing to transactions:", error);
  });
};

/**
 * Fetches daily summaries for a specific month and year.
 * Returns an object where keys are date strings (YYYY-MM-DD).
 * 
 * @param uid User ID
 * @param month Month (0-11)
 * @param year Year (e.g., 2026)
 * @param walletId Optional wallet ID to filter by
 * @returns Promise resolving to MonthlySummary
 */
export const getDailySummary = async (
  uid: string, 
  month: number, 
  year: number, 
  walletId?: string
): Promise<MonthlySummary> => {
  const grouped = await fetchTransactions({ uid, month, year, walletId });
  
  const summary: MonthlySummary = {};
  Object.keys(grouped).forEach(date => {
    summary[date] = {
      totalIncome: grouped[date].totalIncome,
      totalExpense: grouped[date].totalExpense,
    };
  });

  return summary;
};

/**
 * Fetches transactions for a specific date.
 * 
 * @param uid User ID
 * @param date Date string (YYYY-MM-DD)
 * @param walletId Optional wallet ID to filter by
 * @returns Promise resolving to Transaction[]
 */
export const getTransactionsByDate = async (
  uid: string, 
  date: string, 
  walletId?: string
): Promise<Transaction[]> => {
  const [year, month, day] = date.split('-').map(Number);
  const startDate = new Date(year, month - 1, day);
  const endDate = new Date(year, month - 1, day + 1);

  let q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<", Timestamp.fromDate(endDate)),
    orderBy("date", "desc")
  );

  if (walletId && walletId !== 'all') {
    q = query(q, where("walletId", "==", walletId));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date.toDate(),
    } as Transaction;
  });
};
