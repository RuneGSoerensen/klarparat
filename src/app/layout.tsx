"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserName } from "@/lib/auth";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (!isAuthenticated && pathname !== "/login") {
        router.replace("/login");
      }
      if (isAuthenticated && pathname === "/login") {
        router.replace("/");
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Show logged-in user name for testing */}
        {typeof window !== 'undefined' && getUserName() && (
          <div
            style={{ position: 'fixed', top: 0, right: 0, background: '#C4A484', color: 'white', padding: '8px 16px', zIndex: 1000, cursor: 'pointer' }}
            onClick={handleLogout}
            title="Click to log out"
          >
            Logged in as: <b>{getUserName()}</b>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
