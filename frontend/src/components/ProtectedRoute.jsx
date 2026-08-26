import { Navigate } from "react-router";
import { isLoggedIn } from "@/api";

export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
