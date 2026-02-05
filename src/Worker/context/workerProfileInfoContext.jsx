import { createContext, useContext, useState } from "react";
import api from "../../api/axios";

const WorkerPersonalInfoContext = createContext(null);

export const WorkerPersonalInfoProvider = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch personal info
  const fetchPersonalInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get("workers/profile/personal-info/");
      setPersonalInfo(res.data);
      return true;
    } catch (err) {
      console.error("Fetch personal info failed", err);
      setError("Failed to load profile info");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update personal info
  const updatePersonalInfo = async (payload) => {
    try {
      setLoading(true);
      const res = await api.patch(
        "workers/profile/personal-info/",
        payload
      );
      setPersonalInfo(res.data); // 🔥 sync local state
      return true;
    } catch (err) {
      console.error("Update personal info failed", err);
      setError("Failed to update profile info");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkerPersonalInfoContext.Provider
      value={{
        personalInfo,
        loading,
        error,
        fetchPersonalInfo,
        updatePersonalInfo,
      }}
    >
      {children}
    </WorkerPersonalInfoContext.Provider>
  );
};

export const useWorkerPersonalInfo = () => {
  const ctx = useContext(WorkerPersonalInfoContext);
  if (!ctx) {
    throw new Error(
      "useWorkerPersonalInfo must be used inside WorkerPersonalInfoProvider"
    );
  }
  return ctx;
};
