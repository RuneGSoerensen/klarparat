"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UserProvider } from '../context/UserContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed in layout:', user?.uid);
      setUser(user);
      setIsLoading(false);

      if (!user && pathname !== "/login") {
        router.replace("/login");
      }
      if (user && pathname === "/login") {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          {user && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                background: '#C4A484',
                color: 'white',
                padding: '8px 16px',
                zIndex: 1000,
                cursor: 'pointer'
              }}
              onClick={handleLogout}
              title="Click to log out"
            >
              Logged in as: <b>{user.email}</b>
            </div>
          )}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
