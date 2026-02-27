import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMyOrders } from "../../Customer/Build/redux/components/orders/orderslice";
import StatusCard from "../components/StatusCard";
import BuildDetailsModal from "../../cart/components/cartcomponentmodel";
import { 
  Clock, 
  Cpu, 
  CreditCard, 
  XCircle, 
  CheckCircle, 
  Package,
  Calendar,
  Hash,
  Eye,
  Zap,
  Server,
  HardDrive,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";

// Main OrdersPage Component
const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  const pending = orders.filter(o => o.status === "PAYMENT_PENDING").length;
  const processing = orders.filter(o => o.status === "BUILD_IN_PROGRESS").length;
  const completed = orders.filter(o => o.status === "COMPLETED").length;
  const cancelled = orders.filter(o => o.status === "CANCELLED").length;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.build?.build_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id?.toString().includes(searchTerm) ||
                         order.build?.id?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePay = (orderId) => {
    console.log("Pay order", orderId);
    // Razorpay later
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "PAYMENT_PENDING": return Clock;
      case "BUILD_IN_PROGRESS": return Package;
      case "COMPLETED": return CheckCircle;
      case "CANCELLED": return XCircle;
      default: return Package;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "PAYMENT_PENDING": return "from-amber-500 to-orange-500";
      case "BUILD_IN_PROGRESS": return "from-blue-500 to-indigo-500";
      case "COMPLETED": return "from-emerald-500 to-green-500";
      case "CANCELLED": return "from-rose-500 to-red-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case "PAYMENT_PENDING": return "Pending Payment";
      case "BUILD_IN_PROGRESS": return "Processing";
      case "COMPLETED": return "Completed";
      case "CANCELLED": return "Cancelled";
      default: return status;
    }
  };

  const statusOptions = [
    { value: "all", label: "All Orders", icon: Package },
    { value: "PAYMENT_PENDING", label: "Pending Payment", icon: Clock },
    { value: "BUILD_IN_PROGRESS", label: "Processing", icon: Package },
    { value: "COMPLETED", label: "Completed", icon: CheckCircle },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with glass morphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-24 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-100 via-white to-gray-300 bg-clip-text text-transparent">
                  My Orders
                </h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Track and manage your PC build orders
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/25"
            >
              <p className="text-lg font-semibold">{orders.length} Total Orders</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Status Cards with Icons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatusCard 
            title="Pending Payment" 
            count={pending} 
            color="yellow" 
            icon="pending"
          />
          <StatusCard 
            title="Processing" 
            count={processing} 
            color="blue" 
            icon="processing"
          />
          <StatusCard 
            title="Completed" 
            count={completed} 
            color="green" 
            icon="completed"
          />
          <StatusCard 
            title="Cancelled" 
            count={cancelled} 
            color="red" 
            icon="cancelled"
          />
        </motion.div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/60 border border-gray-700 text-gray-400 backdrop-blur-lg rounded-3xl p-16 text-center shadow-xl "
            >
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl">No orders found</p>
              {/* {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm("")}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/25"
                >
                  Clear Search
                </motion.button>
              )} */}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredOrders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <motion.div
                    key={order.order_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group relative"
                  >
                    {/* Gradient Border Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-60 transition duration-300 blur`} />
                    
                    {/* Main Card */}
                    <div className="relative bg-zinc-900/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border text-white border-gray-100">
                      {/* Status Badge */}
                      <div className="absolute top-6 right-6">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getStatusColor(order.status)} text-white rounded-xl shadow-lg`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            {getStatusDisplay(order.status)}
                          </span>
                        </motion.div>
                      </div>

                      <div className="flex flex-col gap-5">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pr-32">
                          <div>
                            <h3 className="text-xl font-bold text-white/80">
                              {order.build?.build_name || "Custom PC Build"}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Hash className="w-4 h-4" />
                                ORDR{order.order_id.slice(0, 8).toUpperCase()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Components Grid */}
                        {order.build && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                          >
                            {order.build.cpu && (
                              <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                <Cpu className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-medium text-gray-700 truncate">
                                  {order.build.cpu.name.split(" ").slice(0, 2).join(" ")}
                                </span>
                              </div>
                            )}
                            {order.build.gpu && (
                              <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                <Server className="w-4 h-4 text-purple-500" />
                                <span className="text-xs font-medium text-gray-700 truncate">
                                  {order.build.gpu.name.split(" ").slice(0, 2).join(" ")}
                                </span>
                              </div>
                            )}
                            {order.build.ram && (
                              <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs font-medium text-gray-700">
                                  {order.build.ram.capacity_gb}GB RAM
                                </span>
                              </div>
                            )}
                            {order.build.storage && (
                              <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                                <HardDrive className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-medium text-gray-700 truncate">
                                  {order.build.storage.capacity_gb}GB Storage
                                </span>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Price and Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-gray-100 via-white to-gray-300 bg-clip-text text-transparent drop-shadow-sm">
                              ₹{order.total_price?.toLocaleString("en-IN")}
                            </p>
                          </div>

                          <div className="flex gap-3 w-full sm:w-auto">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedOrder(order)}
                              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </motion.button>

                            {order.status === "PAYMENT_PENDING" && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePay(order.uuid)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                              >
                                <CreditCard className="w-4 h-4" />
                                Pay Now
                                <ChevronRight className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details Modal with Animation */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedOrder(null)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <BuildDetailsModal 
                    build={selectedOrder.build} 
                    onClose={() => setSelectedOrder(null)} 
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrdersPage;