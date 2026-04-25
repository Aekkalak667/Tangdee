import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  Timestamp, 
  doc,
  deleteDoc,
  getDocs,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { Category, CATEGORY_GROUPS } from "@/constants/categories";

export interface CustomCategory extends Omit<Category, 'labelKey'> {
  uid: string;
  name: string; // Mandatory for custom categories
  isCustom: true;
  createdAt: Timestamp;
}

/**
 * ดึงข้อมูลหมวดหมู่ที่ผู้ใช้สร้างเองแบบ Real-time
 */
export const subscribeToCustomCategories = (uid: string, callback: (categories: CustomCategory[]) => void) => {
  const q = query(
    collection(db, `users/${uid}/categories`),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CustomCategory));
    callback(categories);
  });
};

/**
 * เพิ่มหมวดหมู่ใหม่
 */
export const addCustomCategory = async (uid: string, data: { name: string, type: 'expense' | 'income', iconName: string }) => {
  try {
    const categoryData: Omit<CustomCategory, 'id'> = {
      uid,
      name: data.name,
      type: data.type,
      group: CATEGORY_GROUPS.CUSTOM,
      iconName: data.iconName,
      isCustom: true,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, `users/${uid}/categories`), categoryData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding custom category:", error);
    throw error;
  }
};

/**
 * ลบหมวดหมู่
 */
export const deleteCustomCategory = async (uid: string, categoryId: string) => {
  try {
    await deleteDoc(doc(db, `users/${uid}/categories`, categoryId));
  } catch (error) {
    console.error("Error deleting custom category:", error);
    throw error;
  }
};
