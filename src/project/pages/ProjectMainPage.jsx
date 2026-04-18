import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import {
  FolderKanban,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  Package,
  Trash
} from "lucide-react";

export default function WorkerProjects() {

  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});   // ⭐ NEW
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const navigate = useNavigate();

  /* ---------------- FETCH ---------------- */

  const fetchOrders = async (filter = "all") => {

    setLoading(true);

    try {

      const url =
        filter === "all"
          ? "/orders/worker-project/"
          : `/orders/worker-project/?status=${filter}`;

      const res = await api.get(url);

      setOrders(res.data.orders);   // ⭐ changed
      setCounts(res.data.counts);   // ⭐ changed

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- FILTER ---------------- */

  const handleFilter = (filter) => {

    setSelectedFilter(filter);

    fetchOrders(filter);

  };

  /* ---------------- STATUS COLOR ---------------- */

  const getStatusColor = (status) => {

    const statusColors = {
      PAYMENT_PENDING: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
      BUILD_IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
      COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      CANCELLED: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-100"
    };

    return statusColors[status] || "bg-gray-100 text-gray-700";

  };

  const formatStatus = (status) => {
    return status?.split("_").map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };

  /* ---------------- ANIMATION VARIANTS ---------------- */

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"/>
      </div>
    );

  }

  return (

    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="px-3 py-4 md:px-6 md:py-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Projects</h1>
            <p className="text-sm text-gray-600">
              You have {counts.TOTAL || 0} total project{counts.TOTAL !== 1 ? "s" : ""}
            </p>
          </div>

          {/* FILTERS with horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-4 px-4 scrollbar-none sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">

            {[
              { label: "All Projects", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "In Progress", value: "in_progress" },
              { label: "Completed", value: "completed" },
            ].map((f)=>(

              <button
                key={f.value}
                onClick={()=>handleFilter(f.value)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  selectedFilter===f.value
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                    : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>

            ))}

          </div>

        </div>

        {/* STATS */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8"
        >

          <StatCard
            label="Total Projects"
            value={counts.TOTAL || 0}
            icon={<FolderKanban className="w-6 h-6 text-blue-600"/>}
          />

          <StatCard
            label="In Progress"
            value={counts.BUILD_IN_PROGRESS || 0}
            icon={<Activity className="w-6 h-6 text-amber-500"/>}
          />

          <StatCard
            label="Completed"
            value={counts.COMPLETED || 0}
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-500"/>}
          />

          <StatCard
            label="Pending"
            value={counts.PAYMENT_PENDING || 0}
            icon={<Clock className="w-6 h-6 text-purple-500"/>}
          />

        </motion.div>

        {/* PROJECT GRID */}

        <AnimatePresence mode="wait">

          <motion.div
            key={selectedFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{opacity:0}}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6"
          >

          {orders.length === 0 ? (

                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <FolderKanban className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    No Projects Assigned
                  </h3>
                  <p className="text-gray-500 mt-1">
                    You don't have any assigned projects yet.
                  </p>
                </div>

              ) : (

                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/worker/projects/${order.order_id}`)}
                    className="group bg-white rounded-2xl shadow-lg cursor-pointer border"
                  >

                    <div className="p-4 md:p-6">

                      <div className="flex justify-between items-start">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                        <FolderKanban className="w-5 h-5 text-gray-300" />
                      </div>

                      <h2 className="text-lg md:text-xl font-bold mt-2 md:mt-3">
                        {order.build.build_name}
                      </h2>

                      <div className="mt-5">
                        <div className="flex justify-between items-end text-xs mb-2">
                          <span className="text-gray-400 font-medium uppercase tracking-tight">Progress</span>
                          <span className="font-bold text-gray-800">
                            {order.status === "COMPLETED" ? "100%" :
                             order.status === "BUILD_IN_PROGRESS" ? "65%" :
                             order.status === "PAYMENT_PENDING" ? "20%" : "5%"}
                          </span>
                        </div>

                        <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width:
                              order.status === "COMPLETED" ? "100%" :
                              order.status === "BUILD_IN_PROGRESS" ? "65%" :
                              order.status === "PAYMENT_PENDING" ? "20%" : "5%"
                            }}
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              order.status === "COMPLETED"
                                ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                : order.status === "BUILD_IN_PROGRESS"
                                ? "bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                : "bg-gradient-to-r from-amber-400 to-amber-600"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400"/>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium uppercase">Components</p>
                            <p className="text-sm font-bold text-gray-800">
                              {Object.keys(order.build || {}).filter(k => 
                                !['id', 'build_name', 'total_budget', 'user', 'created_at', 'updated_at', 'is_ordered', 'order_id'].includes(k)
                              ).length} Items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-gray-400"/>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium uppercase">Build Type</p>
                            <p className="text-sm font-bold text-gray-800">Custom PC</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="bg-gray-50/50 px-4 py-3 md:px-6 flex justify-between items-center text-[10px] md:text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5"/>
                        TAP TO MANAGE PROJECT
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-50"/>
                    </div>

                  </motion.div>
                ))

              )}

          </motion.div>

        </AnimatePresence>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      ` }} />
    </div>

  );

}

/* ---------------- STAT CARD ---------------- */

function StatCard({label,value,icon}){

  return(
    <motion.div
      className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 border shadow-sm flex justify-between items-center"
    >
      <div>
        <p className="text-[10px] md:text-sm text-gray-600">{label}</p>
        <p className="text-lg md:text-xl font-bold">{value}</p>
      </div>
      <div className="shrink-0 scale-90 md:scale-100">
        {icon}
      </div>
    </motion.div>
  )

}