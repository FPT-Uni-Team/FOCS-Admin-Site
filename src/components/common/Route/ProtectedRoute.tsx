import { Navigate, useParams } from "react-router-dom";
import FallBack from "../Fallback/FallBack";
import useAuth from "../../../hooks/useAuth";
import type { JSX } from "react";

export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const { storeId } = useParams();

  if (loading) {
    return <FallBack />;
  }
  if (!isAuthenticated) {
    const id = storeId || localStorage.getItem("storeId");
    return <Navigate to={id ? `/${id}/login` : "/"} replace />;
  }

  return children;
};
