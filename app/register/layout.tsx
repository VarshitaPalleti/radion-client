import PublicRoute from "../components/PublicRoute";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      {children}
    </PublicRoute>
  );
}