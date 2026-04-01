"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ADDED for routing
import {
  ArrowLeft,
  Activity,
  Calendar,
  Droplet,
  User,
  Scale,
  Ruler,
} from "lucide-react";

// FIREBASE IMPORTS ADDED
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function PatientRegister() {
  const router = useRouter(); // ADDED
  const [isProcessing, setIsProcessing] = useState(false); // ADDED for loading state

  const [formData, setFormData] = useState({
    name: "",
    email: "", // We keep this as an optional fallback, but Google will provide the real one
    dob: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    weight: "",
    height: "",
    bmi: "",
    diseases: "",
  });

  // Auto-calculate BMI
  useEffect(() => {
    if (formData.weight && formData.height) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      if (heightInMeters > 0) {
        const bmiValue = (
          weightInKg /
          (heightInMeters * heightInMeters)
        ).toFixed(2);
        setFormData((prev) => ({ ...prev, bmi: bmiValue }));
      }
    }
  }, [formData.weight, formData.height]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATED: FIREBASE LOGIC
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Open Google Sign In Popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Save all form data to Firestore using the Google UID
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...formData,
          name: formData.name || user.displayName, // Use typed name, or fallback to Google name
          email: user.email, // Force use of verified Google email
          role: "PATIENT", // Crucial for routing later
          createdAt: new Date().toISOString(),
        },
        { merge: true },
      );

      // 3. Redirect to Patient Profile
      router.push("/patient/profile");
    } catch (error) {
      console.error("Patient Registration Error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/homescr.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen w-full bg-black/85 backdrop-blur-[2px] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-500">
          <div className="mb-8 border-b border-white/10 pb-6">
            <Link
              href="/register"
              className="text-cyan-600 flex items-center gap-2 text-sm hover:text-cyan-800 transition mb-4"
            >
              <ArrowLeft className="w-4 h-4  font-montserrat" /> Back to
              Selection
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-montserrat">
              Patient Registration
            </h1>
            <p className="text-slate-400 mt-2 font-opensans">
              Create your health profile for AI-driven insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-100/80 font-helvetica">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    name="name"
                    required
                    placeholder="Umaru"
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-100/80 font-helvetica">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="vpalleti@gmail.com (Optional)"
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>

              {/* REMOVED PASSWORD FIELD HERE */}

              <div className="space-y-2 font-helvetica">
                <label className="text-sm font-medium text-cyan-100/80">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="date"
                    name="dob"
                    required
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2 font-helvetica">
                <label className="text-sm font-medium text-cyan-100/80">
                  Gender
                </label>
                <select
                  name="gender"
                  required
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2 font-helvetica">
                <label className="text-sm font-medium text-cyan-100/80">
                  Blood Group
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-3.5 w-5 h-5 text-red-500/80" />
                  <select
                    name="bloodGroup"
                    required
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  >
                    <option value="">Select Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-blue-950/20 p-6 rounded-2xl border border-white/5 space-y-6 ">
              <h3 className="text-lg font-semibold text-cyan-600 flex items-center gap-2">
                <Activity className="w-5 h-5 font-opensans" /> Vitals & Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-helvetica">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-100/80">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      name="weight"
                      placeholder="e.g. 70"
                      onChange={handleChange}
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-100/80">
                    Height (cm)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      name="height"
                      placeholder="e.g. 175"
                      onChange={handleChange}
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-100/80">
                    BMI (Auto)
                  </label>
                  <input
                    type="text"
                    name="bmi"
                    value={formData.bmi}
                    readOnly
                    placeholder="--"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 px-4 text-cyan-400 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-helvetica">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-100/80">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    rows={2}
                    placeholder="Peanuts, Penicillin..."
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-100/80">
                    Pre-existing Diseases
                  </label>
                  <textarea
                    name="diseases"
                    rows={2}
                    placeholder="Diabetes, Asthma..."
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* UPDATED SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center justify-center gap-3 font-helvetica cursor-pointer w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transform transition hover:-translate-y-1 active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                "Authenticating with Google..."
              ) : (
                <>
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5 bg-white rounded-full p-0.5"
                  />
                  Sign Up & Complete Registration
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
