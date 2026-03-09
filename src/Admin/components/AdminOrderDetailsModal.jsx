import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  X,
  User,
  Mail,
  Wrench,
  Cpu,
  CircuitBoard,
  MemoryStick,
  Cpu as GpuIcon,
  HardDrive,
  Cable,
  Fan,
  Grid3x3,
  Wind,
  IndianRupee,
  Package,
  Calendar,
  UserCircle,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!order) return null;

  const components = order.cart_item;
  const [progressData, setProgressData] = useState(null);
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status?.toLowerCase()] || AlertCircle;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  

  // Component icon mapping with Lucide icons
  const getComponentIcon = (type) => {
    const icons = {
      cpu: Cpu,
      motherboard: CircuitBoard,
      ram: MemoryStick,
      gpu: GpuIcon,
      storage: HardDrive,
      psu: Cable,
      cooler: Fan,
      case: Grid3x3,
      case_fan: Wind,
    };
    return icons[type] || Package;
  };

  const StatusIcon = getStatusIcon(order.status);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  useEffect(() => {

  if (!order || !isOpen) return;

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/orders/worker-project/${order.order_id}/component/progress/`);
      setProgressData(res.data);
    } catch (err) {
      console.error("Progress fetch failed", err);
    }
  };

  fetchProgress();

}, [order, isOpen]);

const COMPONENT_STEPS = [
  { key: "cpu", label: "CPU Installed" },
  { key: "motherboard", label: "Motherboard Installed" },
  { key: "ram", label: "RAM Installed" },
  { key: "gpu", label: "GPU Installed" },
  { key: "storage", label: "Storage Installed" },
  { key: "psu", label: "PSU Installed" },
  { key: "cooler", label: "Cooler Installed" },
  { key: "case", label: "Case Assembly" },
  { key: "case_fan", label: "Case Fan Installed" }
];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
              <div className="flex justify-between items-start">
                <motion.div 
                  className="flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">Order Details</h2>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {order.status || "Pending"}
                    </motion.span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-mono flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      #{order.id}
                    </span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <motion.div 
              className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Customer Information Card */}
              <motion.div 
                className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100"
                variants={itemVariants}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="flex items-start gap-3"
                    variants={itemVariants}
                  >
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {order.user_username?.charAt(0).toUpperCase() || "U"}
                    </motion.div>
                    <div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Username
                      </p>
                      <p className="font-semibold text-gray-900">{order.user_username || "Unknown User"}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </p>
                    <p className="font-semibold text-gray-900 break-all">{order.user_email}</p>
                  </motion.div>
                  
                  {order.worker_username && (
                    <motion.div 
                      className="col-span-2"
                      variants={itemVariants}
                    >
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        Assigned Worker
                      </p>
                      <p className="font-semibold text-green-600 flex items-center gap-1">
                        <UserCircle className="w-4 h-4" />
                        {order.worker_username}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Build Components Section */}
              {components && (
                <motion.div 
                  className="mb-6"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Build Components</h3>
                    <motion.span 
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      {components.build_name}
                    </motion.span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries({
                      cpu: components?.cpu,
                      motherboard: components?.motherboard,
                      ram: components?.ram,
                      gpu: components?.gpu,
                      storage: components?.storage,
                      psu: components?.psu,
                      cooler: components?.cooler,
                      case: components?.case,
                      case_fan: components?.case_fan
                    }).map(([key, component], index) => {
                      if (!component) return null;
                      const IconComponent = getComponentIcon(key);
                      
                      return (
                        <motion.div
                          key={key}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200"
                          variants={itemVariants}
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                            transition: { duration: 0.2 }
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <IconComponent className="w-3 h-3" />
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </p>
                          <p className="font-medium text-gray-900">{component.name}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Price Breakdown */}
              <motion.div 
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Price Breakdown
                </h3>
                
                <div className="space-y-3">
                  <motion.div 
                    className="flex justify-between items-center pb-2 border-b border-gray-700"
                    variants={itemVariants}
                  >
                    <span className="text-gray-300">Components Total</span>
                    <span className="font-semibold">₹{order.components_total?.toLocaleString('en-IN') || "0"}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex justify-between items-center pb-2 border-b border-gray-700"
                    variants={itemVariants}
                  >
                    <span className="text-gray-300">Platform Fee</span>
                    <span className="font-semibold">₹{order.platform_fee?.toLocaleString('en-IN') || "0"}</span>
                  </motion.div>
                  
                  {order.worker_earning > 0 && (
                    <motion.div 
                      className="flex justify-between items-center pb-2 border-b border-gray-700"
                      variants={itemVariants}
                    >
                      <span className="text-gray-300">Worker Earning</span>
                      <span className="font-semibold text-green-400">₹{order.worker_earning?.toLocaleString('en-IN') || "0"}</span>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="flex justify-between items-center pt-2"
                    variants={itemVariants}
                  >
                    <span className="text-lg font-bold">Total Amount</span>
                    <motion.span 
                      className="text-2xl font-bold text-blue-400"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      ₹{order.total_price?.toLocaleString('en-IN') || "0"}
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>

                  {/* Build Progress */}
                    {progressData && (
                    <motion.div className="mt-6">

                        <h3 className="text-lg font-semibold mb-4">
                        Build Progress
                        </h3>

                        {/* percentage bar */}
                        <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Build Completion</span>
                            <span className="font-semibold">
                            {progressData.progress}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                            className="bg-green-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressData.progress}%` }}
                            transition={{ duration: 0.6 }}
                            />
                        </div>
                        </div>

                        {/* steps */}
                        <div className="space-y-3">
                        {COMPONENT_STEPS.map((step) => {

                            const done = progressData[step.key];

                            return (
                            <div
                                key={step.key}
                                className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3"
                            >
                                <div className="flex items-center gap-2">
                                {done ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Clock className="w-4 h-4 text-gray-400" />
                                )}

                                <span className="text-sm font-medium">
                                    {step.label}
                                </span>
                                </div>

                                <span
                                className={`text-xs font-semibold px-2 py-1 rounded
                                ${done ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                                >
                                {done ? "Completed" : "Pending"}
                                </span>
                            </div>
                            );
                        })}
                        </div>

                    </motion.div>
                    )}
              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3 mt-6"
                variants={itemVariants}
              >
                <motion.button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-5 h-5" />
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}