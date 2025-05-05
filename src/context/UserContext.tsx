import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getUserData, updateUserEmail } from '@/lib/userManagement';

interface UserContextType {
  isAdmin: boolean;
  user: User | null;
  userData: {
    name: string;
    email: string;
    role: 'admin' | 'basic';
  } | null;
  isLoading: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserContextType['userData']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check Firestore for user role
        const userData = await getUserData(user.uid);
        
        // If email doesn't match, update it
        if (userData && userData.email !== user.email && user.email) {
          await updateUserEmail(user.uid, user.email);
        }
        
        if (userData) {
          setUserData({
            name: userData.name,
            email: userData.email,
            role: userData.role
          });
        }
        
        setIsAdmin(userData?.role === 'admin');
      } else {
        setIsAdmin(false);
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUserRole = (role: boolean) => {
    setIsAdmin(role);
  };

  return (
    <UserContext.Provider value={{ isAdmin, user, userData, isLoading, setIsAdmin: setUserRole }}>
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