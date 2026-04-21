import { db } from "@/lib/firebase.config";
import { collection, addDoc, serverTimestamp, onSnapshot, query } from "firebase/firestore";

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
