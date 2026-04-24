import { vi, describe, it, expect, beforeEach } from 'vitest';
import { addTransactionWithUpdate, transferFunds, deleteTransactionWithUpdate, updateTransactionWithUpdate } from '../transactionService';
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

  describe('deleteTransactionWithUpdate', () => {
    it('should reverse income balance and delete transaction', async () => {
      const mockTxData = {
        amount: 100,
        type: 'income',
        walletId: 'wallet1',
      };

      const mockTxSnap = {
        exists: () => true,
        data: () => mockTxData,
      };

      const mockWalletSnap = {
        exists: () => true,
        data: () => ({ balance: 500 }),
      };

      const mockTransaction = {
        get: vi.fn().mockImplementation((ref) => {
          if (ref.id === 'tx1') return Promise.resolve(mockTxSnap);
          if (ref.id === 'wallet1') return Promise.resolve(mockWalletSnap);
          return Promise.resolve({ exists: () => false });
        }),
        update: vi.fn(),
        delete: vi.fn(),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      (doc as any).mockImplementation((...args: any[]) => {
        const id = args[2] || args[1];
        return { id };
      });

      await deleteTransactionWithUpdate(mockUid, 'tx1');

      expect(mockTransaction.update).toHaveBeenCalledWith({ id: 'wallet1' }, { balance: 400 });
      expect(mockTransaction.delete).toHaveBeenCalledWith({ id: 'tx1' });
    });

    it('should reverse transfer balance and delete transaction', async () => {
      const mockTxData = {
        amount: 200,
        type: 'transfer',
        fromWalletId: 'wallet1',
        toWalletId: 'wallet2',
      };

      const mockTxSnap = {
        exists: () => true,
        data: () => mockTxData,
      };

      const mockFromSnap = { exists: () => true, data: () => ({ balance: 800 }) };
      const mockToSnap = { exists: () => true, data: () => ({ balance: 700 }) };

      const mockTransaction = {
        get: vi.fn().mockImplementation((ref) => {
          if (ref.id === 'tx1') return Promise.resolve(mockTxSnap);
          if (ref.id === 'wallet1') return Promise.resolve(mockFromSnap);
          if (ref.id === 'wallet2') return Promise.resolve(mockToSnap);
          return Promise.resolve({ exists: () => false });
        }),
        update: vi.fn(),
        delete: vi.fn(),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      (doc as any).mockImplementation((...args: any[]) => {
        const id = args[2] || args[1];
        return { id };
      });

      await deleteTransactionWithUpdate(mockUid, 'tx1');

      expect(mockTransaction.update).toHaveBeenCalledWith({ id: 'wallet1' }, { balance: 1000 });
      expect(mockTransaction.update).toHaveBeenCalledWith({ id: 'wallet2' }, { balance: 500 });
      expect(mockTransaction.delete).toHaveBeenCalledWith({ id: 'tx1' });
    });
  });

  describe('updateTransactionWithUpdate', () => {
    it('should handle amount change correctly', async () => {
      const oldTxData = {
        amount: 100,
        type: 'income',
        walletId: 'wallet1',
      };

      const mockTxSnap = {
        exists: () => true,
        data: () => oldTxData,
      };

      const mockWalletSnap = {
        exists: () => true,
        data: () => ({ balance: 500 }),
      };

      const mockTransaction = {
        get: vi.fn().mockImplementation((ref) => {
          if (ref.id === 'tx1') return Promise.resolve(mockTxSnap);
          if (ref.id === 'wallet1') return Promise.resolve(mockWalletSnap);
          return Promise.resolve({ exists: () => false });
        }),
        update: vi.fn(),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      (doc as any).mockImplementation((...args: any[]) => {
        const id = args[2] || args[1];
        return { id };
      });

      // Change amount from 100 to 150
      await updateTransactionWithUpdate(mockUid, 'tx1', { amount: 150 });

      // Reverse 100 (500-100=400), Apply 150 (400+150=550)
      expect(mockTransaction.update).toHaveBeenCalledWith({ id: 'wallet1' }, { balance: 550 });
      expect(mockTransaction.update).toHaveBeenCalledWith({ id: 'tx1' }, { amount: 150 });
    });

    it('should handle wallet change correctly', async () => {
      const oldTxData = {
        amount: 100,
        type: 'expense',
        walletId: 'wallet1',
      };

      const mockTxSnap = {
        exists: () => true,
        data: () => oldTxData,
      };

      const mockWallet1Snap = { exists: () => true, data: () => ({ balance: 400 }) };
      const mockWallet2Snap = { exists: () => true, data: () => ({ balance: 1000 }) };

      const mockTransaction = {
        get: vi.fn().mockImplementation((ref) => {
          if (ref.id === 'tx1') return Promise.resolve(mockTxSnap);
          if (ref.id === 'wallet1') return Promise.resolve(mockWallet1Snap);
          if (ref.id === 'wallet2') return Promise.resolve(mockWallet2Snap);
          return Promise.resolve({ exists: () => false });
        }),
        update: vi.fn(),
      };

      (runTransaction as any).mockImplementation(async (db: any, cb: any) => {
        return await cb(mockTransaction);
      });

      (doc as any).mockImplementation((...args: any[]) => {
        const id = args[2] || args[1];
        return { id };
      });

      // Change wallet from wallet1 to wallet2
      await updateTransactionWithUpdate(mockUid, 'tx1', { walletId: 'wallet2' });

      // Wallet1: Reverse expense 100 (400+100=500)
      expect(mockTransaction.update).toHaveBeenCalledWith({ id: 'wallet1' }, { balance: 500 });
      // Wallet2: Apply expense 100 (1000-100=900)
      expect(mockTransaction.update).toHaveBeenCalledWith({ id: 'wallet2' }, { balance: 900 });
    });
  });
});
