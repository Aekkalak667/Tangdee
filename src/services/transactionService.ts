export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  category: string;
  walletId: string;
}

export interface DailySummary {
  totalIncome: number;
  totalExpense: number;
}

export interface MonthlySummary {
  [date: string]: DailySummary;
}

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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const summary: MonthlySummary = {};
  
  // Generate mock data for at least 10 random days in the specified month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selectedDays = new Set<number>();
  
  while (selectedDays.size < 10) {
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
    selectedDays.add(randomDay);
  }

  selectedDays.forEach((day) => {
    // Format date as YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    summary[dateStr] = {
      totalIncome: Math.floor(Math.random() * 5000),
      totalExpense: Math.floor(Math.random() * 3000),
    };
  });

  return summary;
};

/**
 * Fetches transactions for a specific date.
 * (Placeholder for future implementation)
 * 
 * @param uid User ID
 * @param date Date string (YYYY-MM-DD)
 * @param walletId Optional wallet ID to filter by
 */
export const getTransactionsByDate = async (
  uid: string, 
  date: string, 
  walletId?: string
): Promise<Transaction[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Return empty array for now as this wasn't explicitly requested but is a logical next step
  return [];
};
