"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, AlertCircle, CheckCircle2, Download, RefreshCcw } from "lucide-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Predict() {
  const { user } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{
    prediction: string;
    confidence: string;
    is_cancer: boolean;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile || !user) return;
    setIsProcessing(true);
    setError(null);

    try {
      // 1. UPLOAD TO FASTAPI
      const formData = new FormData();
      formData.append("file", selectedFile);

      const aiResponse = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!aiResponse.ok) throw new Error("AI Model failed to process the image.");
      const aiData = await aiResponse.json();

      // 2. UPLOAD TO FIREBASE STORAGE
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `scans/${user.uid}/${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      const uploadTask = await uploadBytesResumable(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      // 3. SAVE RECORD TO FIRESTORE
      await addDoc(collection(db, "history"), {
        patientId: user.uid,
        imageUrl: downloadURL,
        prediction: aiData.prediction,
        confidence: aiData.confidence,
        isCancer: aiData.is_cancer,
        status: "PENDING_REVIEW",
        createdAt: new Date().toISOString(),
      });

      // 4. Update UI
      setResult({
        prediction: aiData.prediction,
        confidence: aiData.confidence,
        is_cancer: aiData.is_cancer
      });

    } catch (err: any) {
      console.error("Prediction Pipeline Error:", err);
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to load images asynchronously for the Canvas
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // --- PREMIUM NATIVE CANVAS DOWNLOAD GENERATOR ---
  const handleDownloadReport = async () => {
    if (!result || !previewUrl) return;

    try {
      // Load both images before drawing
      const [scanImg, logoImg] = await Promise.all([
        loadImage(previewUrl),
        loadImage("/logo.png") // Ensure logo.png is in your /public folder
      ]);

      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Base Background (Main Dark Theme)
      ctx.fillStyle = "#010a13";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Premium Inner Card with Curved Borders
      ctx.fillStyle = "#021a24";
      ctx.beginPath();
      ctx.roundRect(40, 40, 720, 920, 40); // x, y, width, height, border-radius
      ctx.fill();
      ctx.strokeStyle = "rgba(6, 182, 212, 0.2)"; // Soft cyan border
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Draw Radion Logo (Centered at top)
      const logoSize = 80;
      ctx.drawImage(logoImg, canvas.width / 2 - logoSize / 2, 70, logoSize, logoSize);

      // 4. Draw Header Text
      ctx.fillStyle = "#22d3ee"; // Cyan-400
      ctx.font = "900 32px Arial"; // bolder font
      ctx.textAlign = "center";
      ctx.fillText("RADION CLINICAL AI REPORT", 400, 190);

      ctx.fillStyle = "#94a3b8"; // Slate-400
      ctx.font = "16px Arial";
      ctx.fillText(`PATIENT ID: ${user?.uid.substring(0, 8).toUpperCase()}  |  DATE: ${new Date().toLocaleDateString()}`, 400, 225);

      // Separator Line
      ctx.strokeStyle = "rgba(34, 211, 238, 0.1)"; // Very faint cyan
      ctx.beginPath();
      ctx.moveTo(100, 250);
      ctx.lineTo(700, 250);
      ctx.stroke();

      // 5. Draw the Medical Scan with Curved Borders (Clipping Mask)
      const imgSize = 360;
      const imgX = (canvas.width - imgSize) / 2;
      const imgY = 290;

      ctx.save(); // Save context state before clipping
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 24); // 24px radius
      ctx.clip(); // Clip everything drawn after this to the rounded rectangle

      // Draw a black background behind the image just in case it has transparency
      ctx.fillStyle = "#000000";
      ctx.fillRect(imgX, imgY, imgSize, imgSize);
      // Draw image
      ctx.drawImage(scanImg, imgX, imgY, imgSize, imgSize);
      ctx.restore(); // Restore context to remove clipping mask for the rest of the canvas

      // Draw the glowing cyan border around the image
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 24);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.6)"; // Cyan-500
      ctx.lineWidth = 4;
      ctx.stroke();

      // 6. Draw Premium Results Box (Curved Borders)
      const boxY = 690;
      const isCancer = result.is_cancer;

      // Box Background
      ctx.fillStyle = isCancer ? "rgba(220, 38, 38, 0.1)" : "rgba(16, 185, 129, 0.1)";
      ctx.beginPath();
      ctx.roundRect(100, boxY, 600, 160, 24);
      ctx.fill();

      // Box Border
      ctx.strokeStyle = isCancer ? "rgba(248, 113, 113, 0.5)" : "rgba(52, 211, 153, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Box Content
      ctx.fillStyle = isCancer ? "#f87171" : "#34d399";
      ctx.font = "900 42px Arial";
      ctx.fillText(`AI FLAG: ${result.prediction}`, 400, boxY + 70);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "20px Arial";
      ctx.fillText(`Confidence Score: ${result.confidence}`, 400, boxY + 115);

      // 7. Draw Footer Disclaimer
      ctx.fillStyle = "#64748b";
      ctx.font = "italic 14px Arial";
      ctx.fillText("Disclaimer: This is an AI-generated preliminary screening report.", 400, 910);
      ctx.fillText("It is not a final diagnosis. Pending verification by a registered clinician.", 400, 935);

      // 8. Trigger Download
      const link = document.createElement('a');
      link.download = `Radion_Scan_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

    } catch (error) {
      console.error("Error generating report image:", error);
      alert("Failed to generate report image.");
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center py-20 bg-[#010a13] overflow-x-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13]/80 via-[#010a13]/40 to-[#010a13]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">

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
              "Breath is life—protect your lungs, protect your future. Early detection: Your strongest defense."
            </p>
          </div>
        </div>

        {result ? (
          /* --- RE-DESIGNED RESULTS UI --- */
          <div className="w-full max-w-2xl bg-[#021a24]/60 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-cyan-500/20 p-8 md:p-12 animate-in slide-in-from-bottom-10 duration-700 flex flex-col items-center text-center">

            {/* Image Preview */}
            <div className="w-64 h-64 rounded-3xl overflow-hidden border-2 border-cyan-500/30 mb-8 bg-black/50 p-2 shadow-xl shadow-cyan-500/10">
              <img src={previewUrl!} alt="Original Scan" className="w-full h-full object-cover rounded-2xl" />
            </div>

            {/* AI Result Badge */}
            <div className={`w-full p-6 rounded-3xl border mb-8 ${result.is_cancer ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                {result.is_cancer ? <AlertCircle className="w-8 h-8 text-red-400" /> : <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
                <h2 className={`text-4xl font-black uppercase tracking-tight ${result.is_cancer ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.prediction}
                </h2>
              </div>
              <p className="text-slate-300 font-opensans uppercase tracking-widest text-sm">
                AI Confidence: <span className="text-white font-bold">{result.confidence}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadReport}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black py-4 rounded-2xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
              >
                <Download className="w-5 h-5" /> Download Report
              </button>

              <button
                onClick={() => { setResult(null); setSelectedFile(null); setPreviewUrl(null); }}
                className="flex-1 flex items-center justify-center gap-2 border border-cyan-500/30 text-cyan-400 font-bold py-4 rounded-2xl hover:bg-cyan-500/10 transition-all uppercase tracking-widest text-sm"
              >
                <RefreshCcw className="w-5 h-5" /> New Scan
              </button>
            </div>

          </div>

        ) : (

          /* --- UPLOAD UI --- */
          <div className="bg-[#021a24]/60 backdrop-blur-3xl w-full max-w-2xl rounded-[3rem] shadow-2xl border-2 border-dashed border-cyan-600/40 flex flex-col items-center p-12 transition-all hover:border-cyan-400/50 group">
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
                className="w-full bg-linear-to-r from-blue-500 to-cyan-400 text-slate-950 font-black py-5 px-10 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all hover:-translate-y-1 active:scale-95 text-center uppercase font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
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