"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Clock, AlertCircle, ChevronRight, Stethoscope, CheckCircle2 } from "lucide-react";

export default function ReviewQueue() {
  const { user, loading: authLoading } = useAuth();
  const [pendingRecords, setPendingRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    // Fetch ALL records that need review
    const historyRef = collection(db, "history");
    const q = query(historyRef, where("status", "==", "PENDING_REVIEW"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort oldest first (First In, First Out queue)
      records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setPendingRecords(records);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching review queue:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // Helper to format dates
  const formatDate = (isoString: string) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    }).format(date);
  };

  if (authLoading) return <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400">Loading Access...</div>;

  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-cyan-500/10 pb-10">
          <div className="space-y-4 font-montserrat">
            <Link href="/doctor/profile" className="text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-700 transition-all flex items-center gap-2 w-max">
              <ArrowLeft className="w-4 h-4" strokeWidth={3} /> Back to Dashboard
            </Link>
            <h1 className="md:text-6xl text-4xl font-black leading-none">
              <span className="bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent font-montserrat uppercase">
                CLINICAL REVIEW QUEUE
              </span>
            </h1>
          </div>

          <div className="bg-[#021a24]/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-amber-500/20 text-right">
            <p className="text-amber-500/90 text-[12px] uppercase font-bold tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Pending Cases
            </p>
            <p className="text-3xl font-black text-amber-100 leading-tight">
              {isLoading ? "-" : pendingRecords.length}
            </p>
          </div>
        </div>

        {/* QUEUE LIST */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center text-cyan-500 animate-pulse font-bold bg-[#021a24]/40 rounded-4xl border border-cyan-500/10">
              Fetching pending cases...
            </div>
          ) : pendingRecords.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center bg-[#021a24]/40 rounded-4xl border border-cyan-500/10">
              <CheckCircle2 className="w-16 h-16 text-emerald-500/50 mb-4" />
              <h3 className="text-2xl font-bold text-emerald-400 mb-2 font-montserrat">Queue is Empty</h3>
              <p className="text-cyan-600/80 font-opensans">All patient scans have been reviewed.</p>
            </div>
          ) : (
            pendingRecords.map((record) => (
              <div key={record.id} className="group flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-[#021a24]/40 backdrop-blur-xl rounded-4xl border border-cyan-500/10 hover:border-cyan-400/50 hover:bg-[#021a24]/80 transition-all duration-300 shadow-xl">

                <div className="flex items-center gap-6 w-full md:w-auto mb-6 md:mb-0">
                  <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 overflow-hidden shrink-0 relative">
                    <img src={record.imageUrl} alt="Scan" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500" />
                    {record.isCancer && <div className="absolute inset-0 border-2 border-red-500/50 rounded-2xl pointer-events-none" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-mono text-cyan-500 uppercase tracking-widest">
                        {formatDate(record.createdAt)}
                      </span>
                      {record.isCancer && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-400 uppercase tracking-widest border border-red-500/20">High Priority</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white font-montserrat flex items-center gap-2">
                      Patient ID: <span className="text-cyan-100/70 font-mono text-lg">{record.patientId.substring(0, 6).toUpperCase()}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center w-full md:w-auto gap-8 justify-between md:justify-end">
                  <div className="text-left md:text-right hidden sm:block">
                    <p className="text-[10px] text-cyan-600 uppercase font-bold tracking-widest mb-1">AI Flag</p>
                    <p className={`font-black uppercase tracking-wider ${record.isCancer ? 'text-red-400' : 'text-emerald-400'}`}>
                      {record.prediction} ({record.confidence})
                    </p>
                  </div>

                  <Link
                    href={`/doctor/review/${record.id}`}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black px-6 py-3 rounded-xl transition-all hover:scale-105 uppercase tracking-widest text-xs"
                  >
                    <Stethoscope className="w-4 h-4" /> Review Case <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}