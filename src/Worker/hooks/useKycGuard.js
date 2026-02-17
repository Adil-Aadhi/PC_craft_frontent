import { useContext } from "react";
import { KycContext} from "../context/KycContext"
import { useAuth } from "../../context/AuthContext";

const useKycGuard = () => {
  const {user}=useAuth()
  const { openKycModal } = useContext(KycContext);

  const checkKyc = (action) => {
    if (user?.role === "worker" && user?.kyc_status !== "approved") {
      openKycModal();
      return;
    }

    action();
  };

  return { checkKyc };
};

export default useKycGuard;
