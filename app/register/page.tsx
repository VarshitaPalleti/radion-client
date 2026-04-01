"use client";
import Image from "next/image";
import {
  Stethoscope, User
} from "lucide-react";
import Link from "next/link";

export default function Register() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 font-helvetica">
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.jpg"
          fill
          alt="Background"
          className="object-cover opacity-40 grayscale-[0.5]"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/40 to-slate-950"></div>

      <div className="relative z-10 w-full max-w-4xl px-6 py-20 flex flex-col items-center">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-7xl font-black tracking-tighter text-white drop-shadow-sm font-montserrat">
            JOIN US IN THE{" "}
            <span className="bg-linear-to-r from-blue-300 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              MISSION.
            </span>
          </h1>
          <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto leading-relaxed font-opensans">
            Your portal to lung health starts here. Choose your path to join our
            clinical AI network.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 w-full  ">
          <button
            onClick={() => (window.location.href = "/register/patient")}
            className="group relative p-8 rounded-4xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-500 hover:bg-white/[0.08] hover:border-cyan-500/50 hover:scale-[1.02] text-left cursor-pointer"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-500 rounded-4xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <User className="w-8 h-8 text-cyan-600" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 font-montserrat">
                I am a Patient
              </h3>
              <p className="text-slate-400 text-sm font-helvetica">
                Securely upload scans and track your respiratory health journey.
              </p>
            </div>
          </button>
          <button
            onClick={() => (window.location.href = "/register/doctor")}
            className="cursor-pointer group relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-500 hover:bg-white/[0.08] hover:border-blue-500/50 hover:scale-[1.02] text-left"
          >
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-500" />
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <Stethoscope className="w-8 h-8 text-cyan-600" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 font-montserrat">
                I am a Doctor
              </h3>
              <p className="text-slate-400 text-sm font-helvetic">
                Access AI insights and manage patient data with clinical
                precision.
              </p>
            </div>
          </button>
        </div>
        <p className="text-white/80 text-lg mt-10">
            Existing User?{" "}
            <Link
              href="/login"
              className="text-cyan-500 cursor-pointer hover:underline"
            >
              Login
            </Link>
          </p>
      </div>
    </main>
  );
}
