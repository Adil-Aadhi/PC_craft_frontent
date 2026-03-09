import { Navigate, Outlet, useLocation } from "react-router-dom";
import PleaseLogin from "../Customer/components/ProfileNoUserLogin";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {

  const { user, authLoading, accessToken } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  // ❌ Not logged in
  if (!accessToken || !user) {
    return <PleaseLogin />;
  }

  // 🔒 Prevent admin / worker accessing user home
  if (location.pathname === "/") {
    if (user.role === "worker") {
      return <Navigate to="/worker/dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // ❌ Role not allowed → redirect to correct dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {

    if (user.role === "worker") {
      return <Navigate to="/worker/dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "user") {
      return <Navigate to="/" replace />;
    }

  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;