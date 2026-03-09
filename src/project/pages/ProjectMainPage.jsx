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

    <div className="min-h-screen">
      <div className="px-6 py-8">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-gray-600">
              You have {counts.TOTAL || 0} total project{counts.TOTAL !== 1 ? "s" : ""}
            </p>
          </div>

          {/* FILTERS */}

          <div className="flex gap-2">

            {["all","pending","in_progress","completed"].map((filter)=>(

              <button
                key={filter}
                onClick={()=>handleFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedFilter===filter
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {filter==="all" ? "All Projects" : formatStatus(filter)}
              </button>

            ))}

          </div>

        </div>

        {/* STATS */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
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
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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

                    <div className="p-6">

                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>

                      <h2 className="text-xl font-bold mt-3">
                        {order.build.build_name}
                      </h2>

                      <div className="mt-4">

                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>
                            {order.status === "COMPLETED" ? "100%" :
                            order.status === "BUILD_IN_PROGRESS" ? "60%" :
                            order.status === "PAYMENT_PENDING" ? "20%" : "0%"}
                          </span>
                        </div>

                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">

                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width:
                              order.status === "COMPLETED" ? "100%" :
                              order.status === "BUILD_IN_PROGRESS" ? "60%" :
                              order.status === "PAYMENT_PENDING" ? "20%" : "0%"
                            }}
                            className={`h-full ${
                              order.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : order.status === "BUILD_IN_PROGRESS"
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                          />

                        </div>

                      </div>

                      <div className="flex justify-between mt-4 text-sm">

                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4"/>
                          Components
                        </div>

                        <span className="font-bold">
                          {Object.keys(order.build || {}).length - 7}
                        </span>

                      </div>

                    </div>

                    <div className="border-t px-6 py-3 flex justify-between text-xs text-gray-500">

                      <span className="flex items-center gap-1">
                        <ArrowRight className="w-4 h-4"/>
                        Click to view details
                      </span>

                      <ArrowRight className="w-5 h-5"/>

                    </div>

                  </motion.div>
                ))

              )}

          </motion.div>

        </AnimatePresence>

      </div>
    </div>

  );

}

/* ---------------- STAT CARD ---------------- */

function StatCard({label,value,icon}){

  return(
    <motion.div
      className="bg-white rounded-2xl p-4 border shadow-sm flex justify-between items-center"
    >
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      {icon}
    </motion.div>
  )

}