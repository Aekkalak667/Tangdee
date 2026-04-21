import { db } from "@/lib/firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface WalletData {
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
