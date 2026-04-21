import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createWallet, updateWalletMetadata, deleteWallet, subscribeToWallets } from '../walletService';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { deleteAllTransactionsByWallet } from '../transactionService';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

vi.mock('../transactionService', () => ({
  deleteAllTransactionsByWallet: vi.fn(),
}));

vi.mock('@/lib/firebase.config', () => ({
  db: { type: 'db' },
}));

describe('walletService', () => {
  const mockUid = 'user123';
  const mockWalletId = 'wallet1';
  const mockWalletData = {
    name: 'Main Wallet',
    balance: 1000,
    currency: 'THB',
    type: 'cash',
    color: '#ff0000',
    icon: 'wallet',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should create a wallet and return its ID', async () => {
      (addDoc as any).mockResolvedValue({ id: mockWalletId });
      (collection as any).mockReturnValue({ path: 'wallets' });

      const result = await createWallet(mockUid, mockWalletData);

      expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        ...mockWalletData,
        createdAt: 'mock-timestamp',
      }));
      expect(result).toBe(mockWalletId);
    });
  });

  describe('updateWalletMetadata', () => {
    it('should update wallet metadata', async () => {
      const updateData = { name: 'New Name', color: '#00ff00' };
      const mockRef = { id: mockWalletId };
      (doc as any).mockReturnValue(mockRef);

      await updateWalletMetadata(mockUid, mockWalletId, updateData);

      expect(doc).toHaveBeenCalledWith(expect.anything(), "users", mockUid, "wallets", mockWalletId);
      expect(updateDoc).toHaveBeenCalledWith(mockRef, updateData);
    });
  });

  describe('deleteWallet', () => {
    it('should delete wallet without deleting transactions if option is false', async () => {
      const mockRef = { id: mockWalletId };
      (doc as any).mockReturnValue(mockRef);

      await deleteWallet(mockUid, mockWalletId, { deleteTransactions: false });

      expect(deleteAllTransactionsByWallet).not.toHaveBeenCalled();
      expect(deleteDoc).toHaveBeenCalledWith(mockRef);
    });

    it('should delete wallet and transactions if option is true', async () => {
      const mockRef = { id: mockWalletId };
      (doc as any).mockReturnValue(mockRef);

      await deleteWallet(mockUid, mockWalletId, { deleteTransactions: true });

      expect(deleteAllTransactionsByWallet).toHaveBeenCalledWith(mockUid, mockWalletId);
      expect(deleteDoc).toHaveBeenCalledWith(mockRef);
    });
  });

  describe('subscribeToWallets', () => {
    it('should subscribe to wallets and calculate total balance', () => {
      const mockOnUpdate = vi.fn();
      const mockSnapshot = {
        docs: [
          { id: 'w1', data: () => ({ balance: 100, name: 'W1' }) },
          { id: 'w2', data: () => ({ balance: 250, name: 'W2' }) },
        ],
      };

      (onSnapshot as any).mockImplementation((q: any, cb: any) => {
        cb(mockSnapshot);
        return () => {}; // unsubscribe
      });

      subscribeToWallets(mockUid, mockOnUpdate);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { id: 'w1', balance: 100, name: 'W1' },
        { id: 'w2', balance: 250, name: 'W2' },
      ], 350);
    });
  });
});
