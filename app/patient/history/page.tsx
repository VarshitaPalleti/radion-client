"use client";
import Image from "next/image";
import Link from "next/link";
export default function PatientHistory() {
  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">
 
      <div className="space-y-4 ml-75 mb-4 cursor-pointer">
        <Link
          href="/doctor/profile"
          className="cursor-pointer text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-300 transition-all flex items-center gap-2"
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
          Back to Dashboard
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="flex flex-row  justify-between items-end gap-6 mb-12 border-b border-cyan-500/10 pb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              <span className=" bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase font-montserrat">
                MEDICAL RECORDS HISTORY
              </span>
            </h1>
          </div>
          <div className="bg-[#021a24]/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-cyan-500/20 text-right">
            <p className="text-cyan-600 text-[15px] uppercase font-bold tracking-widest">
              Total Entries
            </p>
            <p className="text-2xl font-black text-cyan-100">0</p>
          </div>
        </div>
        <div className="bg-[#021a24]/40 backdrop-blur-3xl rounded-[3rem] border border-cyan-500/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cyan-500/10">
                  <th className="p-8 text-cyan-600 text-[15px] font-bold uppercase font-montserrat">
                    Date
                  </th>
                  <th className="p-8 text-cyan-600 text-[15px] font-bold uppercase font-montserrat">
                    Uploaded File
                  </th>
                  <th className="p-8 text-cyan-600 text-[15px] font-bold uppercase font-montserrat ">
                    Status
                  </th>
                  <th className="p-8 text-cyan-600 text-[15px] font-bold uppercase font-montserrat">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="p-8 text-center bg-cyan-700/20">
            <p className="text-cyan-600/60 text-[15px] uppercase tracking-widest font-bold ">
              End of Records
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
