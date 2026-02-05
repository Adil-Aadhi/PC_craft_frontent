import { createContext, useState } from "react";
import KycModal from "../components/KycModal";

export const KycContext = createContext();

export const KycProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openKycModal = () => setOpen(true);
  const closeKycModal = () => setOpen(false);

  return (
    <KycContext.Provider value={{ openKycModal, closeKycModal }}>
      {children}
      <KycModal isOpen={open} onClose={closeKycModal} />
    </KycContext.Provider>
  );
};
