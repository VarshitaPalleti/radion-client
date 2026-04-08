"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle } from "lucide-react";

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: "PATIENT" | "DOCTOR";
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only check once Firebase finishes loading the user's state
    if (!loading) {
      if (!user) {
        // Not logged in at all -> Send to Login
        router.push("/login");
      } else if (role && role !== allowedRole) {
        // Logged in, but wrong role -> Show Warning & Redirect
        setIsRedirecting(true);
        setTimeout(() => {
          if (role === "PATIENT") router.push("/patient/profile");
          else if (role === "DOCTOR") router.push("/doctor/profile");
          else router.push("/");
        }, 3000); // 3-second timeout before redirect
      }
    }
  }, [user, role, loading, allowedRole, router]);

  // 1. Show global loading state while Firebase checks auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400 font-bold uppercase tracking-widest">
        Verifying Access...
      </div>
    );
  }

  // 2. Show the Access Denied timeout warning
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center p-6">
        <div className="bg-red-950/20 border border-red-500/30 p-12 rounded-[3rem] backdrop-blur-xl flex flex-col items-center text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-black text-red-400 uppercase tracking-widest mb-2 font-montserrat">
            Access Denied
          </h1>
          <p className="text-red-200/80 mb-8 font-helvetica">
            Your account profile does not have authorization to view this clinical area.
          </p>
          <div className="flex items-center gap-3 text-cyan-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            Redirecting to your dashboard...
          </div>
        </div>
      </div>
    );
  }

  // 3. If they pass the check, render the actual page!
  if (user && role === allowedRole) {
    return <>{children}</>;
  }

  // Fallback to prevent flashes of unstyled content
  return null;
}