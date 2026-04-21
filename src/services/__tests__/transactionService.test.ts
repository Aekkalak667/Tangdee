import { vi, describe, it, expect, beforeEach } from 'vitest';
import { addTransactionWithUpdate, transferFunds } from '../transactionService';
import { runTransaction, doc, collection, Timestamp } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  runTransaction: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ toDate: () => new Date() })),
    fromDate: vi.fn(),
  },
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  writeBatch: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('@/lib/firebase.config', () => ({
  db: { type: 'db' },
}));

describe('transactionService', () => {
  const mockUid = 'user123';
  const mockWalletId = 'wallet1';
  const mockWalletRef = { id: mockWalletId, path: `users/${mockUid}/wallets/${mockWalletId}` };
  const mockTxRef = { id: 'tx1' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addTransactionWithUpdate', () => {
    it('should increase balance on income', async () => {
      const txData = {
        amount: 100,
        type: 'income' as const,
        category: 'Salary',
        categoryId: 'salary',
        name: 'Monthly Salary',
        walletId: mockWalletId,
      };

      const mockWalletSnap = {
        exists: () => true,
        data: () => ({ balance: 500 }),
      };

      const mockTransaction = {
        get: vi.fn().mockResolvedValue(mockWalletSnap),
        set: vi.fn(),
        update: vi.fn(),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      (doc as any).mockImplementation((...args: any[]) => {
        const path = typeof args[1] === 'string' ? args[1] : '';
        if (path.includes('wallets')) return mockWalletRef;
        return mockTxRef;
      });

      (collection as any).mockReturnValue({});

      await addTransactionWithUpdate(mockUid, txData);

      expect(mockTransaction.get).toHaveBeenCalledWith(mockWalletRef);
      expect(mockTransaction.update).toHaveBeenCalledWith(mockWalletRef, { balance: 600 });
      expect(mockTransaction.set).toHaveBeenCalledWith(mockTxRef, expect.objectContaining({
        amount: 100,
        type: 'income',
        uid: mockUid,
      }));
    });

    it('should decrease balance on expense', async () => {
      const txData = {
        amount: 50,
        type: 'expense' as const,
        category: 'Food',
        categoryId: 'food',
        name: 'Lunch',
        walletId: mockWalletId,
      };

      const mockWalletSnap = {
        exists: () => true,
        data: () => ({ balance: 500 }),
      };

      const mockTransaction = {
        get: vi.fn().mockResolvedValue(mockWalletSnap),
        set: vi.fn(),
        update: vi.fn(),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      (doc as any).mockImplementation((...args: any[]) => {
        const path = typeof args[1] === 'string' ? args[1] : '';
        if (path.includes('wallets')) return mockWalletRef;
        return mockTxRef;
      });

      await addTransactionWithUpdate(mockUid, txData);

      expect(mockTransaction.update).toHaveBeenCalledWith(mockWalletRef, { balance: 450 });
    });

    it('should throw error if wallet does not exist', async () => {
      const txData = {
        amount: 100,
        type: 'income' as const,
        category: 'Salary',
        categoryId: 'salary',
        name: 'Monthly Salary',
        walletId: mockWalletId,
      };

      const mockWalletSnap = {
        exists: () => false,
      };

      const mockTransaction = {
        get: vi.fn().mockResolvedValue(mockWalletSnap),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      await expect(addTransactionWithUpdate(mockUid, txData)).rejects.toThrow("Wallet does not exist!");
    });
  });

  describe('transferFunds', () => {
    it('should decrease source wallet and increase destination wallet balance', async () => {
      const transferData = {
        fromWalletId: 'wallet1',
        toWalletId: 'wallet2',
        amount: 200,
        note: 'Test transfer',
      };

      const mockFromSnap = {
        exists: () => true,
        data: () => ({ balance: 1000, name: 'Wallet 1' }),
      };
      const mockToSnap = {
        exists: () => true,
        data: () => ({ balance: 500, name: 'Wallet 2' }),
      };

      const mockFromRef = { id: 'wallet1', path: 'users/user123/wallets/wallet1' };
      const mockToRef = { id: 'wallet2', path: 'users/user123/wallets/wallet2' };

      const mockTransaction = {
        get: vi.fn().mockImplementation((ref) => {
          if (ref.id === 'wallet1') return Promise.resolve(mockFromSnap);
          if (ref.id === 'wallet2') return Promise.resolve(mockToSnap);
          return Promise.resolve({ exists: () => false });
        }),
        set: vi.fn(),
        update: vi.fn(),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      (doc as any).mockImplementation((...args: any[]) => {
        const path = typeof args[1] === 'string' ? args[1] : '';
        const id = args[2];
        if (id === 'wallet1' || path.endsWith('wallet1')) return mockFromRef;
        if (id === 'wallet2' || path.endsWith('wallet2')) return mockToRef;
        return mockTxRef;
      });

      await transferFunds(mockUid, transferData);

      expect(mockTransaction.update).toHaveBeenCalledWith(mockFromRef, { balance: 800 });
      expect(mockTransaction.update).toHaveBeenCalledWith(mockToRef, { balance: 700 });
      expect(mockTransaction.set).toHaveBeenCalledWith(mockTxRef, expect.objectContaining({
        amount: 200,
        type: 'transfer',
        fromWalletId: 'wallet1',
        toWalletId: 'wallet2',
      }));
    });
  });
});
