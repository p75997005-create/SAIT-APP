import { Navigate, Outlet } from "react-router-dom";
import { useBank } from "../context/useBank";

export default function ProtectedRoute() {
  const { currentUser } = useBank();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
