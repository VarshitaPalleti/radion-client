"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Clock, CheckCircle, FileText, ExternalLink } from "lucide-react";

export default function PatientHistory() {
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait until we know who the user is
    if (authLoading || !user) return;

    // Create a query to find only THIS patient's history records
    const historyRef = collection(db, "history");
    const q = query(historyRef, where("patientId", "==", user.uid));

    // onSnapshot sets up a REAL-TIME listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Sort client-side to show newest records first
      historyData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setRecords(historyData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setIsLoading(false);
    });

    // Cleanup the listener when the user leaves the page
    return () => unsubscribe();
  }, [user, authLoading]);

  // Helper to format dates nicely
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (authLoading) {
    return <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400">Loading Auth...</div>;
  }

  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-6xl">

        {/* BACK BUTTON */}
        <div className="space-y-4 mb-8">
          <Link
            href="/patient/profile"
            className="cursor-pointer text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-300 transition-all flex items-center gap-2 w-max"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-cyan-500/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              <span className=" bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase font-montserrat">
                MEDICAL RECORDS HISTORY
              </span>
            </h1>
          </div>
          <div className="bg-[#021a24]/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-cyan-500/20 text-right min-w-[150px]">
            <p className="text-cyan-600 text-[13px] uppercase font-bold tracking-widest">
              Total Entries
            </p>
            <p className="text-3xl font-black text-cyan-100">
              {isLoading ? "-" : records.length}
            </p>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#021a24]/40 backdrop-blur-3xl rounded-[3rem] border border-cyan-500/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cyan-500/10 bg-black/20">
                  <th className="p-6 md:p-8 text-cyan-600 text-[13px] font-bold uppercase tracking-widest font-montserrat whitespace-nowrap">
                    Date & Time
                  </th>
                  <th className="p-6 md:p-8 text-cyan-600 text-[13px] font-bold uppercase tracking-widest font-montserrat whitespace-nowrap">
                    Uploaded Scan
                  </th>
                  <th className="p-6 md:p-8 text-cyan-600 text-[13px] font-bold uppercase tracking-widest font-montserrat whitespace-nowrap">
                    AI Prediction
                  </th>
                  <th className="p-6 md:p-8 text-cyan-600 text-[13px] font-bold uppercase tracking-widest font-montserrat whitespace-nowrap">
                    Review Status
                  </th>
                  <th className="p-6 md:p-8 text-cyan-600 text-[13px] font-bold uppercase tracking-widest font-montserrat whitespace-nowrap text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/5">

                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-cyan-500 animate-pulse">
                      Syncing with secure database...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <FileText className="w-12 h-12 text-cyan-800" />
                        <p className="text-cyan-600/80 text-[15px] uppercase tracking-widest font-bold">
                          No records found
                        </p>
                        <Link href="/patient/predict" className="mt-4 px-6 py-2 bg-cyan-600/20 text-cyan-400 rounded-xl hover:bg-cyan-600/40 transition">
                          Upload your first scan
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-cyan-500/5 transition-colors group">

                      {/* DATE */}
                      <td className="p-6 md:p-8 text-cyan-100/80 font-mono text-sm whitespace-nowrap">
                        {formatDate(record.createdAt)}
                      </td>

                      {/* UPLOADED FILE PREVIEW */}
                      <td className="p-6 md:p-8">
                        <a href={record.imageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-max group-hover:text-cyan-300 transition">
                          <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex-shrink-0">
                            <img src={record.imageUrl} alt="Scan thumbnail" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" />
                          </div>
                          <span className="text-sm font-medium underline decoration-cyan-500/30 underline-offset-4">View Raw Scan</span>
                        </a>
                      </td>

                      {/* AI PREDICTION */}
                      <td className="p-6 md:p-8">
                        <div className="flex flex-col">
                          <span className={`font-black uppercase tracking-wider ${record.isCancer ? 'text-red-400' : 'text-emerald-400'}`}>
                            {record.prediction || "UNKNOWN"}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            Conf: {record.confidence || "--"}
                          </span>
                        </div>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="p-6 md:p-8">
                        {record.status === "PENDING_REVIEW" ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-black uppercase whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase whitespace-nowrap">
                            <CheckCircle className="w-3.5 h-3.5" /> Reviewed
                          </div>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-6 md:p-8 text-right">
                        <Link
                          href={`/patient/history/${record.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/50 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition-all text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                        >
                          Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 text-center bg-cyan-950/30 border-t border-cyan-500/10">
            <p className="text-cyan-600/50 text-xs uppercase tracking-widest font-bold">
              {isLoading ? "Fetching secure records..." : "End of Records"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}