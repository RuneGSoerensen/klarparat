"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getUserData } from "@/lib/userManagement";
import Header from "@/components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully:", userCredential.user.uid);
      
      // Get user role from Firestore
      const userData = await getUserData(userCredential.user.uid);
      
      if (userData) {
        // Set role in localStorage for easy access
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", userData.email);
        
        router.push("/");
      } else {
        setError("User data not found. Please contact an administrator.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("Der opstod en fejl. Prøv igen senere.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header logoSrc="/klarparatlogo.png" logoAlt="KlarParat Logo" logoWidth={40} logoHeight={40} logoClassName="h-7 w-auto" title="KlarParat" />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[var(--background)] rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">Velkommen tilbage</h2>
            <p className="text-[var(--foreground)]">Log ind for at forsætte</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 outline-none"
                  placeholder="din@klarparat.dk"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Adgangskode
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--input-border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-[var(--error-bg)] border border-[var(--error-border)]">
                <p className="text-[var(--error-text)] text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[var(--accent)] text-white rounded-lg py-3.5 font-medium hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-all duration-200 shadow-[var(--shadow)] hover:shadow-[var(--shadow-hover)]"
            >
              Log ind
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 