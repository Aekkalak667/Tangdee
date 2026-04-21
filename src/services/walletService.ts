import { db } from "@/lib/firebase.config";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  query, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { deleteAllTransactionsByWallet } from "./transactionService";

export interface WalletData {
  id?: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  color: string;
  icon: string;
}

/**
 * Creates a new wallet for a specific user.
 * @param uid The user's unique ID.
 * @param walletData The data for the new wallet.
 * @returns The ID of the newly created wallet document.
 */
export const createWallet = async (uid: string, walletData: WalletData) => {
  try {
    const walletsRef = collection(db, "users", uid, "wallets");
    const docRef = await addDoc(walletsRef, {
      ...walletData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  }
};

/**
 * Updates the metadata of an existing wallet.
 * @param uid The user's unique ID.
 * @param walletId The ID of the wallet to update.
 * @param data The partial wallet data to update (name, icon, color).
 */
export const updateWalletMetadata = async (
  uid: string,
  walletId: string,
  data: Partial<Pick<WalletData, "name" | "icon" | "color">>
) => {
  try {
    const walletRef = doc(db, "users", uid, "wallets", walletId);
    await updateDoc(walletRef, data);
  } catch (error) {
    console.error("Error updating wallet metadata:", error);
    throw error;
  }
};

/**
 * Deletes a wallet and optionally its associated transactions.
 * @param uid The user's unique ID.
 * @param walletId The ID of the wallet to delete.
 * @param options Options for deletion, e.g., whether to delete transactions.
 */
export const deleteWallet = async (
  uid: string,
  walletId: string,
  options: { deleteTransactions: boolean }
) => {
  try {
    if (options.deleteTransactions) {
      await deleteAllTransactionsByWallet(uid, walletId);
    }

    const walletRef = doc(db, "users", uid, "wallets", walletId);
    await deleteDoc(walletRef);
  } catch (error) {
    console.error("Error deleting wallet:", error);
    throw error;
  }
};

/**
 * Subscribes to real-time updates for a user's wallets.
 * @param uid The user's unique ID.
 * @param onUpdate Callback function that receives the updated wallet list and total balance.
 * @returns Unsubscribe function.
 */
export const subscribeToWallets = (
  uid: string,
  onUpdate: (wallets: WalletData[], total: number) => void
) => {
  const walletsRef = collection(db, "users", uid, "wallets");
  const q = query(walletsRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const wallets: WalletData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as WalletData),
      }));

      const totalBalance = wallets.reduce((sum, wallet) => sum + (Number(wallet.balance) || 0), 0);

      onUpdate(wallets, totalBalance);
    },
    (error) => {
      console.error("Error subscribing to wallets:", error);
    }
  );
};
