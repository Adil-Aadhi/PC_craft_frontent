import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/axios";

const AdminStatsContext = createContext();

export const AdminStatsProvider = ({ children }) => {

  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    blocked_users: 0,
    pending_kyc: 0
  });

  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("admin/users/stats/");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminStatsContext.Provider value={{ stats, fetchStats, loadingStats }}>
      {children}
    </AdminStatsContext.Provider>
  );
};

export const useAdminStats = () => useContext(AdminStatsContext);