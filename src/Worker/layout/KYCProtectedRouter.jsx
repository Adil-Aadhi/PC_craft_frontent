import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { KycContext} from "../context/KycContext"

const KycProtectedRoute = ({ children }) => {

    const {user,authLoading}=useAuth()
    const { openKycModal } = useContext(KycContext);
  // Only for workers (optional)
  if (authLoading) return null

  if (user?.role === "worker") {
    const allowed =
      user?.kyc_status === "pending" ||
      user?.kyc_status === "approved";

    if (!allowed) {
      return openKycModal();
    }
  }

  return children;
};

export default KycProtectedRoute;
