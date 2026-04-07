"use client";

// 1. IMPORT `use` FROM REACT
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, CheckCircle2, AlertTriangle, User, Activity } from "lucide-react";

// 2. UPDATE THE TYPE DEFINITION TO PROMISE
export default function ReviewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // 3. UNWRAP THE PARAMS USING React.use()
  const unwrappedParams = use(params);
  const reviewId = unwrappedParams.id;

  const [record, setRecord] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Wait until auth is done and we have the reviewId
    if (authLoading || !user || !reviewId) return;

    const fetchData = async () => {
      try {
        // 4. USE THE UNWRAPPED `reviewId` HERE
        const recordSnap = await getDoc(doc(db, "history", reviewId));
        if (recordSnap.exists()) {
          const recordData = recordSnap.data();
          setRecord(recordData);

          // Fetch Patient Details
          const patientSnap = await getDoc(doc(db, "users", recordData.patientId));
          if (patientSnap.exists()) {
            setPatient(patientSnap.data());
          }
        }
      } catch (error) {
        console.error("Error fetching review details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reviewId, user, authLoading]); // Update dependency array to use reviewId

  const handleVerify = async () => {
    if (!notes.trim()) {
      alert("Please provide clinical notes before verifying.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 5. USE THE UNWRAPPED `reviewId` HERE TOO
      await updateDoc(doc(db, "history", reviewId), {
        status: "REVIEWED",
        doctorId: user?.uid,
        doctorNotes: notes,
        patientName: patient?.name || "Unknown Patient",
        reviewedAt: new Date().toISOString(),
      });

      router.push("/doctor/history");
    } catch (error) {
      console.error("Failed to verify record:", error);
      alert("An error occurred while saving the review.");
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) return <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400">Loading Clinical Data...</div>;
  if (!record) return <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-red-400">Record not found.</div>;

  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">
      <div className="relative z-10 container mx-auto px-6 max-w-6xl">

        {/* HEADER */}
        <div className="flex justify-between items-end mb-8 border-b border-cyan-500/10 pb-6">
          <div>
            <Link href="/doctor/review" className="text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-400 transition-all flex items-center gap-2 mb-4 w-max">
              <ArrowLeft className="w-4 h-4" /> Back to Queue
            </Link>
            <h1 className="text-4xl font-black uppercase font-montserrat tracking-tighter">Clinical Review Panel</h1>
            {/* 6. USE THE UNWRAPPED `reviewId` IN THE UI */}
            <p className="text-cyan-500 font-mono text-sm mt-2">CASE ID: {reviewId.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: PATIENT INFO & AI RESULTS */}
          <div className="lg:col-span-1 space-y-6">

            {/* AI Result Card */}
            <div className={`p-8 rounded-[2rem] border backdrop-blur-xl ${record.isCancer ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
              <p className="text-[11px] uppercase tracking-widest font-bold mb-2 opacity-70">AI Diagnostic Flag</p>
              <h2 className={`text-3xl font-black uppercase mb-1 ${record.isCancer ? 'text-red-400' : 'text-emerald-400'}`}>
                {record.prediction}
              </h2>
              <p className="text-sm font-mono opacity-80 mb-6">Confidence: {record.confidence}</p>

              {record.isCancer ? (
                <div className="flex gap-2 text-xs text-red-300 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> Immediate review recommended based on neural network analysis.
                </div>
              ) : (
                <div className="flex gap-2 text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> No malignant patterns detected by standard AI thresholds.
                </div>
              )}
            </div>

            {/* Patient Vitals Card */}
            <div className="p-8 rounded-[2rem] bg-[#021a24]/40 border border-cyan-500/10 backdrop-blur-xl">
              <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-6 border-b border-cyan-500/10 pb-3">
                <User className="w-4 h-4" /> Patient Context
              </h3>

              {patient ? (
                <div className="space-y-4 font-helvetica">
                  <div><p className="text-xs text-cyan-600 uppercase font-bold">Name</p><p className="text-lg font-bold">{patient.name}</p></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-cyan-600 uppercase font-bold">Age / Gender</p><p className="font-bold">{patient.dob ? (new Date().getFullYear() - new Date(patient.dob).getFullYear()) : "--"} / {patient.gender}</p></div>
                    <div><p className="text-xs text-cyan-600 uppercase font-bold">Blood</p><p className="font-bold">{patient.bloodGroup || "--"}</p></div>
                    <div><p className="text-xs text-cyan-600 uppercase font-bold">BMI</p><p className="font-bold">{patient.bmi || "--"}</p></div>
                  </div>
                  <div><p className="text-xs text-cyan-600 uppercase font-bold mt-2">Allergies</p><p className="text-sm text-cyan-100/70 bg-black/30 p-2 rounded-lg">{patient.allergies || "None reported"}</p></div>
                  <div><p className="text-xs text-cyan-600 uppercase font-bold mt-2">Pre-existing</p><p className="text-sm text-cyan-100/70 bg-black/30 p-2 rounded-lg">{patient.diseases || "None reported"}</p></div>
                </div>
              ) : (
                <p className="text-sm text-cyan-500/50 italic">Patient details unavailable.</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: SCAN & ACTION FORM */}
          <div className="lg:col-span-2 space-y-6">

            {/* The Image */}
            <div className="bg-[#021a24]/40 border border-cyan-500/10 rounded-[2rem] overflow-hidden backdrop-blur-xl p-4 h-[400px] flex items-center justify-center relative">
              <img src={record.imageUrl} alt="Patient CT Scan" className="max-w-full max-h-full object-contain rounded-xl" />
              <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono text-cyan-300">
                RAW_DICOM_EXTRACT
              </div>
            </div>

            {/* Doctor Input Form */}
            <div className="bg-gradient-to-br from-indigo-950/40 to-cyan-950/30 border border-cyan-500/20 rounded-[2rem] p-8 backdrop-blur-xl">
              <h3 className="text-cyan-300 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4" /> Clinical Verification & Notes
              </h3>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your clinical findings, verify or reject the AI prediction, and provide next steps for the patient..."
                className="w-full h-32 bg-black/40 border border-cyan-500/30 rounded-2xl p-4 text-cyan-50 placeholder:text-cyan-700/50 focus:outline-none focus:border-cyan-400 transition-all resize-none font-helvetica text-sm mb-6"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleVerify}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black px-8 py-4 rounded-xl transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isSubmitting ? "Verifying Record..." : "Verify & Save Diagnosis"}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}