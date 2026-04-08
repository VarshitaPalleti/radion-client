"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Github, MessageSquare, Send } from "lucide-react";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen relative py-20 bg-[#010a13] text-cyan-50 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-5xl">
        {/* HEADER */}
        <div className="mb-12 border-b border-cyan-500/10 pb-8 text-center md:text-left">
          <Link
            href="/"
            className="text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-400 transition-all flex items-center gap-2 mb-6 w-max mx-auto md:mx-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase font-montserrat tracking-tighter text-white">
            Get in <span className="text-cyan-400">Touch</span>
          </h1>
          <p className="text-cyan-600/80 mt-4 max-w-2xl font-opensans text-lg">
            Whether you have a technical question, want to discuss the AI model, or are interested in collaborating, we would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* LEFT: CONTACT INFO CARDS */}
          <div className="md:col-span-2 space-y-6">
            {/* Email Card */}
            <a
              href="mailto:varshitapalleti@gmail.com"
              className="group flex flex-col p-8 rounded-[2rem] bg-[#021a24]/40 backdrop-blur-xl border border-cyan-500/10 hover:border-cyan-400/50 hover:bg-[#021a24]/80 transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-white text-xl font-bold font-montserrat mb-2">Email Us</h3>
              <p className="text-cyan-100/70 font-helvetica text-sm mb-4">For technical support and clinical inquiries.</p>
              <p className="text-cyan-400 font-mono font-bold tracking-tight">varshitapalleti@gmail.com</p>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/VarshitaPalleti/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-8 rounded-[2rem] bg-[#021a24]/40 backdrop-blur-xl border border-cyan-500/10 hover:border-cyan-400/50 hover:bg-[#021a24]/80 transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Github className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-white text-xl font-bold font-montserrat mb-2">GitHub</h3>
              <p className="text-cyan-100/70 font-helvetica text-sm mb-4">Check out the source code and documentation.</p>
              <p className="text-cyan-400 font-mono font-bold tracking-tight">github.com/VarshitaPalleti</p>
            </a>
          </div>

          {/* RIGHT: MESSAGE FORM */}
          <div className="md:col-span-3 bg-gradient-to-br from-cyan-950/20 to-blue-950/10 border border-cyan-500/20 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl">
            <h3 className="text-cyan-300 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-8 border-b border-cyan-500/10 pb-4">
              <MessageSquare className="w-5 h-5" /> Send a Direct Message
            </h3>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We will get back to you soon."); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-cyan-600 uppercase tracking-widest pl-1">Your Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full bg-black/40 border border-cyan-500/20 rounded-2xl px-5 py-4 text-cyan-50 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 transition-all font-helvetica text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-cyan-600 uppercase tracking-widest pl-1">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full bg-black/40 border border-cyan-500/20 rounded-2xl px-5 py-4 text-cyan-50 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 transition-all font-helvetica text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-600 uppercase tracking-widest pl-1">Message</label>
                <textarea required rows={5} placeholder="How can we help you?" className="w-full bg-black/40 border border-cyan-500/20 rounded-2xl px-5 py-4 text-cyan-50 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 transition-all resize-none font-helvetica text-sm" />
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm cursor-pointer">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}