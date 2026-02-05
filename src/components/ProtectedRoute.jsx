import { Navigate, Outlet } from "react-router-dom";
import PleaseLogin from "../Customer/components/ProfileNoUserLogin";

const ProtectedRoute = ({ allowedRoles }) => {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!accessToken || !user) {
    return <PleaseLogin />;
  }

  if (
    user.role === "worker" &&
    !location.pathname.startsWith("/worker")
  ) {
    return <Navigate to="/worker/dashboard" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;
