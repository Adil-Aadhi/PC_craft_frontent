import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const {user,authLoading,accessToken}=useAuth()

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (accessToken && user) {

    if (user.role === "worker") {
      return <Navigate to="/worker/dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

  }

  return <Outlet />;
};

export default PublicRoute;
