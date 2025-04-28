"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cookie } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [pin, setPin] = useState<string[]>(Array(4).fill(""));
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const router = useRouter();

  // Check for existing lockout
  useEffect(() => {
    const storedLockout = localStorage.getItem("loginLockout");
    if (storedLockout) {
      const lockoutData = JSON.parse(storedLockout);
      if (lockoutData.until > Date.now()) {
        setIsLocked(true);
        setLockoutTime(Math.ceil((lockoutData.until - Date.now()) / 1000));
      } else {
        localStorage.removeItem("loginLockout");
      }
    }
  }, []);

  // Handle lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handlePinChange = (index: number, value: string) => {
    if (isLocked) return;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name="pin-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="pin-${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const enteredPin = pin.join("");
    
    try {
      // Get the PIN from Firestore
      const pinDoc = await getDoc(doc(db, "settings", "pin"));
      const storedPin = pinDoc.data()?.value;

      if (enteredPin === storedPin) {
        // Store successful login
        localStorage.setItem("isAuthenticated", "true");
        router.push("/");
      } else {
        setError("Forkert PIN");
        const attempts = parseInt(localStorage.getItem("loginAttempts") || "0") + 1;
        localStorage.setItem("loginAttempts", attempts.toString());
        
        // Implement lockout after 3 failed attempts
        if (attempts >= 3) {
          const lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
          localStorage.setItem("loginLockout", JSON.stringify({ until: lockoutUntil }));
          setIsLocked(true);
          setLockoutTime(300); // 5 minutes in seconds
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Der opstod en fejl. Prøv igen senere.");
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
            <div className="flex justify-center gap-2">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  name={`pin-${index}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:border-[#C4A484]"
                  disabled={isLocked}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            {isLocked && (
              <p className="text-center text-gray-600">
                Prøv igen om {lockoutTime} sekunder
              </p>
            )}

            <button
              type="submit"
              disabled={isLocked || pin.some(digit => !digit)}
              className="w-full bg-[#C4A484] text-white rounded-lg py-3 disabled:opacity-50"
            >
              Log ind
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 