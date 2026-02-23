import { createContext, useState } from "react";
import KycModal from "../components/KycModal";
import { useNavigate } from "react-router-dom";

export const KycContext = createContext();

export const KycProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate=useNavigate()

  const openKycModal = () => setOpen(true);
  const closeKycModal = () => {
    navigate('/worker/dashboard')
    setTimeout(()=>{
      setOpen(false)
    },200)
    
  };

  return (
    <KycContext.Provider value={{ openKycModal, closeKycModal }}>
      {children}
      <KycModal isOpen={open} onClose={closeKycModal} />
    </KycContext.Provider>
  );
};
