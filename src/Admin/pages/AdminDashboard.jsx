import { useEffect, useState } from "react";
import api from "../../api/axios";
import { TrendingUp, Activity, Award } from "lucide-react";

import StatsSection from "../components/AdminDashboardStatus";
import RevenueCard from "../components/AdminDashboardRevunue";
import RevenueChart from "../components/AdminDashboardRevenueChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    workers: 0,
    orders: 0,
    revenue: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/admin/dashboard/");
        
        setStats({
          users: res.data.total_users,
          workers: res.data.total_workers,
          orders: res.data.total_orders,
          revenue: res.data.total_revenue
        });

        setRevenueData(res.data.revenue_growth);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-32 w-64 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <Activity className="text-indigo-600" size={20} />
            <span className="text-sm font-medium text-gray-600">Last updated: Today</span>
          </div>
        </div>
      </div>

      <StatsSection stats={stats} />
      
      {/* Revenue Section */}

        <div className="space-y-6">

          <div className="max-w-6xl mx-auto">
            <RevenueCard revenue={stats.revenue} />
          </div>

          <RevenueChart revenueData={revenueData} />

        </div>
    </div>
  );
}