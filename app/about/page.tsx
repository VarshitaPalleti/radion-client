"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#010a13] text-slate-300 selection:bg-cyan-500/30">
      <div className="relative z-10 container mx-auto px-6 py-10 max-w-5xl">
        <div className="mb-20 text-center">
          <Link
            href="/"
            className="text-cyan-500/50 text-[10px] font-bold tracking-[0.4em] uppercase hover:text-cyan-400 transition-all mb-6 inline-block"
          >
            Back to Portal
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 uppercase font-montserrat">
            <span className=" bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Precision in Every Breath
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-sm md:text-base font-medium font-opensans">
            Radion is a decentralized AI diagnostic layer designed to assist
            medical professionals in the early detection of pulmonary
            conditions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-[#021a24]/40 border border-white/5 rounded-3xl p-10 backdrop-blur-3xl flex flex-col justify-center">
            <h3 className="text-cyan-600 text-[10px] font-bold uppercase mb-4 font-opensans">
              The Mission
            </h3>
            <h2 className="text-2xl font-bold text-white mb-4">
              Universal Lung Health.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md font-helvetica">
              We provide clinical-grade AI screening tools to healthcare
              providers worldwide, ensuring that early-stage lung anomalies are
              caught when they are most treatable.
            </p>
          </div>

          <div className="md:col-span-4 bg-linear-to-br from-cyan-400/50 to-blue-600/50 rounded-3xl p-10 flex flex-col justify-between shadow-xl shadow-cyan-500/10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-slate-950 text-4xl font-black tracking-tighter font-opensans">
                99.2%
              </p>
              <p className="text-slate-950/60 text-[13px] font-black uppercase mt-1 font-helvetica">
                Sensitivity Rate
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#021a24]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
            <div className="text-cyan-600 mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h4 className="text-white font-bold text-sm uppercase mb-2 font-opensans">
              Privacy First
            </h4>
            <p className="text-slate-500 text-s leading-relaxed font-medium font-helvetica">
              Encrypted patient data protocols. Fully HIPAA & GDPR compliant.
            </p>
          </div>
          <div className="md:col-span-4 bg-[#021a24]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
            <div className="text-cyan-600 mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2 font-opensans">
              Clinical Support
            </h4>
            <p className="text-slate-500 text-s leading-relaxed font-medium font-helvetica">
              A second-opinion tool designed to support, not replace, medical
              experts.
            </p>
          </div>
          <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-center items-center text-center">
            <p className="text-cyan-400 text-[10px] font-bold uppercase mb-4 font-opensans">
              Start Analysis
            </p>
            <Link
              href="/register"
              className="text-white text-sm font-black underline underline-offset-8 decoration-cyan-500 hover:text-cyan-400 transition-all uppercase font-montserrat"
            >
              Join the Mission
            </Link>
            <ArrowRight className="m-5" />
          </div>
        </div>
      </div>
    </main>
  );
}
