"use client"
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[url('/homescr.jpg')] bg-contain bg-center overflow-x-hidden ">
      <div className="min-h-screen w-full flex flex-col bg-black/85 backdrop-blur-[1px]">

        <section className="text-white flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-5xl animate-in fade-in zoom-in duration-1000">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent font-montserrat">
              Welcome to{" "}
              <span className="bg-linear-to-b from-cyan-300 to-cyan-950/60 bg-clip-text text-transparent">
                Radion
              </span>
            </h1>
            <h2 className="text-xl md:text-3xl mt-6 italic text-cyan-100/80 tracking-wide font-open-sans">
              Your Friendly Lung Cancer Detection Tool
            </h2>
            <div className="mt-12 p-8 md:p-12 bg-blue-950/40 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl mx-auto max-w-4xl transform hover:scale-[1.01] transition-transform duration-500 font-helvetica">
              <p className="text-lg md:text-xl leading-relaxed text-blue-50 font-light">
                Radion bridges the gap between complex medical imaging and
                actionable insights. By leveraging advanced{" "}
                <span className="text-cyan-300 font-semibold">
                  Machine Learning
                </span>
                , we provide a supportive first step in identifying potential
                risks with <span className="">speed and precision</span>
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center font-helvetica ">
                <button
                  onClick={() => (window.location.href = "/register")}
                  className="cursor-pointer bg-linear-to-b from-cyan-500 to-cyan-800/90 hover:bg-cyan-100 text-blue-950 font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 font-helvetica"
                >
                  Get Started
                </button>
                <button className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/20 py-4 px-10 rounded-2xl transition-all backdrop-blur-md font-helvetica">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-2 text-white bg-[#020617]">
          <div className="container mx-auto px-6 flex flex-col items-center">
            <h1 className="text-5xl  mb-14 bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-tight font-montserrat font-extrabold">
              CORE FEATURES
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl">
              <div className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 duration-500 hover:shadow-blue-400 shadow-2xl transition-all">
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 mb-6 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                    <img src="instant.svg" />
                  </div>
                  <h2 className="text-xl font-bold mb-4 text-white font-opensans">
                    Instant Analysis
                  </h2>
                  <p className="text-slate-400 leading-relaxed font-light font-helvetica">
                    Upload your CT scans or X-rays and receive a preliminary
                    AI-driven analysis in seconds.
                  </p>
                </div>
              </div>
              <div className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 hover:shadow-blue-400 shadow-2xl  transition-all duration-500 ">
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 mb-6 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 ring-1 ring-cyan-500/20">
                    <img src="precise.svg" />
                  </div>
                  <h2 className="text-xl font-bold mb-4 text-white font-opensans">
                    High Precision ML
                  </h2>
                  <p className="text-slate-400 leading-relaxed font-light font-helvetica">
                    Powered by neural networks trained on thousands of clinical
                    data points for reliable results.
                  </p>
                </div>
              </div>
              <div className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50   hover:shadow-blue-400 shadow-2xl transition-all duration-500 ">
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 mb-6 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 ring-1 ring-indigo-500/20">
                    <img src="privacy.svg" />
                  </div>
                  <h2 className="text-xl font-bold mb-4 text-white font-opensans">
                    Privacy First
                  </h2>
                  <p className="text-slate-400 leading-relaxed font-light font-helvetica">
                    Your medical data is encrypted and handled with the highest
                    standards of security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-[#020617] text-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center mb-16 font-montserrat">
              <h1 className="text-5xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-tight text-center">
                THE "RADION" EDGE
              </h1>
              <span className="mt-2 px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase border border-blue-500/20">
                Benefits
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              <div className="md:col-span-2 group relative p-10 rounded-2xl bg-slate-900/40 border overflow-hidden  border-cyan-200/20 hover:border-cyan-500 hover:shadow-blue-400 shadow-2xl  transition-all duration-500">
                <div className="absolute inset-0 bg-linear  -to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full justify-between font-opensans ">
                  <div>
                    <div className="w-12 h-12 p-1.5 mb-6 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 ">
                      <img src="usercentric.svg" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                      User-Centric Reports
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md font-helvetica">
                      No more confusing jargon. Radion generates easy-to-read
                      reports that you can take directly to your doctor. Don't
                      just see data; understand it. Our AI translates complex
                      clinical findings into clear, actionable visual reports
                      for both patients and doctors.
                    </p>
                  </div>
                  <div className="mt-8 flex gap-2">
                    <div className="h-1 w-20 rounded-full bg-blue-500" />
                    <div className="h-1 w-8 rounded-full bg-slate-700" />
                    <div className="h-1 w-8 rounded-full bg-slate-700" />
                  </div>
                </div>
              </div>
              <div className="group relative p-8 rounded-2xl bg-slate-900/40 border border-cyan-200/20 transition-all duration-500 hover:border-cyan-500 hover:shadow-blue-400 shadow-2xl ">
                <div className="relative z-10 flex flex-col items-center text-center font-montserrat mt-10 ">
                  <div className="w-16 h-16 mb-8 p-3 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 ring-1 ring-cyan-500/5">
                    <img src="accessible.svg" />
                  </div>
                  <h2 className="text-xl font-bold mb-4 font-opensans">
                    Accessible Anywhere
                  </h2>
                  <p className="text-slate-400 font-light leading-relaxed font-helvetica">
                    Secure cloud-syncing allows you to review scans on any
                    device, ensuring critical data is always at your fingertips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-[#020617] pt-20 pb-10 border-t border-slate-900">
          <div className="container mx-auto px-6">
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h4 className="text-amber-500 font-bold text-sm uppercase tracking-widest font-montserrat">
                    Critical Medical Disclaimer
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium font-opensans">
                    "Radion is an AI-assisted screening tool designed to{" "}
                    <span className="text-white underline decoration-amber-500/50 underline-offset-4 font-montserrat">
                      support, not replace
                    </span>
                    , professional medical diagnosis. The information provided
                    is for informational purposes only. Please consult a
                    qualified radiologist for clinical confirmation."
                  </p>
                </div>
              </div>
            </div>
         
          </div>
        </footer>
      </div>
    </main>
  );
}
