import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getUserData, updateUserEmail } from '@/lib/userManagement';

interface UserContextType {
  isAdmin: boolean;
  user: User | null;
  isLoading: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up Firebase auth listener in UserContext');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Firebase auth state changed in UserContext:', user?.uid);
      setUser(user);
      
      if (user) {
        // Check Firestore for user role
        const userData = await getUserData(user.uid);
        console.log('User data from Firestore:', userData);
        
        // If email doesn't match, update it
        if (userData && userData.email !== user.email && user.email) {
          console.log('Updating email in Firestore to match Auth email');
          await updateUserEmail(user.uid, user.email);
        }
        
        setIsAdmin(userData?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUserRole = (role: boolean) => {
    setIsAdmin(role);
  };

  return (
    <UserContext.Provider value={{ isAdmin, user, isLoading, setIsAdmin: setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 