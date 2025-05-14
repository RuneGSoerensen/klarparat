import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'basic';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export const getUserData = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserData;
  }
  return null;
};

export const updateUserRole = async (targetUid: string, newRole: UserRole): Promise<void> => {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, { role: newRole });
};

export const updateUserEmail = async (uid: string, newEmail: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { email: newEmail });
};

export const updateUserName = async (uid: string, newName: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { name: newName });
}; 