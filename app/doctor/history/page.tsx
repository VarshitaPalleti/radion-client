"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Search, ArrowLeft, CheckCircle2, FileText } from "lucide-react";

export default function DoctorHistory() {
  const { user, loading: authLoading } = useAuth();

  // States for data and UI
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    // Fetch records that THIS doctor has reviewed
    const historyRef = collection(db, "history");
    const q = query(
      historyRef,
      where("doctorId", "==", user.uid),
      where("status", "==", "REVIEWED")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Sort newest first based on when it was reviewed
      historyData.sort((a, b) => new Date(b.reviewedAt || b.createdAt).getTime() - new Date(a.reviewedAt || a.createdAt).getTime());

      setRecords(historyData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching doctor history:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // Helper to format dates
  const formatDate = (isoString: string) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date); // Output: 30 Jan 2026
  };

  // Filter records based on the search input
  const filteredRecords = records.filter(record =>
    (record.patientName || "Unknown Patient").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400">Loading Doctor Profile...</div>;
  }

  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl">

        {/* HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-cyan-500/10 pb-10">

          <div className="space-y-4 font-montserrat">
            <Link
              href="/doctor/profile"
              className="text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-700 transition-all flex items-center gap-2 w-max"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={3} />
              Back to Dashboard
            </Link>
            <h1 className="md:text-7xl text-5xl font-black leading-none">
              <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-montserrat uppercase">
                REVIEW HISTORY
              </span>
            </h1>
          </div>

          <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap gap-3 items-center">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600" />
              <input
                type="text"
                placeholder="Search Patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cyan-950/20 border border-cyan-500/30 rounded-2xl py-4 pl-12 pr-6 focus:border-cyan-400 outline-none transition-all text-sm text-cyan-50 placeholder:text-cyan-800"
              />
            </div>

            {/* TOTAL ENTRIES */}
            <div className="bg-[#021a24]/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-cyan-500/20 text-right min-w-[140px]">
              <p className="text-cyan-500/90 text-[12px] uppercase font-bold tracking-widest">
                Total Entries
              </p>
              <p className="text-2xl font-black text-cyan-100 leading-tight">
                {isLoading ? "-" : filteredRecords.length}
              </p>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#021a24]/40 backdrop-blur-3xl rounded-[3rem] border border-cyan-500/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-cyan-500/10">
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica whitespace-nowrap">
                    Date
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica whitespace-nowrap">
                    Patient Name
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica whitespace-nowrap">
                    Uploaded Files
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica whitespace-nowrap">
                    AI Predict Result
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica whitespace-nowrap">
                    Clinical Status
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica w-1/4">
                    Summary / Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/5">

                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-cyan-500 animate-pulse font-bold">
                      Loading your clinical records...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <FileText className="w-12 h-12 text-cyan-800" />
                        <p className="text-cyan-600/80 text-[15px] uppercase tracking-widest font-bold">
                          {searchTerm ? "No patients match your search." : "No records reviewed yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-cyan-400/5 transition-colors group">

                      {/* DATE */}
                      <td className="p-8 text-cyan-50 font-medium whitespace-nowrap">
                        {formatDate(record.reviewedAt || record.createdAt)}
                      </td>

                      {/* PATIENT NAME */}
                      <td className="p-8 text-cyan-50 font-bold whitespace-nowrap">
                        {record.patientName || "Unknown Patient"}
                      </td>

                      {/* UPLOADED FILE LINK */}
                      <td className="p-8">
                        <a href={record.imageUrl} target="_blank" rel="noreferrer" className="text-cyan-400/80 text-sm hover:text-cyan-300 hover:underline underline-offset-4 transition">
                          View Original
                        </a>
                      </td>

                      {/* AI PREDICTION RESULT */}
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className={`text-sm font-black uppercase tracking-wider ${record.isCancer ? 'text-red-400' : 'text-emerald-400'}`}>
                            {record.prediction || "UNKNOWN"}
                          </span>
                          <span className="text-[10px] text-cyan-600/80 font-mono mt-1">
                            {record.confidence} CONFIDENCE
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-8">
                        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase inline-flex items-center gap-2 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3" /> Reviewed
                        </span>
                      </td>

                      {/* DOCTOR SUMMARY / NOTES */}
                      <td className="p-8 text-cyan-100/80 text-sm italic border-l border-cyan-500/10 bg-cyan-950/10">
                        "{record.doctorNotes || "No clinical notes provided."}"
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-10 text-center bg-cyan-950/20 border-t border-cyan-500/5">
            <p className="text-cyan-500/30 text-[15px] uppercase font-bold">
              {isLoading ? "Syncing..." : "End of Clinical Records"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}