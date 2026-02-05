import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (accessToken && user?.role === "worker") {
    return <Navigate to="/worker/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
