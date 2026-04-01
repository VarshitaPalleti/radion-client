"use client";
import Image from "next/image";
import Link from "next/link";

export default function DoctorReview() {
  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">
      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-cyan-500/10 pb-10">
          <div className="space-y-4 text-left">
            <Link
              href="/doctor/profile"
              className="text-cyan-500/80 text-[13px] font-bold uppercase hover:text-cyan-300 transition-all flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Doctor Dashboard
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              <span className=" bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase text-center font-montserrat">
                PENDING REVIEWS
              </span>
            </h1>
          </div>

          <div className="bg-[#021a24]/60 backdrop-blur-xl px-8 py-4 rounded-3xl border border-cyan-600  text-right">
            <p className="text-cyan-500 text-[12px] uppercase font-bold ">
              Cases to Review
            </p>
            <p className="text-3xl font-black text-cyan-100">01</p>
          </div>
        </div>
        <div className="space-y-8">
          <PatientReviewCard
            name="Palleti Varshita"
            age="22"
            file="LUNG_CT_V44.DCM"
            status="Critical"
            time="2 hours ago"
          />
        </div>

       
      </div>
    </main>
  );
}

function PatientReviewCard({
  name,
  age,
  file,
  status,
  time,
}: {
  name: string;
  age: string;
  file: string;
  status: "Critical" | "Stable" | "Pending";
  time: string;
}) {
  const statusConfig = {
    Critical:
      "text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-pulse",
    Stable: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    Pending: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  };

  return (
    <div className="group relative w-full bg-[#021a24]/40 backdrop-blur-3xl rounded-[3rem] border border-cyan-500/10 py-14 px-10 flex flex-col md:flex-row items-center justify-between transition-all duration-500 hover:border-cyan-400/40 hover:bg-[#021a24]/60 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center gap-8 mb-8 md:mb-0">
        <div className="w-20 h-20 rounded-3xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-2xl">
          {name.charAt(0)}
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase group-hover:text-cyan-300 transition-colors">
            {name}
          </h2>
          <p className="text-cyan-600 text-[13px] font-bold tracking-widest uppercase mt-1 font-opensans">
            Age: {age} Years • {time}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-10 w-full md:w-auto">
        <div className="flex flex-col md:items-end">
          <p className="text-cyan-600 text-[10px] uppercase font-black tracking-widest mb-2 font-opensans ">
            Source Scan
          </p>
          <div className="flex items-center gap-3 text-cyan-50 font-mono text-sm bg-black/40 px-5 py-3 rounded-xl border border-cyan-500/10 shadow-lg">
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {file}
          </div>
        </div>
        <div
          className={`px-8 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-[0.2em] shadow-inner ${statusConfig[status]}`}
        >
          {status}
        </div>
        <button className="  bg-linear-to-r from-blue-400/50 to-cyan-300/50 text-transparentt font-black px-10 py-5 rounded-2xl shadow-xl shadow-cyan-500/10 hover:shadow-cyan-400/20 cursor-pointer transition-all active:scale-95 uppercase text-[13px] tracking-widest">
          Open Record
        </button>
      </div>
      <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-cyan-400/20 rounded-r-full group-hover:bg-cyan-400 transition-all duration-500" />
    </div>
  );
}
