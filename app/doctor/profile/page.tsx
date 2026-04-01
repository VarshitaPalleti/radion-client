"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ShieldCheck, Clock } from "lucide-react";

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === "DOCTOR") {
          setDoctorData({ id: user.uid, ...docSnap.data() });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400">
        Loading Credentials...
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-red-400">
        Access Denied or Profile Not Found.
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center py-20 bg-[#010a13] overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-20 grayscale pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-10 bg-[#021a24]/60 backdrop-blur-3xl p-12 rounded-[4rem] border border-blue-500/20 shadow-2xl">
          <div className="relative group">
            <div className="w-44 h-44 rounded-full border-2 border-dashed border-blue-400/30 p-2 group-hover:border-blue-400 transition-all duration-700">
              <div className="w-full h-full rounded-full bg-blue-950/40 flex items-center justify-center overflow-hidden">
                <svg
                  className="w-20 h-20 text-blue-300/20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
              <span className=" bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent uppercase font-montserrat">
                {doctorData.name}
              </span>
            </h1>
            <p className="text-blue-500 text-m font-bold font-mono mb-4 uppercase font-opensans">
              {doctorData.specialization}
            </p>

            {/* VERIFICATION BADGE */}
            {doctorData.isVerified ? (
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase">
                <ShieldCheck className="w-4 h-4" /> Account Verified
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-black uppercase">
                <Clock className="w-4 h-4" /> Verification Pending
              </div>
            )}
          </div>
        </div>

        {/* CREDENTIALS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="col-span-2 bg-[#021a24]/40 backdrop-blur-xl border border-blue-500/10 rounded-4xl p-10">
            <h2 className="text-blue-500 text-[20px] font-bold font-montserrat uppercase mb-10 border-b border-blue-500/5 pb-4">
              Professional Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6 font-helvetica ">
              <div>
                <p className="text-blue-600/70 text-[15px] uppercase font-bold tracking-widest mb-1">
                  Medical License
                </p>
                <p className="text-2xl font-black text-white ">
                  {doctorData.licenseNumber}
                </p>
              </div>

              <div>
                <p className="text-blue-600/70 text-[15px] uppercase font-bold tracking-widest mb-1">
                  Registered Email
                </p>
                <p className="text-xl font-bold text-white truncate">
                  {doctorData.email}
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 mt-4 p-6 rounded-3xl bg-blue-400/5 border border-blue-400/10 flex flex-col justify-center">
                <p className="text-blue-500/70 text-[12px] uppercase font-bold tracking-widest mb-2">
                  Platform Access Level
                </p>
                <p className="text-lg font-medium text-blue-100">
                  {doctorData.isVerified
                    ? "Full Diagnostic Review & Patient Queue Access Granted."
                    : "Limited Access. Awaiting administrative review of medical license."}
                </p>
              </div>
            </div>
          </div>

          {/* DOCTOR ACTION CARD */}
          <button className="group relative flex flex-col justify-between p-10 rounded-[3rem] bg-linear-to-br from-indigo-500/40 to-blue-500/30 overflow-hidden hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-blue-500/20 cursor-pointer">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="w-16 h-16 rounded-2xl bg-slate-950/40 flex items-center justify-center text-white mb-10">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white text-3xl font-black uppercase leading-none tracking-tighter mb-2">
                Review
                <br />
                Queue
              </h3>
              <p className="text-white/70 text-xs font-bold tracking-widest uppercase">
                {doctorData.isVerified ? "View Pending AI Scans" : "Locked"}
              </p>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
