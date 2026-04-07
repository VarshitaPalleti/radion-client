"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
// Note: Make sure your useAuth hook is set up to provide the current user
import { onAuthStateChanged } from "firebase/auth";

export default function PatientProfile() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // Fetch User Data on Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData({ id: user.uid, ...docSnap.data() });
          setEditData(docSnap.data()); // Prep edit state
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Helper function to calculate age from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return "--";
    const dob = new Date(dobString);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditData((prev: any) => {
      const newData = { ...prev, [name]: value };
      // Auto-update BMI if weight/height changes during edit
      if (name === "weight" || name === "height") {
        const h = parseFloat(newData.height) / 100;
        const w = parseFloat(newData.weight);
        if (h > 0 && w > 0) newData.bmi = (w / (h * h)).toFixed(2);
      }
      return newData;
    });
  };

  const handleSave = async () => {
    if (!profileData?.id) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", profileData.id), {
        weight: editData.weight,
        height: editData.height,
        bmi: editData.bmi,
        allergies: editData.allergies,
        diseases: editData.diseases,
      });
      setProfileData({ ...profileData, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-cyan-400">
        Loading Profile Data...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#010a13] flex items-center justify-center text-red-400">
        No profile found. Please register.
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center py-20 bg-[#010a13] overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-20 grayscale pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-[#010a13] via-transparent to-[#010a13]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-10 bg-[#021a24]/60 backdrop-blur-3xl p-12 rounded-[4rem] border border-cyan-500/10 shadow-2xl">
          <div className="relative group">
            <div className="w-44 h-44 rounded-full border-2 border-dashed border-cyan-400/30 p-2 group-hover:border-cyan-400 transition-all duration-700">
              <div className="w-full h-full rounded-full bg-cyan-950/40 flex items-center justify-center overflow-hidden">
                <svg
                  className="w-20 h-20 text-cyan-300/20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>
            <label className="absolute bottom-2 right-2 bg-linear-to-b from-blue-400 to-cyan-300 p-3 rounded-2xl cursor-pointer hover:rotate-12 transition-all shadow-xl font-montserrat">
              <svg
                className="w-5 h-5 text-slate-950"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
              </svg>
              <input type="file" className="hidden" />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-6xl font-black tracking-tighter mb-2">
              <span className=" bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent uppercase font-montserrat">
                {profileData.name}
              </span>
            </h1>
            <p className="text-cyan-600 text-m font-bold mb-6 uppercase font-opensans">
              USER ID: {profileData.id.substring(0, 8).toUpperCase()}
            </p>

            {/* TOGGLE EDIT BUTTON */}
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 rounded-xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase hover:bg-emerald-500/30 transition-all cursor-pointer font-opensans"
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-3 rounded-xl border border-cyan-500/20 text-cyan-600 text-xs font-black uppercase hover:bg-cyan-500/10 transition-all cursor-pointer font-opensans"
              >
                Edit Medical Profile
              </button>
            )}
          </div>
        </div>

        {/* VITALS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="col-span-2 bg-[#021a24]/40 backdrop-blur-xl border border-cyan-500/10 rounded-4xl p-10">
            <h2 className="text-cyan-600 text-[20px] font-bold font-montserrat uppercase mb-10 border-b border-cyan-500/5 pb-4">
              Biometric Vitals
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 font-helvetica ">
              <div>
                <p className="text-cyan-600 text-[15px] uppercase font-bold tracking-widest mb-1">
                  Blood
                </p>
                <p className="text-2xl font-black text-white ">
                  {profileData.bloodGroup || "--"}
                </p>
              </div>

              <div>
                <p className="text-cyan-600 text-[15px] uppercase font-bold tracking-widest mb-1">
                  Age
                </p>
                <p className="text-2xl font-black text-white ">
                  {calculateAge(profileData.dob)} Yrs
                </p>
              </div>

              <div>
                <p className="text-cyan-600 text-[15px] uppercase font-bold tracking-widest mb-1">
                  Weight
                </p>
                {isEditing ? (
                  <input
                    name="weight"
                    value={editData.weight}
                    onChange={handleEditChange}
                    className="w-full bg-slate-900/50 border border-cyan-500/50 rounded-lg p-1 text-white font-black text-xl"
                  />
                ) : (
                  <p className="text-2xl font-black text-white ">
                    {profileData.weight} KG
                  </p>
                )}
              </div>

              <div>
                <p className="text-cyan-600 text-[15px] uppercase font-bold tracking-widest mb-1">
                  Height
                </p>
                {isEditing ? (
                  <input
                    name="height"
                    value={editData.height}
                    onChange={handleEditChange}
                    className="w-full bg-slate-900/50 border border-cyan-500/50 rounded-lg p-1 text-white font-black text-xl"
                  />
                ) : (
                  <p className="text-2xl font-black text-white ">
                    {profileData.height} CM
                  </p>
                )}
              </div>

              <div className="col-span-2 p-6 rounded-3xl bg-cyan-400/5 border border-cyan-400/10 flex flex-col justify-center">
                <p className="text-cyan-600 text-[10px] uppercase font-bold tracking-widest mb-1">
                  Body Mass Index
                </p>
                <p className="text-3xl font-black text-cyan-100">
                  {isEditing ? editData.bmi : profileData.bmi}{" "}
                </p>
              </div>

              <div className="col-span-2 font-helvetica">
                <p className="text-cyan-600 text-[15px] uppercase font-bold tracking-widest mb-1">
                  Registered Email
                </p>
                <p className="text-lg font-bold text-cyan-50 truncate">
                  {profileData.email}
                </p>
              </div>
            </div>
          </div>

          <button className="group relative flex flex-col justify-between p-10 rounded-[3rem]  bg-linear-to-r from-blue-400/50 to-cyan-300/50 overflow-hidden hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-cyan-500/20 cursor-pointer">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="w-16 h-16 rounded-2xl bg-slate-950/20 flex items-center justify-center text-slate-950 mb-10">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white/80 text-3xl font-black uppercase leading-none tracking-tighter mb-2">
                Clinical
                <br />
                History
              </h3>
              <p className="text-white/70 text-xs font-bold tracking-widest uppercase">
                View Records
              </p>
            </div>
          </button>

          {/* MEDICAL HISTORY SECTION */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8 bg-[#021a24]/40 border border-cyan-500/10 rounded-4xl p-10">
            <div>
              <p className="text-cyan-600 text-[15px]  uppercase font-bold tracking-widest mb-4 font-opensans">
                Known Allergies
              </p>
              {isEditing ? (
                <textarea
                  name="allergies"
                  value={editData.allergies}
                  onChange={handleEditChange}
                  className="w-full text-cyan-100 text-sm leading-relaxed bg-cyan-950/80 p-5 rounded-2xl border border-cyan-500/50 shadow-inner font-helvetica min-h-25"
                />
              ) : (
                <p className="text-cyan-100 text-sm leading-relaxed bg-cyan-950/40 p-5 rounded-2xl border border-cyan-500/5 shadow-inner font-helvetica min-h-25">
                  {profileData.allergies || "No allergies reported."}
                </p>
              )}
            </div>
            <div>
              <p className="text-cyan-300/70 text-[15px]  uppercase font-bold tracking-widest mb-4 font-opensans">
                Existing Conditions
              </p>
              {isEditing ? (
                <textarea
                  name="diseases"
                  value={editData.diseases}
                  onChange={handleEditChange}
                  className="w-full font-helvetica text-cyan-100 text-sm leading-relaxed bg-cyan-950/80 p-5 rounded-2xl border border-cyan-500/50 shadow-inner min-h-25"
                />
              ) : (
                <p className="font-helvetica text-cyan-100 text-sm leading-relaxed bg-cyan-950/40 p-5 rounded-2xl border border-cyan-500/5 shadow-inner min-h-25">
                  {profileData.diseases || "No existing conditions reported."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
