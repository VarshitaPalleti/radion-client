"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Define what information our Context will hold
interface AuthContextType {
  user: User | null;
  role: "PATIENT" | "DOCTOR" | null;
  loading: boolean;
}

// Create the actual context with default empty values
const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"PATIENT" | "DOCTOR" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This Firebase function listens for login/logout events automatically
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // If logged in, fetch their role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
        }
      } else {
        // If logged out, clear the role
        setRole(null);
      }

      setLoading(false); // Stop the loading spinner once we know their status
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// A simple hook so your other pages can easily ask: const { user, role } = useAuth()
export const useAuth = () => useContext(AuthContext);
