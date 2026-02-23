import { useContext } from "react";
import { KycContext} from "../context/KycContext"
import { useAuth } from "../../context/AuthContext";

const useKycGuard = () => {
  const {user,authLoading }=useAuth()
  const { openKycModal } = useContext(KycContext);

  const checkKyc = (action) => {
    if (authLoading) return;
    
    if (user?.role === "worker" && user?.kyc_status !== "approved" && user?.kyc_status !== "pending" ) {
      openKycModal();
      return;
    }

    action();
  };

  return { checkKyc };
};

export default useKycGuard;
