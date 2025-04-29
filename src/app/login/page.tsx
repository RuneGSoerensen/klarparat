"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cookie } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

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
      router.push("/");
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
    <div className="flex flex-col min-h-screen bg-white">
      <header className="p-4">
        <div className="flex items-center gap-2">
          <Cookie className="w-6 h-6 text-[#C4A484]" />
          <h1 className="text-xl font-semibold">KlarParat</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-8">Log ind</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C4A484] focus:ring-[#C4A484]"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Adgangskode
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C4A484] focus:ring-[#C4A484]"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#C4A484] text-white rounded-lg py-3 hover:bg-[#B39374] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4A484]"
            >
              Log ind
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 