import { vi, describe, it, expect, beforeEach } from 'vitest';
import { addCustomCategory, deleteCustomCategory, subscribeToCustomCategories } from '../categoryService';
import { addDoc, deleteDoc, doc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(() => ({ type: 'orderBy' })),
  Timestamp: {
    now: vi.fn(() => ({ type: 'timestamp' })),
  },
}));

vi.mock('@/lib/firebase.config', () => ({
  db: { type: 'db' },
}));

describe('categoryService', () => {
  const mockUid = 'user123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addCustomCategory', () => {
    it('should call addDoc with correct data', async () => {
      const categoryData = {
        name: 'New Category',
        type: 'expense' as const,
        iconName: 'Plus',
      };

      (addDoc as any).mockResolvedValue({ id: 'cat123' });
      (collection as any).mockReturnValue({ type: 'collection' });

      const id = await addCustomCategory(mockUid, categoryData);

      expect(id).toBe('cat123');
      expect(addDoc).toHaveBeenCalledWith(
        { type: 'collection' },
        expect.objectContaining({
          uid: mockUid,
          name: 'New Category',
          type: 'expense',
          group: 'custom',
          iconName: 'Plus',
          isCustom: true,
        })
      );
    });
  });

  describe('deleteCustomCategory', () => {
    it('should call deleteDoc with correct ref', async () => {
      const mockRef = { type: 'docRef' };
      (doc as any).mockReturnValue(mockRef);

      await deleteCustomCategory(mockUid, 'cat123');

      expect(doc).toHaveBeenCalledWith(expect.anything(), `users/${mockUid}/categories`, 'cat123');
      expect(deleteDoc).toHaveBeenCalledWith(mockRef);
    });
  });

  describe('subscribeToCustomCategories', () => {
    it('should setup onSnapshot with query', () => {
      const mockQuery = { type: 'query' };
      const mockCollection = { type: 'collection' };
      (collection as any).mockReturnValue(mockCollection);
      (query as any).mockReturnValue(mockQuery);
      
      const callback = vi.fn();
      subscribeToCustomCategories(mockUid, callback);

      expect(collection).toHaveBeenCalledWith(expect.anything(), `users/${mockUid}/categories`);
      expect(query).toHaveBeenCalledWith(mockCollection, expect.anything());
      expect(onSnapshot).toHaveBeenCalledWith(mockQuery, expect.any(Function));
    });
  });
});
