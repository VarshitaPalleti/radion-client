"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ADDED
import {
  ArrowLeft,
  ShieldCheck,
  Mail,
  Stethoscope,
  Building2,
} from "lucide-react";

// FIREBASE IMPORTS ADDED
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function DoctorRegister() {
  const router = useRouter(); // ADDED
  const [isProcessing, setIsProcessing] = useState(false); // ADDED

  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    email: "",
    specialization: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATED: FIREBASE LOGIC
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Google Auth
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Save Doctor Data to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...formData,
          name: formData.name || user.displayName,
          email: user.email, // Use Google's verified email
          role: "DOCTOR",
          isVerified: false, // Default to false until admin checks
          createdAt: new Date().toISOString(),
        },
        { merge: true },
      );

      // 3. Route to Doctor Profile
      router.push("/doctor/profile");
    } catch (error) {
      console.error("Doctor Registration Error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/homescr.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen w-full bg-black/85 backdrop-blur-[2px] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-slate-950/60 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-700">
          <div className="absolute top-0 left-0 w-full h-2 bg-cyan-600 rounded-t-3xl" />
          <div className="mb-8 text-center">
            <Link
              href="/register"
              className="absolute top-8 left-8 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Stethoscope className="w-8 h-8 text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-montserrat">
              Doctor Verification
            </h1>
            <p className="text-slate-400 mt-2 font-opensans">
              Join Radion to review cases and support diagnostics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 font-helvetica">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100/80 ">
                Full Name (As per ID)
              </label>
              <div className="relative">
                <input
                  name="name"
                  required
                  placeholder="Dr. Prajwal Donkada"
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 px-4 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div className="space-y-2 font-helvetica">
              <label className="text-sm font-medium text-blue-100/80 flex justify-between">
                Medical License Number
                <span className="text-xs text-amber-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 font-opensans" /> Required for
                  verification
                </span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  name="licenseNumber"
                  required
                  placeholder="LIC-12345678"
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="space-y-2 font-helvetica">
              <label className="text-sm font-medium text-blue-100/80">
                Specialization
              </label>
              <input
                name="specialization"
                required
                placeholder="e.g. Oncologist, Radiologist"
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="space-y-2 font-helvetica">
              <label className="text-sm font-medium text-blue-100/80">
                Official Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@hospital.com (Optional)"
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* REMOVED PASSWORD FIELD HERE */}

            <div className="pt-4 font-helvetica">
              {/* UPDATED SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center justify-center gap-3 cursor-pointer font-helvetica w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transform transition hover:-translate-y-1 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  "Authenticating with Google..."
                ) : (
                  <>
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5 bg-white rounded-full p-0.5"
                    />
                    Verify & Sign Up with Google
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 text-center mt-4 font-helvetica">
                By registering, you agree to our professional code of conduct
                and data privacy protocols.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
