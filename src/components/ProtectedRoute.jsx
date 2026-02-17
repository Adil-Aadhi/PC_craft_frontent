import { Navigate, Outlet } from "react-router-dom";
import PleaseLogin from "../Customer/components/ProfileNoUserLogin";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {

const {user,authLoading,accessToken}=useAuth()

  if (authLoading) {
  return <div>Loading...</div>; // or spinner
}
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
