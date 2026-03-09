import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchMyOrders } from "../../Customer/Build/redux/components/orders/orderslice";
import StatusCard from "../components/StatusCard";
import BuildDetailsModal from "../../cart/components/cartcomponentmodel";
import {
  Clock, Cpu, CreditCard, XCircle, ShieldCheck, Package, Calendar, Hash, Eye, Zap, Server, HardDrive, ChevronRight,Star , Gamepad2,FileText
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios"; 
import {useAuth} from "../../context/AuthContext"
import ExecutionProgressModal from "../../project/components/ExecutionProgressModal";
import ReviewModal from "../components/ReviewModal";

// Main OrdersPage Component
const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {user}=useAuth()
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null); 

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />
      </div>
    );
  }

  const completed = orders.filter(o => o.status === "COMPLETED").length;
  const cancelled = orders.filter(o => o.status === "CANCELLED").length;

  const filteredOrders = orders;

  const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
      });
    };

  const handlePayment = async (orderId) => {
        try {
          const razorpayLoaded = await loadRazorpay();
          if (!razorpayLoaded) {
            toast.error("Razorpay SDK failed to load.");
            return;
          }
          const res = await api.post(
            "/orders/create-razorpay-order/",
            { order_id: orderId },
          );

          const { razorpay_order_id, amount, key } = res.data;

          const options = {
              key: key,
              amount: amount,
              currency: "INR",
              name: "PC-Craft",
              description: "PC Build Order Payment",
              order_id: razorpay_order_id,

              handler: async function (response) {
                await api.post("/orders/verify-razorpay-payment/", {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });

                toast.success("Payment successful ✅");
                dispatch(fetchMyOrders());
              },

              modal: {
                ondismiss: function () {
                  toast.error("Payment cancelled ❌");
                }
              },

              prefill: {
                name: user.name,
                email: user.email,
              },

              theme: {
                color: "#6366f1",
              },
            };

          // 4️⃣ Open Razorpay modal
          const rzp = new window.Razorpay(options);
          rzp.open();
          rzp.on("payment.failed", function (response) {
            console.error(response.error);
            toast.error("Payment failed ❌");
          });

        } catch (error) {
          console.error(error);
          toast.error("Payment initialization failed");
        }
      };

  const handleCancel = async () => {
    try {
      await api.post(`/orders/my-orders/cancel/${cancelOrderId}/`);

      toast.success("Order cancelled");

      setCancelOrderId(null);
      dispatch(fetchMyOrders());
    } catch (error) {
      console.error(error);
      toast.error("Cancel failed");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAYMENT_PENDING": return Clock;
      case "BUILD_IN_PROGRESS": return Gamepad2;
      case "COMPLETED": return ShieldCheck;
      case "CANCELLED": return XCircle;
      default: return Package;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PAYMENT_PENDING":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
          glow: "shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]"
        };
      case "BUILD_IN_PROGRESS":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-400",
          glow: "shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]"
        };
      case "COMPLETED":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          glow: "shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-500/10",
          border: "border-rose-500/20",
          text: "text-rose-400",
          glow: "shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]"
        };
      default:
        return {
          bg: "bg-zinc-500/10",
          border: "border-zinc-500/20",
          text: "text-zinc-400",
          glow: "shadow-[0_0_15px_-3px_rgba(113,113,122,0.3)]"
        };
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "PAYMENT_PENDING": return "Pending Payment";
      case "BUILD_IN_PROGRESS": return "In Production";
      case "COMPLETED": return "Ready for Deployment";
      case "CANCELLED": return "Cancelled";
      default: return status;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mt-5 min-h-screen bg-[#030303] text-white relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative  pt-24">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Order Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Command Center
            </h1>
            <p className="text-zinc-400 text-lg flex items-center gap-2 max-w-xl">
              Track, manage, and oversee the status of your premium custom PC builds.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl flex items-center gap-4 group"
          >
            <div className="p-3 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20 rounded-xl">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Total Orders</p>
              <p className="text-2xl font-bold font-mono tracking-tight">{orders.length}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
        >
          <StatusCard
            title="Ready / Shipped"
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm"
            >
              <div className="p-6 bg-white/5 rounded-full mb-6 ring-1 ring-white/10">
                <Package className="w-12 h-12 text-zinc-500" />
              </div>
              <p className="text-xl font-medium text-white mb-2">No missions found</p>
              <p className="text-zinc-500 text-center max-w-sm">
                No orders have been placed yet.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {filteredOrders.map((order) => {
                const styles = getStatusStyles(order.status);
                let StatusIcon = getStatusIcon(order.status);

                return (
                  <motion.div
                    key={order.order_id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="group relative"
                  >
                    {/* Glowing Effect on Hover */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 rounded-[24px] opacity-0 group-hover:from-blue-500/30 group-hover:via-purple-500/30 group-hover:to-blue-500/30 group-hover:opacity-100 blur-[10px] transition-all duration-700 pointer-events-none" />

                    {/* Card Content */}
                    <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden p-6 hover:bg-zinc-900/80 transition-all duration-500">

                      {/* Top Header Row */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-white tracking-tight">
                              {order.build?.build_name || "Custom PC Build"}
                            </h3>
                            <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles.bg} ${styles.border} ${styles.text} ${styles.glow}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {getStatusDisplay(order.status)}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-500 font-mono">
                            <span className="flex items-center gap-1.5 bg-white/5 py-1 px-2.5 rounded-lg border border-white/5">
                              <Hash className="w-4 h-4 text-zinc-400" />
                              <span className="text-zinc-300">ODR{order.order_id.slice(0, 8).toUpperCase()}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-zinc-400" />
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Price Block */}
                        <div className="text-left md:text-right p-4 bg-white/5 rounded-2xl border border-white/5 w-full md:w-auto">
                          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Total Payload</p>
                          <p className="text-3xl font-black bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                            ₹{order.total_price?.toLocaleString("en-IN") || "0"}
                          </p>
                        </div>
                      </div>

                      {/* Hardware Specs Grid */}
                      {order.build && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-black/20 p-4 rounded-2xl border border-white/5">
                          {order.build.cpu && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <Cpu className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Processor</p>
                                <p className="text-sm font-medium text-zinc-200 truncate pr-2">
                                  {order.build.cpu.name.split(" ").slice(0, 3).join(" ")}
                                </p>
                              </div>
                            </div>
                          )}
                          {order.build.gpu && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <Server className="w-5 h-5 text-purple-400" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Graphics</p>
                                <p className="text-sm font-medium text-zinc-200 truncate pr-2">
                                  {order.build.gpu.name.split(" ").slice(0, 3).join(" ")}
                                </p>
                              </div>
                            </div>
                          )}
                          {order.build.ram && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                <Zap className="w-5 h-5 text-yellow-400" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Memory</p>
                                <p className="text-sm font-medium text-zinc-200">
                                  {order.build.ram.capacity_gb}GB RAM
                                </p>
                              </div>
                            </div>
                          )}
                          {order.build.storage && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <HardDrive className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Storage</p>
                                <p className="text-sm font-medium text-zinc-200 truncate pr-2">
                                  {order.build.storage.capacity_gb}GB
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row justify-end items-center gap-3">

                        {order.status === "COMPLETED" && !order.review && (
                            <button
                              onClick={() => setReviewOrder(order)}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                            >
                              ⭐ Rate Worker
                            </button>
                          )}

                          {order.review && (
                              <div className="mt-2 flex flex-col gap-1">

                                {/* Label */}
                                <span className="text-xs text-zinc-400 font-medium">
                                  Your Rating
                                </span>

                                {/* Stars */}
                                <div className="flex items-center gap-2">
                                  {[1,2,3,4,5].map((star)=>(
                                    <Star
                                      key={star}
                                      size={18}
                                      className={
                                        star <= order.review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }
                                    />
                                  ))}
                                </div>

                              </div>
                            )}

                          {/* Inspect Blueprint (modal) */}
                          {order.status=="BUILD_IN_PROGRESS" &&(
                            <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                           onClick={async () => {
                                const res = await api.get(
                                  `/orders/worker-project/${order.order_id}/component/progress/`
                                );
                                setProgressData(res.data);
                                setShowModal(true);
                              }}
                            className="w-full sm:w-auto px-6 py-3 bg-orange-400 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition border border-white/10 flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                             View Detailed Progress
                          </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedOrder(order)}
                            className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition border border-white/10 flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Inspect Blueprint
                          </motion.button>

                          {/* 📄 View Quotation */}
                          {order.quotation_pdf && order.status=="PAYMENT_PENDING" && (
                            <a
                              href={order.quotation_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto px-6 py-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-sm font-semibold border border-emerald-500/30 flex items-center justify-center gap-2 transition"
                            >
                              <FileText className="w-4 h-4" />
                              View Quotation
                            </a>
                          )}
                          {order.invoice_pdf && (
                            <a
                              href={order.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-sm font-semibold border border-blue-500/30 flex items-center gap-2"
                            >
                              Download Invoice
                            </a>
                          )}
                          

                          {order.status === "PAYMENT_PENDING" && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>setCancelOrderId(order.order_id)}
                                className="w-full sm:w-auto px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl text-sm font-bold border border-red-500/40 flex items-center justify-center gap-2"
                              >
                                Cancel Order
                              </motion.button>
                            )}

                          {/* 💳 Pay Now */}
                          {order.status === "PAYMENT_PENDING" && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePayment(order.order_id)}
                              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 border border-indigo-500/50"
                            >
                              <CreditCard className="w-4 h-4" />
                              Initialize Payment
                              <ChevronRight className="w-4 h-4" />
                            </motion.button>
                          )}

                        </div>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal */}

        {selectedOrder && (
          <BuildDetailsModal
            build={selectedOrder.build}
            onClose={() => setSelectedOrder(null)}
          />
        )}
        <AnimatePresence>
              {cancelOrderId && (
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                  >
                    <h2 className="text-xl font-bold text-white mb-4">
                      Cancel this order?
                    </h2>

                    <p className="text-zinc-400 mb-6">
                      This action cannot be undone. Your order will be permanently cancelled.
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setCancelOrderId(null)}
                        className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
                      >
                        No
                      </button>

                      <button
                        onClick={handleCancel}
                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold"
                      >
                        Yes, Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

      </div>
      <ExecutionProgressModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        progressData={progressData}
      />
      {reviewOrder && (
      <ReviewModal
        order={reviewOrder}
        onClose={() => setReviewOrder(null)}
        onReviewSuccess={() => dispatch(fetchMyOrders())}
      />
    )}
    </div>
  );
};

export default OrdersPage; 