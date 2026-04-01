"use client";
import Image from "next/image";
import Link from "next/link";

export default function DoctorHistory() {
  return (
    <main className="min-h-screen relative py-16 bg-[#010a13] text-cyan-50 overflow-x-hidden">
            <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-cyan-500/10 pb-10">
          <div className="space-y-4 font-montserrat">
            <Link
              href="/doctor/profile"
              className="text-cyan-600 text-[13px] font-bold uppercase hover:text-cyan-700 transition-all flex items-center gap-2"
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
            <h1 className="md:text-7xl font-black leading-none">
              <span className=" bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent bg-clip-text text-transparent font-montserrat uppercase">
                REVIEW HISTORY
              </span>
            </h1>
          </div>

          <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap gap-3">
            <input
              type="text"
              placeholder="Search Patient..."
              className="flex-1 bg-cyan-950/20 border border-cyan-500/10 rounded-2xl py-4 px-6 focus:border-cyan-400 outline-none transition-all text-sm"
            />
            <button className="bg-[#021a24] p-4 rounded-2xl border border-cyan-500/10 hover:border-cyan-400 transition-colors">
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
            <div className="bg-[#021a24]/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-cyan-500/20 text-right">
              <p className="text-cyan-500/90 text-[12px] uppercase font-bold tracking-widest">
                Total Entries
              </p>
              <p className="text-2xl font-black text-cyan-100 leading-tight">
                12
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#021a24]/40 backdrop-blur-3xl rounded-[3rem] border border-cyan-500/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cyan-500/10">
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica">
                    Date
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica">
                    Patient Name
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica">
                    Uploaded Files
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica">
                    Predict Files
                  </th>

                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica">
                    Clinical Status
                  </th>
                  <th className="p-8 text-cyan-600 text-[14px] font-bold uppercase tracking-wider font-helvetica">
                    Summary
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/5">
                <tr className="hover:bg-cyan-400/5 transition-colors group">
                  <td className="p-8 text-cyan-50 font-medium">30 Jan 2026</td>
                  <td className="p-8 text-cyan-50 font-bold">
                    Palleti Varshita
                  </td>
                  <td className="p-8 text-cyan-400/80 text-m ">scan_v1.jpg</td>
                  <td className="p-8 text-cyan-400/80 text-m">result_v1.jpg</td>
                  <td className="p-8">
                    <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                      Reviewed
                    </span>
                  </td>
                  <td className="p-8 text-cyan-100/80 text-m ">
                    Bane unav ala malli raaku
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-10 text-center bg-cyan-950/20 border-t border-cyan-500/5">
            <p className="text-cyan-500/30 text-[15px] uppercase font-bold">
              End of Clinical Records
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
