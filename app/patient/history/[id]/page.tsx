"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, FileText, Stethoscope } from "lucide-react";

export default function PatientHistoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading: authLoading } = useAuth();

  // Unwrap the params promise for Next.js 15+
  const unwrappedParams = use(params);
  const recordId = unwrappedParams.id;

  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user || !recordId) return;

    const fetchRecord = async () => {
      try {
        const recordSnap = await getDoc(doc(db, "history", recordId));
        if (recordSnap.exists() && recordSnap.data().patientId === user.uid) {
          setRecord({ id: recordSnap.id, ...recordSnap.data() });
        } else {
          setRecord(null); // Record doesn't exist or doesn't belong to this patient
        }
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [recordId, user, authLoading]);

  // Helper to format dates
  const formatDate = (isoString: string) => {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(date);
  };

  if (isLoading || authLoading) return <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400">Loading Report Details...</div>;
  if (!record) return <div className="min-h-screen bg-[#010a13] flex flex-col items-center justify-center text-red-400 gap-4">Record not found or access denied. <Link href="/patient/history" className="text-cyan-400 underline">Go Back</Link></div>;

  const isReviewed = record.status === "REVIEWED";

  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 border-b border-cyan-500/10 pb-6">
          <Link href="/patient/history" className="text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-400 transition-all flex items-center gap-2 mb-6 w-max">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase font-montserrat tracking-tighter text-white">
                Scan Report Details
              </h1>
              <p className="text-cyan-500 font-mono text-sm mt-2">ID: {record.id.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-cyan-600/80 text-xs font-bold uppercase tracking-widest">Submitted On</p>
              <p className="text-cyan-100 font-mono text-sm">{formatDate(record.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* STATUS BANNER */}
        <div className={`mb-8 p-4 rounded-2xl border backdrop-blur-md flex items-center gap-4 ${isReviewed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
          {isReviewed ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm">
              {isReviewed ? "Clinical Review Completed" : "Pending Doctor Review"}
            </h3>
            <p className="text-xs opacity-80 mt-1">
              {isReviewed ? `Reviewed on ${formatDate(record.reviewedAt)}` : "Your scan has been analyzed by AI and is currently awaiting verification from a registered clinician."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: ORIGINAL SCAN & AI RESULTS */}
          <div className="space-y-8">
            <div className="bg-[#021a24]/40 border border-cyan-500/10 rounded-[2rem] overflow-hidden backdrop-blur-xl p-4">
              <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-4 px-2">
                <FileText className="w-4 h-4" /> Original Upload
              </h3>
              <div className="rounded-xl overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center">
                <img src={record.imageUrl} alt="Patient CT Scan" className="w-full h-auto object-contain max-h-[300px]" />
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] border backdrop-blur-xl ${record.isCancer ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
              <p className="text-[11px] uppercase tracking-widest font-bold mb-2 opacity-70">AI Preliminary Finding</p>
              <h2 className={`text-3xl font-black uppercase mb-1 ${record.isCancer ? 'text-red-400' : 'text-emerald-400'}`}>
                {record.prediction}
              </h2>
              <p className="text-sm font-mono opacity-80 mb-6">Confidence Score: {record.confidence}</p>

              {record.isCancer ? (
                <div className="flex gap-3 text-xs text-red-300">
                  <AlertTriangle className="w-5 h-5 shrink-0" /> AI detected anomalies requiring immediate clinical attention. Please await your doctor's notes.
                </div>
              ) : (
                <div className="flex gap-3 text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> AI detected no significant malignant patterns. Doctor verification pending.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: DOCTOR'S CLINICAL NOTES */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-cyan-950/30 border border-cyan-500/20 rounded-[2rem] p-8 backdrop-blur-xl h-full flex flex-col">
            <h3 className="text-cyan-300 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-6 border-b border-cyan-500/20 pb-4">
              <Stethoscope className="w-5 h-5" /> Official Clinical Summary
            </h3>

            {isReviewed ? (
              <div className="flex-1 flex flex-col">
                <div className="bg-black/30 rounded-2xl p-6 border border-cyan-500/10 flex-1">
                  <p className="text-cyan-50 font-helvetica text-base leading-relaxed whitespace-pre-wrap italic">
                    "{record.doctorNotes}"
                  </p>
                </div>
                <div className="mt-6 text-right">
                  <p className="text-cyan-600/80 text-xs font-bold uppercase tracking-widest mb-1">Reviewed By</p>
                  {/* Note: You might want to save the Doctor's name in the record when they review it to display it here! */}
                  <p className="text-cyan-300 font-bold">Registered Clinician</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <Clock className="w-16 h-16 text-cyan-600 mb-4" />
                <h4 className="font-bold text-cyan-400 uppercase tracking-widest mb-2">Review in Progress</h4>
                <p className="text-sm font-helvetica text-cyan-100/70 max-w-xs">
                  A registered doctor has not yet finalized the review of this scan. Check back later for official clinical notes.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}