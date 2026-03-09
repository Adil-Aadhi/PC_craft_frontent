import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  CurrencyRupeeIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function AdminRevenue() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("admin/revenue/dashboard/");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return <p className="text-center text-gray-500">No data available</p>;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, textColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' && title !== 'Total Orders' ? formatCurrency(value) : value}
        </h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your platform's financial performance and top workers
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.total_revenue}
          icon={CurrencyRupeeIcon}
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          title="Worker Payout"
          value={stats.worker_payout}
          icon={UserGroupIcon}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          title="Platform Profit"
          value={stats.platform_profit}
          icon={ChartBarIcon}
          bgColor="bg-purple-100"
          textColor="text-purple-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={ShoppingCartIcon}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Completed Orders</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">{stats.completed_orders}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600">
              {Math.round((stats.completed_orders / stats.total_orders) * 100)}% completion rate
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Average Order Value</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                {formatCurrency(stats.avg_order_value)}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">This Month's Revenue</p>
              <p className="text-2xl font-bold text-indigo-900 mt-2">
                {stats.monthly_revenue && stats.monthly_revenue.length > 0 
                  ? formatCurrency(stats.monthly_revenue[stats.monthly_revenue.length - 1].revenue)
                  : formatCurrency(0)}
              </p>
            </div>
            <div className="p-3 bg-indigo-200 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-indigo-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
            <span className="text-xs font-medium text-gray-500">Last 6 months</span>
          </div>
          
          <div className="space-y-4">
            {stats.monthly_revenue && stats.monthly_revenue.map((month, index) => {
              const maxRevenue = Math.max(...stats.monthly_revenue.map(m => m.revenue));
              const percentage = (month.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">{month.month}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(month.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Workers Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Workers</h3>
            <span className="text-xs font-medium text-gray-500">By earnings</span>
          </div>
          
          <div className="space-y-4">
            {stats.top_workers.map((worker, index) => {
              const maxEarning = Math.max(...stats.top_workers.map(w => w.earning));
              const percentage = (worker.earning / maxEarning) * 100;
              
              return (
                <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          index === 1 ? 'bg-gray-100 text-gray-700' : 
                          index === 2 ? 'bg-orange-100 text-orange-700' : 
                          'bg-blue-50 text-blue-600'}`}>
                        #{index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{worker.worker}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(worker.earning)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500
                        ${index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-500' : 
                          index === 2 ? 'bg-orange-500' : 
                          'bg-blue-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {stats.top_workers.length === 0 && (
            <p className="text-center text-gray-500 py-8">No worker data available</p>
          )}
        </div>
      </div>
    </div>
  );
}