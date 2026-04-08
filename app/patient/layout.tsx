import ProtectedRoute from "../components/ProtectedRoute";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This instantly protects /patient/profile, /patient/predict, /patient/history, etc.
    <ProtectedRoute allowedRole="PATIENT">
      {children}
    </ProtectedRoute>
  );
}