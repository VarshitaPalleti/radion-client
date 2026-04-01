"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Predict() {
  const { user } = useAuth(); // Need user to save to their history

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to hold the backend response
  const [result, setResult] = useState<{
    prediction: string;
    confidence: string;
    is_cancer: boolean;
    report_image_base64: string;
  } | null>(null);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation (Max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null); // Reset previous results if any
    }
  };

  // Main Prediction Pipeline
  const handlePredict = async () => {
    if (!selectedFile || !user) return;
    setIsProcessing(true);
    setError(null);

    try {
      // ---------------------------------------------------------
      // 1. UPLOAD TO FASTAPI (Local AI Model)
      // ---------------------------------------------------------
      const formData = new FormData();
      formData.append("file", selectedFile); // FastAPI usually expects the key 'file'

      const aiResponse = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!aiResponse.ok) throw new Error("AI Model failed to process the image.");
      const aiData = await aiResponse.json();

      // ---------------------------------------------------------
      // 2. UPLOAD TO FIREBASE STORAGE (For our records)
      // ---------------------------------------------------------
      // Create a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `scans/${user.uid}/${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      const uploadTask = await uploadBytesResumable(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      // ---------------------------------------------------------
      // 3. SAVE RECORD TO FIRESTORE
      // ---------------------------------------------------------
      await addDoc(collection(db, "history"), {
        patientId: user.uid,
        imageUrl: downloadURL,
        prediction: aiData.prediction,
        confidence: aiData.confidence,
        isCancer: aiData.is_cancer,
        status: "PENDING_REVIEW", // Doctor needs to verify this later
        createdAt: new Date().toISOString(),
      });

      // 4. Update UI with Results
      setResult(aiData);

    } catch (err: any) {
      console.error("Prediction Pipeline Error:", err);
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center py-20 bg-[#010a13] overflow-x-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13]/80 via-[#010a13]/40 to-[#010a13]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            <span className=" bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-montserrat">
              PREDICT YOUR SCAN FOR DETECTION
            </span>
          </h1>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-cyan-600 text-xl font-light tracking-wide uppercase font-opensans">
              ~ A Friendly Eye on your Lung Health
            </p>
            <p className="text-gray-300 text-[18px] italic border-y border-cyan-500/10 py-4 px-6">
              "Breath is life—protect your lungs, protect your future. Early
              detection: Your strongest defense."
            </p>
          </div>
        </div>

        {/* CONDITIONAL LAYOUT 
          If Result exists -> Show Results UI
          If No Result -> Show Upload UI 
        */}
        {result ? (

          /* --- RESULTS UI --- */
          <div className="w-full bg-[#021a24]/60 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-cyan-500/20 p-8 md:p-12 animate-in slide-in-from-bottom-10 duration-700">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* Left Side: Summary & Original Image */}
              <div className="lg:w-1/3 flex flex-col gap-6">
                <div className={`p-6 rounded-3xl border ${result.is_cancer ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {result.is_cancer ? <AlertCircle className="w-8 h-8 text-red-400" /> : <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
                    <h2 className={`text-3xl font-black uppercase tracking-tight ${result.is_cancer ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.prediction}
                    </h2>
                  </div>
                  <p className="text-slate-300 font-opensans uppercase tracking-widest text-sm">
                    AI Confidence: <span className="text-white font-bold">{result.confidence}</span>
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-3xl p-4 border border-white/5">
                  <p className="text-cyan-500/70 text-xs uppercase font-bold tracking-widest mb-3 ml-2">Original Scan</p>
                  {previewUrl && (
                    <img src={previewUrl} alt="Original Scan" className="w-full h-auto rounded-2xl object-cover" />
                  )}
                </div>

                <button
                  onClick={() => { setResult(null); setSelectedFile(null); setPreviewUrl(null); }}
                  className="cursor-pointer mt-auto py-4 rounded-xl border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500/10 transition-all"
                >
                  Analyze Another Scan
                </button>
              </div>

              {/* Right Side: Generated Medical Report Image */}
              <div className="lg:w-2/3 bg-slate-950/80 rounded-[2.5rem] p-6 border border-cyan-500/10 flex flex-col">
                <div className="flex justify-between items-center mb-6 px-4">
                  <h3 className="text-cyan-300 font-montserrat font-bold text-xl uppercase tracking-widest">Clinical AI Report</h3>
                  <span className="px-4 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-widest">Pending Doctor Review</span>
                </div>

                <div className="flex-1 rounded-2xl overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center min-h-[400px]">
                  {/* Render Base64 Image */}
                  <img
                    src={`data:image/png;base64,${result.report_image_base64}`}
                    alt="AI Diagnostic Report"
                    className="w-full h-auto object-contain max-h-[600px]"
                  />
                </div>
              </div>

            </div>
          </div>

        ) : (

          /* --- UPLOAD UI --- */
          <div className="bg-[#021a24]/60 backdrop-blur-3xl w-full max-w-2xl rounded-[3rem] shadow-2xl border-2 border-dashed border-cyan-600/40 flex flex-col items-center p-12 transition-all hover:border-cyan-400/50 group">

            {/* Preview or Icon */}
            {previewUrl ? (
              <div className="mb-8 relative w-48 h-48 rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="mb-8 p-8 rounded-full bg-cyan-500/5 border border-cyan-500/10 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-500">
                <UploadCloud className="w-12 h-12 text-cyan-600" />
              </div>
            )}

            <h2 className="text-gray-300/80 text-3xl font-bold tracking-tight mb-3 font-montserrat">
              {previewUrl ? "Ready for Analysis" : "Upload CT Scan"}
            </h2>
            <p className="text-cyan-100/30 text-center text-sm mb-10 font-opensans">
              Supported formats: DICOM, PNG, JPG (Max 10MB)
            </p>

            {error && (
              <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-center text-sm font-bold">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            {!previewUrl ? (
              <label className="w-full cursor-pointer">
                <div className="bg-cyan-600 text-slate-950 font-black py-5 px-10 rounded-2xl shadow-xl shadow-cyan-500/10 transition-all hover:-translate-y-1 active:translate-y-0 text-center uppercase font-montserrat">
                  Select File
                </div>
                <input type="file" className="hidden" accept="image/*,.dcm" onChange={handleFileChange} />
              </label>
            ) : (
              <button
                onClick={handlePredict}
                disabled={isProcessing}
                className="cursor-pointer w-full bg-linear-to-r from-blue-500 to-cyan-400 text-slate-950 font-black py-5 px-10 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all hover:-translate-y-1 active:scale-95 text-center uppercase font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Analyzing Scan..." : "Run AI Diagnostics"}
              </button>
            )}

            <p className="mt-6 text-[14px] text-orange-400/60 font-helvetica ">
              Your scan will be securely encrypted before processing.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}