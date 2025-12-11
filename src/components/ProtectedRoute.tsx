import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Demo mode: always allow access without auth; re-enable gating for production later.
  return <>{children}</>;
}
