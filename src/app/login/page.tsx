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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header logoSrc="/klarparatlogo.png" logoAlt="KlarParat Logo" logoWidth={40} logoHeight={40} logoClassName="h-7 w-auto" title="KlarParat" />

  
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Velkommen tilbage</h2>
            <p className="text-gray-600">Log ind for at fortsætte</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#C4A484] focus:ring-2 focus:ring-[#C4A484]/20 transition-all duration-200 outline-none"
                  placeholder="din@klarparat.dk"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adgangskode
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#C4A484] focus:ring-2 focus:ring-[#C4A484]/20 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#C4A484] text-white rounded-lg py-3.5 font-medium hover:bg-[#B39374] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4A484] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Log ind
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 