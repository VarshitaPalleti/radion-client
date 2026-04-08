import ProtectedRoute from "../components/ProtectedRoute";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This instantly protects /doctor/profile, /doctor/review, /doctor/history, etc.
    <ProtectedRoute allowedRole="DOCTOR">
      {children}
    </ProtectedRoute>
  );
}