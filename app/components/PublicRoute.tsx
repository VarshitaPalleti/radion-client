"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only trigger once Firebase has finished checking the auth state
    if (!loading && user) {
      // User is already logged in, route them away from public pages
      if (role === "PATIENT") {
        router.push("/patient/profile");
      } else if (role === "DOCTOR") {
        router.push("/doctor/profile");
      } else {
        router.push("/"); // Fallback
      }
    }
  }, [user, role, loading, router]);

  // 1. Show a blank dark screen or loader while checking Firebase state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-500 font-bold uppercase tracking-widest animate-pulse">
        Verifying Session...
      </div>
    );
  }

  // 2. If the user IS logged in, keep the screen in a loading state while Next.js redirects them.
  // This prevents the Login form from "flashing" on the screen for a split second!
  if (user) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400 font-bold uppercase tracking-widest animate-pulse">
        Redirecting to Dashboard...
      </div>
    );
  }

  // 3. If no user is found, it is safe to show the Login/Register forms
  return <>{children}</>;
}