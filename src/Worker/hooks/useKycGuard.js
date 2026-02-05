import { useContext } from "react";
import { KycContext } from "../contexts/KycContext";

const useKycGuard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
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
