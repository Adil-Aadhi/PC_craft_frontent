import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import KycProgressBar from "./KycProgressBar";
import BasicDetails from "./Steps/BasicDetails";
import WorkerDetails from "./Steps/WorkerMainDetails";
import IdentityVerification from "./Steps/WorkerIdentity";
import api from "../../../api/axios";
import UpiDetails from "./Steps/WorkerUpiPayout";

const STEP_PROGRESS = {
  0: 10,
  1: 30,
  2: 60,
  3: 90,
  4: 100,
};

const KycPage = () => {
  const [step, setStep] = useState(null);       // 👈 wait for backend
  const [progress, setProgress] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  // 🔹 Restore progress & step
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/workers/kyc/progress/");

        setStep(res.data.current_step);               // 👈 KEY FIX
        setProgress(res.data.progress ?? 10);
      } catch (err) {
        console.error("Failed to load KYC progress", err);
        setStep(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // 🔹 Called when a step is COMPLETED
  const completeStep = async () => {
  const nextStep = step + 1;

  try {
    await api.post("/workers/kyc/progress/", {
      current_step: nextStep,
      progress: STEP_PROGRESS[nextStep],
    });

    // update UI only after backend success
    setStep(nextStep);
    setProgress(STEP_PROGRESS[nextStep]);
  } catch (err) {
    console.error("Failed to save KYC progress", err);
  }
};
  // 🔹 Prevent wrong render before backend loads
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading KYC...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">

        {/* Close */}
        <button
          onClick={() => navigate("/worker/dashboard")}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={22} />
        </button>

        {/* Progress */}
        <KycProgressBar progress={progress} />

        {/* Step 1 */}
        {step === 0 && <BasicDetails onComplete={completeStep} />}

        {/* Step 2 */}
        {step === 1 && <WorkerDetails onComplete={completeStep} />}

        {/* Step 3 */}
        {step === 2 && <IdentityVerification onComplete={completeStep}/>}
        
        {/* Step 4 */}
        {step === 3 && <UpiDetails onComplete={completeStep}/>}

      </div>
    </div>
  );
};

export default KycPage;
