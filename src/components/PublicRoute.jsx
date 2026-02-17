import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  // const accessToken = localStorage.getItem("accessToken");
  // const user = JSON.parse(localStorage.getItem("user"));
  const {user,authLoading,accessToken}=useAuth()

  if (accessToken && user?.role === "worker") {
    return <Navigate to="/worker/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
