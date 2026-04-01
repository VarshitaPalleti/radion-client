"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext"; // Make sure your AuthContext is wrapping your app

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Send back to home page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="font-montserrat w-full flex items-center justify-between p-6 bg-black/85 text-white backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      {/* LOGO AREA */}
      <Link href="/" className="flex items-center gap-2">
        <img
          className="w-13 rounded-3xl"
          src="../logobg.png"
          alt="Radion Logo"
        />

      </Link>

      {/* DYNAMIC LINKS AREA */}
      <div className="flex items-center gap-8 font-medium">
        {/* ALWAYS SHOW HOME AND ABOUT */}
        <Link href="/" className="hover:text-cyan-400 transition">
          Home
        </Link>
        <Link href="/about" className="hover:text-cyan-400 transition">
          About
        </Link>

        {/* LOADING STATE (Optional, keeps UI smooth while checking auth) */}
        {loading ? (
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            {/* 🔴 PATIENT LINKS */}
            {role === "PATIENT" && (
              <>
                <Link
                  href="/patient/predict"
                  className="hover:text-cyan-400 transition"
                >
                  Predict
                </Link>
                <Link
                  href="/patient/history"
                  className="hover:text-cyan-400 transition"
                >
                  History
                </Link>
                <Link
                  href="/patient/profile"
                  className="hover:text-cyan-400 transition text-cyan-300"
                >
                  Profile
                </Link>
              </>
            )}

            {/* 🔵 DOCTOR LINKS */}
            {role === "DOCTOR" && (
              <>
                <Link
                  href="/doctor/review"
                  className="hover:text-cyan-400 transition"
                >
                  Review
                </Link>
                <Link
                  href="/doctor/history"
                  className="hover:text-cyan-400 transition"
                >
                  History
                </Link>
                <Link
                  href="/doctor/profile"
                  className="hover:text-cyan-400 transition text-cyan-300"
                >
                  Doc Profile
                </Link>
              </>
            )}

            {/* AUTH BUTTONS (Login or Logout) */}
            {!user ? (
              <div className="flex flex-row gap-4">
                <Link
                  href="/login"
                  className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-xl hover:bg-cyan-500 hover:text-black transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-cyan-500/10 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-black transition-all"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              >
                Logout
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
