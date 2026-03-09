import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

import ProfileTabs from "../components/profile/profileMenu";
import ProfileOverview from "../components/profile/profileOverview";
import WorkerProfessionalDetails from "../components/profile/profileWorkerProfessionalInfo";
import WorkerUpiCard from "../components/profile/profileUpiComponent";
import SecurityCard from "../../Customer/components/ProfileSecurityCard";

const WorkerProfile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const navigate = useNavigate();
  const { user } = useAuth();

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return <ProfileOverview />;
      case "work":
        return <WorkerProfessionalDetails />;
      case "payment":
        return <WorkerUpiCard />;
      case "security":
        return <SecurityCard />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-gray-100 px-6 pt-6"
    >
      {/* Header Row */}
      <div className="max-w-4xl mx-auto mb-6 mt-10 flex items-center justify-between">
        <ProfileTabs
          active={activeSection}
          setActive={setActiveSection}
        />

        {/* Close Button */}
        <motion.button
          whileTap={{ scale: 0.9, rotate: 90 }}
          onClick={() => navigate("/worker/dashboard")}
          className="
            ml-4 p-2 rounded-full
            text-gray-600 hover:text-gray-900
            hover:bg-white/70
            transition
          "
          aria-label="Close profile"
        >
          <FiX className="w-5 h-5" />
        </motion.button>
      </div>

      {user?.kyc_status === "pending" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-4"
          >
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-4 py-2 rounded-xl shadow-sm">
              <span className="font-medium">
                Your KYC details are under review.
              </span>
              <span>Please wait while we verify your information.</span>
            </div>
          </motion.div>
        )}

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WorkerProfile;