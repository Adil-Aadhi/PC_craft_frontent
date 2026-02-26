import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import ProfileTabs from "../components/profile/profileMenu";
import ProfileOverview from "../components/profile/profileOverview";
import WorkerProfessionalDetails from "../components/profile/profileWorkerProfessionalInfo";
import WorkerUpiCard from "../components/profile/profileUpiComponent";
import SecurityCard from "../../Customer/components/ProfileSecurityCard";



const WorkerProfile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const navigate = useNavigate();
 


  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return <ProfileOverview />;
      case "work":
        return <WorkerProfessionalDetails/>
      case "payment":
        return <WorkerUpiCard/>
      case "security":
        return <SecurityCard/>
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 pt-6 ">
      

      {/* Header Row */}
      <div className="max-w-4xl mx-auto mb-6 mt-10 flex items-center justify-between ">
        <ProfileTabs
          active={activeSection}
          setActive={setActiveSection}
        />

        {/* Close Button */}
        <button
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
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto  p-6">
        {renderSection()}
      </div>

    </div>
  );
};

export default WorkerProfile;
