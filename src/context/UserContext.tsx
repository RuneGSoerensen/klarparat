import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Firebase auth state changed in UserContext:', user?.uid);
      setUser(user);
      
      if (user) {
        // Check if user is admin (you might want to store this in Firestore)
        const storedRole = localStorage.getItem('userRole');
        setIsAdmin(storedRole === 'admin');
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUserRole = (role: boolean) => {
    setIsAdmin(role);
    localStorage.setItem('userRole', role ? 'admin' : 'user');
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