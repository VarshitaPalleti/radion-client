import PublicRoute from "../components/PublicRoute";

export default function LoginLayout({
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