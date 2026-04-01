"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CaseReviewDeepDive() {
  const [agreement, setAgreement] = useState<string | null>(null);

  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-15 grayscale pointer-events-none">
        <Image
          src="/background.jpg"
          fill
          alt=""
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-cyan-500/30 pb-10">
          <div className="space-y-4 text-left">
            <Link
              href="/doctor/review"
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
              Back to Queue
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              <span className="bg-linear-to-b from-cyan-300 to-cyan-950/60 bg-clip-text text-transparent uppercase">
                Palleti VARSHITA
              </span>
            </h1>
            <p className="text-cyan-400/70 text-[13px] font-bold tracking-widest uppercase mt-1">
              Age: 22 Years • Submitted 2 hours ago
            </p>
          </div>

          <div className="bg-[#021a24]/60 backdrop-blur-xl px-8 py-4 rounded-3xl border border-cyan-500/20 text-right">
            <p className="text-cyan-500 text-[12px] uppercase font-bold">
              Clinical Status
            </p>
            <p className="text-xl font-black text-rose-400 animate-pulse uppercase tracking-widest">
              Urgent Review
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1  gap-8 items-stretch">
          <div className="lg:col-span-1 bg-[#021a24]/40 backdrop-blur-3xl rounded-[3rem] border border-cyan-500/10 p-10 flex flex-col gap-8">
            <h3 className="text-cyan-400/60 text-[15px] uppercase font-black tracking-widest">
              Analysis Assets
            </h3>

            <FileItem label="Uploaded Scan" name="LUNG_CT_V44.DCM" type="RAW" />
            <FileItem
              label="AI Predicted Mask"
              name="AI_PREDICT_V44.PNG"
              type="AI"
              isAI
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#021a24]/40 backdrop-blur-3xl rounded-[3rem] border border-cyan-500/10 p-10">
              <h3 className="text-cyan-400/70 text-[15px] uppercase font-black tracking-widest mb-8">
                AI Accuracy Verification
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                <ScaleBtn
                  label="Disagree"
                  val="1"
                  current={agreement}
                  set={setAgreement}
                  hoverStyle="hover:border-rose-500 hover:bg-rose-500/20 hover:text-rose-400"
                />
                <ScaleBtn
                  label="Slightly Disagree"
                  val="2"
                  current={agreement}
                  set={setAgreement}
                  hoverStyle="hover:border-orange-500 hover:bg-orange-500/20 hover:text-orange-400"
                />
                <ScaleBtn
                  label="Slightly Agree"
                  val="3"
                  current={agreement}
                  set={setAgreement}
                  hoverStyle="hover:border-amber-400 hover:bg-amber-400/20 hover:text-amber-300"
                />
                <ScaleBtn
                  label="Agree"
                  val="4"
                  current={agreement}
                  set={setAgreement}
                  hoverStyle="hover:border-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400"
                />
              </div>

              <div className="space-y-4">
                <p className="text-cyan-400/70 text-[13px] uppercase font-black tracking-widest">
                  Clinical Feedbacks & Observations
                </p>
                <textarea
                  rows={5}
                  placeholder="Type your medical advice or findings here..."
                  className="w-full bg-black/40 border border-cyan-500/20 rounded-2xl p-6 text-cyan-50 font-sans text-s focus:border-cyan-400 outline-none transition-all placeholder:text-cyan-300/30"
                />
              </div>
              <button className="mt-10 w-full bg-linear-to-b from-cyan-300 to-cyan-600 text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-cyan-500/10 hover:shadow-cyan-400/30 transition-all active:scale-[0.98] uppercase text-[13px] tracking-widest cursor-pointer">
                Submit Formal Diagnosis
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
function FileItem({
  label,
  name,
  type,
  isAI = false,
}: {
  label: string;
  name: string;
  type: string;
  isAI?: boolean;
}) {
  return (
    <div className="group cursor-pointer">
      <p className="text-cyan-400/40 text-[10px] uppercase font-black tracking-widest mb-2">
        {label}
      </p>
      <div
        className={`flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border transition-all ${isAI ? "bg-cyan-500/5 border-cyan-400/30" : "bg-black/40 border-cyan-500/10 group-hover:border-cyan-400/40"}`}
      >
        <div className="flex items-center gap-4 truncate">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] ${isAI ? "bg-cyan-400 text-slate-950" : "bg-cyan-950 text-cyan-400"}`}
          >
            {type}
          </div>
          <p className="text-cyan-50 font-mono text-sm truncate">{name}</p>
        </div>
        <svg
          className="w-5 h-5 text-cyan-400/40 group-hover:text-cyan-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </div>
  );
}
function ScaleBtn({
  label,
  val,
  current,
  set,
  hoverStyle,
}: {
  label: string;
  val: string;
  current: string | null;
  set: (val: string) => void;
  hoverStyle: string;
}) {
  const isActive = current === val;
  return (
    <button
      onClick={() => set(val)}
      className={`px-2 py-4 rounded-xl border text-[12px] font-black uppercase tracking-widest transition-all cursor-pointer 
      ${
        isActive
          ? "bg-cyan-400 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          : `bg-cyan-950/40 border-cyan-500/10 text-cyan-300/80 ${hoverStyle}`
      }`}
    >
      {label}
    </button>
  );
}
