"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Server } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen relative py-20 bg-[#010a13] text-cyan-50 overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-4xl">
        {/* HEADER */}
        <div className="mb-12 border-b border-cyan-500/10 pb-8">
          <Link
            href="/"
            className="text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-400 transition-all flex items-center gap-2 mb-6 w-max"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase font-montserrat tracking-tighter text-white mb-4">
            Privacy <span className="text-cyan-400">Policy</span>
          </h1>
          <p className="text-cyan-600/80 font-opensans text-sm uppercase tracking-widest font-bold">
            Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* HIGHLIGHT BOX */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 mb-12 flex gap-4 backdrop-blur-sm">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-1">Our Commitment</h3>
            <p className="text-emerald-100/70 text-sm font-helvetica leading-relaxed">
              At Radion, we treat your medical data with the highest level of security. Your CT scans, vitals, and diagnostic records are heavily encrypted and strictly access-controlled. We do not sell your personal or medical data to third parties.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-12 font-helvetica text-cyan-100/80 leading-relaxed text-sm md:text-base bg-[#021a24]/40 p-8 md:p-12 rounded-[3rem] border border-cyan-500/10 backdrop-blur-xl">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-montserrat flex items-center gap-3">
              <Server className="w-5 h-5 text-cyan-500" /> 1. Information We Collect
            </h2>
            <p className="mb-4">To provide accurate AI diagnostics and clinical review capabilities, Radion collects the following data:</p>
            <ul className="list-disc pl-6 space-y-2 text-cyan-100/60 marker:text-cyan-600">
              <li><strong>Authentication Data:</strong> Name and Email Address provided securely via Google OAuth.</li>
              <li><strong>Clinical Vitals:</strong> Height, weight, age, blood group, allergies, and pre-existing conditions entered during registration.</li>
              <li><strong>Medical Imaging:</strong> CT scans and X-ray images (DICOM, PNG, JPG) uploaded for AI prediction.</li>
              <li><strong>Professional Credentials:</strong> Medical License Numbers and specializations (for Doctor accounts only).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-montserrat flex items-center gap-3">
              <Lock className="w-5 h-5 text-cyan-500" /> 2. How We Use Your Data
            </h2>
            <p className="mb-4">Your data is utilized strictly for the functionality of the Radion platform:</p>
            <ul className="list-disc pl-6 space-y-2 text-cyan-100/60 marker:text-cyan-600">
              <li>To run machine learning inferences on uploaded scans to detect anomalies.</li>
              <li>To generate comprehensive clinical reports for your personal history.</li>
              <li>To allow verified medical professionals on the Radion network to review your scans and provide secondary clinical validation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-montserrat">
              3. Data Security & Storage
            </h2>
            <p className="mb-4">
              All data is processed and stored using Google Firebase infrastructure. Uploaded medical scans are stored in secure Firebase Cloud Storage buckets, while textual clinical records are housed in Firestore databases. Data is encrypted in transit using standard HTTPS protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-montserrat">
              4. Third-Party Services
            </h2>
            <p className="mb-4">
              Radion utilizes a proprietary, locally-hosted Python FastAPI engine for AI inference. Uploaded scans are transmitted to this engine exclusively for the duration of the prediction process. We use Google Authentication for identity verification to ensure no passwords are stored directly on our servers.
            </p>
          </section>

          <section className="border-t border-cyan-500/20 pt-8 mt-12">
            <h2 className="text-xl font-bold text-white mb-4 font-montserrat">
              Contact Privacy Officer
            </h2>
            <p className="mb-2">If you have questions regarding this privacy policy or wish to request the deletion of your medical records from our servers, please contact us at:</p>
            <a href="mailto:varshitapalleti@gmail.com" className="text-cyan-400 font-bold hover:underline">
              varshitapalleti@gmail.com
            </a>
          </section>

        </div>
      </div>
    </main>
  );
}