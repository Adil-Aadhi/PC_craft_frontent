import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  IndianRupee,
  Calendar,
  User,
  Settings,
  Wrench
} from "lucide-react";
import api from "../../api/axios";
import OrderDetailsModal from "../components/AdminOrderDetailsModal";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const STATUS_CHOICES = [
    { value: "ALL", label: "All Orders", icon: Package, color: "gray" },
    { value: "PAYMENT_PENDING", label: "Payment Pending", icon: Clock, color: "yellow" },
    { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "blue" },
    { value: "BUILD_IN_PROGRESS", label: "Build In Progress", icon: Settings, color: "purple" },
    { value: "COMPLETED", label: "Completed", icon: CheckCircle, color: "green" },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "red" },
  ];

 const fetchOrders = async (url = null) => {
  try {
    setLoading(true);

    let requestUrl = url;

    if (!requestUrl) {
      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.append("search", searchTerm);
      }

      if (selectedStatus !== "ALL") {
        params.append("status", selectedStatus);
      }

      requestUrl = `/admin/all/orders/?${params.toString()}`;
    }

    const res = await api.get(requestUrl);

    setOrders(res.data.results);
    setNextPage(res.data.next);
    setPrevPage(res.data.previous);

  } catch (error) {
    console.error("Error fetching orders", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    const delay = setTimeout(() => {
        fetchOrders();
    }, 500);

  return () => clearTimeout(delay);
}, [searchTerm, selectedStatus]);

  const handleViewMore = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("ALL");
  };

  const getStatusColor = (status) => {
    const statusColors = {
      PAYMENT_PENDING: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
      CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
      BUILD_IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100",
      COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      CANCELLED: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-100",
    };
    return statusColors[status] || "bg-gray-50 text-gray-700 border-gray-200 ring-gray-100";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PAYMENT_PENDING: Clock,
      CONFIRMED: CheckCircle,
      BUILD_IN_PROGRESS: Settings,
      COMPLETED: CheckCircle,
      CANCELLED: XCircle,
    };
    return icons[status] || AlertCircle;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section with Premium Gradient */}
      <motion.div 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Orders Overview
            </h1>
            <p className="text-slate-600">Manage and track all customer orders</p>
          </div>
          
          {/* Stats Cards with Premium Design */}
          <motion.div 
            className="flex gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={statsVariants}
              whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-4 border border-white/50"
            >
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Total Orders
              </p>
              <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
            </motion.div>
            
            <motion.div 
              variants={statsVariants}
              whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-4 border border-white/50"
            >
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Payment
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {orders.filter(o => o.status === 'PAYMENT_PENDING').length}
              </p>
            </motion.div>

            <motion.div 
              variants={statsVariants}
              whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-4 border border-white/50"
            >
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {orders.filter(o => o.status === 'COMPLETED').length}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div 
        className="mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/50">
          <div className="flex gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer, or Build..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all outline-none bg-white/50"
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-4 py-3 rounded-xl border flex items-center gap-2 transition-all ${
                  selectedStatus !== "ALL" 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white/50 border-slate-200 text-slate-700 hover:border-slate-400"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                {selectedStatus !== "ALL" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    1
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-10"
                  >
                    <div className="p-2">
                      {STATUS_CHOICES.map((status) => {
                        const Icon = status.icon;
                        return (
                          <motion.button
                            key={status.value}
                            onClick={() => {
                              setSelectedStatus(status.value);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                              selectedStatus === status.value
                                ? `bg-${status.color}-50 text-${status.color}-700`
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                            whileHover={{ x: 5 }}
                          >
                            <Icon className={`w-4 h-4 ${
                              selectedStatus === status.value ? `text-${status.color}-500` : 'text-slate-400'
                            }`} />
                            <span className="flex-1 text-left">{status.label}</span>
                            {selectedStatus === status.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`w-2 h-2 rounded-full bg-${status.color}-500`}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear Filters Button - Show only when filters are active */}
            {(searchTerm || selectedStatus !== "ALL") && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearFilters}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Orders Grid */}
      {loading ? (
        <motion.div 
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-slate-900" />
          </motion.div>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {orders.length > 0 ? (
              <motion.div 
                key="orders-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {orders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status);
                  
                  return (
                    <motion.div
                      key={order.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
                    >
                      {/* Card Header with Premium Gradient */}
                      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4">
                        <div className="flex justify-between items-center">
                          <motion.span 
                            className="text-white/90 font-mono text-sm flex items-center gap-2"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Package className="w-4 h-4" />
                            #{order.id}
                          </motion.span>
                          <motion.span 
                            className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(order.status)}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {STATUS_CHOICES.find(s => s.value === order.status)?.label || order.status}
                          </motion.span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        {/* User Info */}
                        <motion.div 
                          className="flex items-center space-x-3 mb-4"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {order.user_username?.charAt(0).toUpperCase() || "U"}
                          </motion.div>
                          <div>
                            <p className="font-semibold text-slate-900 flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-500" />
                              {order.user_username || "Unknown User"}
                            </p>
                            <p className="text-sm text-slate-500">{order.user_email}</p>
                          </div>
                        </motion.div>

                        {/* Order Details */}
                        <motion.div 
                          className="space-y-3 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Order Date
                            </span>
                            <span className="font-medium text-slate-900">{formatDate(order.created_at)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              Total Amount
                            </span>
                            <motion.span 
                              className="text-xl font-bold text-slate-900"
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                            >
                              ₹{order.total_price?.toLocaleString('en-IN') || "0"}
                            </motion.span>
                          </div>
                          
                          {order.cart_item?.build_name && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600 flex items-center gap-1">
                                <Settings className="w-4 h-4" />
                                Build
                              </span>
                              <span className="font-medium text-slate-900">{order.cart_item.build_name}</span>
                            </div>
                          )}
                        </motion.div>

                        {/* Action Button */}
                        <motion.button
                          onClick={() => handleViewMore(order)}
                          className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3 rounded-xl font-medium hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-white/50">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <Package className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Orders Found</h3>
                  <p className="text-slate-600 mb-4">No orders match your current filters.</p>
                  <motion.button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {(prevPage || nextPage) && (
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-2 flex gap-2">
                {prevPage && (
                  <motion.button
                    onClick={() => fetchOrders(prevPage.replace(api.defaults.baseURL, ""))}
                    className="px-5 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </motion.button>
                )}

                {prevPage && nextPage && (
                  <span className="w-px h-8 bg-slate-200 my-auto"></span>
                )}

                {nextPage && (
                  <motion.button
                    onClick={() => fetchOrders(nextPage.replace(api.defaults.baseURL, ""))}
                    className="px-5 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-2"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}

      <OrderDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        order={selectedOrder}
      />
    </motion.div>
  );
}