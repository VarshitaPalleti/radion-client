"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      // 1. Pop up Google Login
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Check the Firestore database for this user's UID
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // 3. Route based on their role
        if (userData.role === "PATIENT") {
          router.push("/patient/profile");
        } else if (userData.role === "DOCTOR") {
          router.push("/doctor/profile");
        } else {
          router.push("/"); // Fallback
        }
      } else {
        // User logged in with Google but hasn't filled out the Radion registration form yet!
        alert("Account not found. Redirecting to registration.");
        router.push("/register");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login with Google.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/homescre.jpg')] bg-cover bg-center overflow-y-auto font-helvetica">
      <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-evenly p-6 md:p-20 bg-black/40 backdrop-blur-[2px]">
        {/* LEFT TEXT AREA */}
        <div className="max-w-xl text-left space-y-6 mb-12">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight text-white drop-shadow-2xl font-montserrat">
            Breathe <br />
            <span className="text-cyan-300">Easier.</span>
          </h1>

          <div className="space-y-4 font-opensans">
            <p className="text-[#cfecf7] text-xl lg:text-2xl font-light max-w-md">
              Breath is life—protect your lungs, protect your future.
            </p>
            <p className="text-white/60 text-lg italic border-l-2 border-cyan-400 pl-4">
              "Take control of your health before symptoms appear. Early
              detection: Your strongest defense."
            </p>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
        </div>

        {/* LOGIN BOX */}
        <div className="p-10 text-center bg-[#081d32]/60 backdrop-blur-xl w-full max-w-[450px] rounded-[30px] border border-white/10">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:opacity-90"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png"
              className="w-5 h-5"
              alt="Google"
            />
            {isLoggingIn ? "Signing in..." : "Sign in with Google"}
          </button>

          <p className="text-white/80 mt-5">
            New User?{" "}
            <Link
              href="/register"
              className="text-cyan-500 cursor-pointer hover:underline"
            >
              Register Now
            </Link>
          </p>

          {/* TABS (These are visual right now, since Google figures out the role automatically) */}

          {/* <div className="flex p-4 gap-2">
            <button className="flex-1 bg-white/5 text-white font-medium py-3 rounded-2xl hover:bg-cyan-500/20 transition-all border border-white/5">
              Patient
            </button>
            <button className="flex-1 bg-white/5 text-white font-medium py-3 rounded-2xl hover:bg-cyan-500/20 transition-all border border-white/5">
              Doctor
            </button>
          </div>

          <div className="p-10 pt-4">
            <h2 className="text-white text-3xl font-bold mb-8 font-serif tracking-tight">
              Login
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest ml-1 mb-2 block">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full bg-white/5 px-5 py-4 text-white border border-white/10 rounded-2xl focus:border-cyan-400 focus:bg-white/10 outline-none transition-all"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <label className="text-white/50 text-xs  ml-1 mb-2 block">
                  PASSWORD
                </label>
                <input
                  type="password"
                  className="w-full bg-white/5 px-5 py-4 text-white border border-white/10 rounded-2xl focus:border-cyan-400 focus:bg-white/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={() =>
                  alert("Please use Google Sign-in below for now!")
                }
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#081d32] font-black py-4 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Sign In
              </button>

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex mx-4 text-white/50 text-xs">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-400 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png"
                  className="w-5 h-5"
                  alt="Google"
                />
                {isLoggingIn ? "Signing in..." : "Sign in with Google"}
              </button>
            </div>

            <div className="mt-8 text-center space-y-3">
              <p className="text-white/50 text-sm">
                Ohh ooriki kottha aa.. Chudu pandaga chesukuntav{" "}
                <Link
                  href="/register"
                  className="text-cyan-400 cursor-pointer hover:underline"
                >
                  Register Now
                </Link>
              </p>
              <p className="text-white/50 text-s cursor-pointer hover:text-white transition-colors">
                Raatleda..ade gurthuratleda password..
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
}
