import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
} 