import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { 
  X, 
  Cpu, 
  CircuitBoard, 
  MemoryStick, 
  Fan, 
  HardDrive, 
  Zap, 
  Box,
  CreditCard,
  ChevronRight,
  Monitor,
  DollarSign,
  Package,
  CheckCircle
} from "lucide-react";

export default function OrderComponentsModal({ order, isOpen, onClose, payment }) {
  if (!order) return null;

  const c = order?.components;
  const [progressData, setProgressData] = useState(null);
  // Component icon mapping
  const getComponentIcon = (type) => {
    switch(type) {
      case 'cpu': return <Cpu className="w-4 h-4 text-blue-500" />;
      case 'motherboard': return <CircuitBoard className="w-4 h-4 text-purple-500" />;
      case 'ram': return <MemoryStick className="w-4 h-4 text-green-500" />;
      case 'gpu': return <Monitor className="w-4 h-4 text-red-500" />;
      case 'storage': return <HardDrive className="w-4 h-4 text-yellow-500" />;
      case 'cooler': return <Fan className="w-4 h-4 text-cyan-500" />;
      case 'psu': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'case': return <Box className="w-4 h-4 text-indigo-500" />;
      case 'case_fan': return <Fan className="w-4 h-4 text-pink-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  // Component data array for easier mapping
  const components = [
    { type: 'cpu', label: 'CPU', value: c?.cpu?.name, icon: getComponentIcon('cpu') },
    { type: 'motherboard', label: 'Motherboard', value: c?.motherboard?.name, icon: getComponentIcon('motherboard') },
    { type: 'ram', label: 'RAM', value: c?.ram?.name, icon: getComponentIcon('ram') },
    { type: 'gpu', label: 'GPU', value: c?.gpu?.name, icon: getComponentIcon('gpu') },
    { type: 'storage', label: 'Storage', value: c?.storage?.name, icon: getComponentIcon('storage') },
    { type: 'cooler', label: 'Cooler', value: c?.cooler?.name, icon: getComponentIcon('cooler') },
    { type: 'psu', label: 'PSU', value: c?.psu?.name, icon: getComponentIcon('psu') },
    { type: 'case', label: 'Case', value: c?.case?.name, icon: getComponentIcon('case') },
    { type: 'case_fan', label: 'Case Fan', value: c?.case_fan?.name, icon: getComponentIcon('case_fan') }
  ];

  useEffect(() => {

  if (!order || !isOpen) return;

  const fetchProgress = async () => {
    try {
      console.log("Fetching progress for:", order.order_id);

      const res = await api.get(
        `/orders/worker-project/${order.order_id}/component/progress/`
      );

      console.log("Progress response:", res.data);

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
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal Container - Centers the modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3
              }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header with gradient */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">PC Build Components</h2>
                    {c?.build_name && (
                      <p className="text-xs md:text-sm text-white/80 flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        {c.build_name}
                      </p>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                {/* Build Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Build Configuration</p>
                      <p className="font-semibold text-sm md:text-base text-gray-800">{c?.build_name || 'Custom Build'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-gray-600">Total Value</p>
                      <p className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        ₹{order.total_price}
                      </p>
                    </div>
                  </div>
                </motion.div>

                 {/* Build Progress */}
                    {progressData && (
                    <motion.div className="mt-4 md:mt-6 mb-4 md:mb-6">

                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
                        Build Progress
                        </h3>

                        {/* percentage bar */}
                        <div className="mb-4 md:mb-6">
                        <div className="flex justify-between text-xs md:text-sm mb-1">
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
                        <div className="space-y-2 md:space-y-3">
                        {COMPONENT_STEPS.map((step) => {

                            const done = progressData[step.key];

                            return (
                            <div
                                key={step.key}
                                className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 md:px-4 py-2 md:py-3"
                            >
                                <div className="flex items-center gap-2">
                                {done ? (
                                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                                ) : (
                                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                                )}

                                <span className="text-xs md:text-sm font-medium">
                                    {step.label}
                                </span>
                                </div>

                                <span
                                className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 md:py-1 rounded
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

                {/* Components Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6"
                >
                  {components.map((component, index) => (
                    <motion.div
                      key={component.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`bg-gray-50 rounded-xl p-2 md:p-3 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 ${
                        !component.value ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-2 md:space-x-3">
                        <div className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm">
                          {component.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] md:text-xs text-gray-500">{component.label}</p>
                          <p className="font-medium text-xs md:text-sm text-gray-800 truncate">
                            {component.value || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                

                {/* Price Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6"
                >
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-sm md:text-base text-gray-700">Total Components Price</span>
                    </div>
                    <span className="text-lg md:text-2xl font-bold text-green-600">₹{c?.total_price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-sm md:text-base text-gray-700">Service Charge</span>
                    </div>
                    <span className="text-lg md:text-2xl font-bold text-green-600">₹{order.worker_earning}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3 md:mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 md:p-2 bg-green-100 rounded-lg"> 
                        <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-sm md:text-base text-gray-700">Platform Fee</span>
                    </div>
                    <span className="text-lg md:text-2xl font-bold text-green-600">₹{order.platform_fee}</span>
                  </div>
                  <hr></hr>
                  <div className="flex items-center justify-between mt-3 md:mt-5">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-base md:text-lg text-gray-700">Total Value</span>
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">₹{order.total_price}</span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Close</span>
                  </motion.button>
                  {!order.payout_approved && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => payment(order.order_id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
                    >
                      <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Approve Payment</span>
                    </motion.button>
                  )}
                  

                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}