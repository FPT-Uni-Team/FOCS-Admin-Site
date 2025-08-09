import { Navigate } from "react-router-dom";
import FallBack from "../Fallback/FallBack";
import useAuth from "../../../hooks/useAuth";
import type { JSX } from "react";

export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FallBack />;
  }
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
};
