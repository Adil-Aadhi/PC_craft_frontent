import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { DollarSign, TrendingUp, Package, Calendar, ArrowUpRight, Wallet, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function WorkerRevenuePage() {
  const [summary, setSummary] = useState({
    total_revenue: 0,
    total_profit: 0,
    completed_orders: 0
  });

  const [earnings, setEarnings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/workers/revenue/");

      setSummary(data.summary);
      setEarnings(data.earnings);

      // build graph data from earnings
      const monthlyMap = {};

      data.earnings.forEach((item) => {
        const date = new Date(item.order_date);
        const month = date.toLocaleString("default", { month: "short" });

        if (!monthlyMap[month]) {
          monthlyMap[month] = { month, revenue: 0, profit: 0 };
        }

        monthlyMap[month].revenue += parseFloat(item.payout_amount);
        monthlyMap[month].profit += parseFloat(item.service_earning);
      });

      setRevenueData(Object.values(monthlyMap));
    } catch (error) {
      console.error("Revenue fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Revenue Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your earnings and performance metrics</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <Calendar className="text-blue-600" size={20} />
            <span className="text-gray-600">{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards with Enhanced Design */}
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Revenue Card */}
        <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg">
                <DollarSign className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(summary.total_revenue)}</h2>
              </div>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <ArrowUpRight className="text-green-600" size={20} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Lifetime earnings</span>
            </div>
          </div>
        </div>

        {/* Total Profit Card */}
        <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg">
                <Wallet className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Profit</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(summary.total_profit)}</h2>
              </div>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <ArrowUpRight className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp size={16} />
              <span>Net earnings after costs</span>
            </div>
          </div>
        </div>

        {/* Orders Completed Card */}
        <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg">
                <Package className="text-white" size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Orders Completed</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">{summary.completed_orders}</h2>
              </div>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <ArrowUpRight className="text-purple-600" size={20} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package size={16} />
              <span>Successfully delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Graph with Enhanced Design */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Profit</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" tick={{ fill: '#666', fontSize: 12 }} />
              <YAxis stroke="#888" tick={{ fill: '#666', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`₹${value}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Table with Enhanced Design */}
      <div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Earnings</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {earnings.length} transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Component Price</th>
                  <th className="py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Service Charge</th>
                  <th className="py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Earned</th>
                  <th className="py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {earnings.map((order, index) => (
                  <tr 
                    key={order.order_id} 
                    className="hover:bg-gray-50 transition-colors duration-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4">
                      <span className="font-mono text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        #{order.order_id.slice(0,8)}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-700">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-gray-700">{formatCurrency(order.component_reimbursement)}</td>
                    <td className="py-4">
                      <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {formatCurrency(order.service_earning)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        {formatCurrency(order.payout_amount)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">
                      {new Date(order.order_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {earnings.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No earnings yet. Start completing orders to see your revenue!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}