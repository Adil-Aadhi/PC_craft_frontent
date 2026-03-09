import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMicrochip,
  FaServer,
  FaBolt,
  FaDesktop,
  FaTabletAlt,
  FaCube,
  FaCheckCircle,
  FaShieldAlt,
  FaArrowRight,
  FaAward,
  FaCrown,
  FaSync,
} from "react-icons/fa";
import api from "../../api/axios";
import { FaTools } from "react-icons/fa";
import { updateOrderStatus } from "../../orders/services/orderService";
import { toast } from "react-toastify";

/* ---------------- ICON MAP ---------------- */

const ICON_MAP = [
  { keywords: ["cpu"], icon: FaMicrochip, gradient: "from-blue-500 to-cyan-500", key: "cpu" },
  { keywords: ["motherboard"], icon: FaBolt, gradient: "from-purple-500 to-pink-500", key: "motherboard" },
  { keywords: ["ram", "memory"], icon: FaServer, gradient: "from-green-500 to-emerald-500", key: "ram" },
  { keywords: ["gpu", "graphics"], icon: FaDesktop, gradient: "from-orange-500 to-red-500", key: "gpu" },
  { keywords: ["storage", "ssd", "hdd"], icon: FaTabletAlt, gradient: "from-yellow-500 to-amber-500", key: "storage" },
  { keywords: ["psu", "power"], icon: FaSync, gradient: "from-indigo-500 to-purple-500", key: "psu" },
  { keywords: ["cabinet", "case"], icon: FaCube, gradient: "from-gray-600 to-gray-800", key: "case" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

export default function WorkerProjectExecution() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [components, setComponents] = useState([]);
  const [progress, setProgress] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [verifyingKey, setVerifyingKey] = useState(null);

  /* ---------------- FETCH ORDER + PROGRESS ---------------- */

  const fetchData = async () => {
        try {
          const orderRes = await api.get(`orders/worker-project/${id}/`);
          setOrder(orderRes.data);

          const build = orderRes.data.build;

          const COMPONENT_KEYS = [
            "cpu",
            "motherboard",
            "ram",
            "gpu",
            "storage",
            "psu",
            "case",
            "cooler",
            "case_fan",
          ];

          const initialComponents = build
            ? COMPONENT_KEYS
                .filter((key) => build[key])
                .map((key) => ({
                  ...build[key],
                  key,
                }))
            : [];

          const progressRes = await api.get(
            `orders/worker-project/${id}/component/progress/`
          );

          const progressData = progressRes.data;

          const merged = initialComponents.map((comp) => ({
            ...comp,
            verified: progressData[comp.key] || false,
          }));

          setComponents(merged);
          setProgress(progressData.progress || 0);
          setVerifiedCount(merged.filter((c) => c.verified).length);

        } catch (err) {
          console.error("Failed to load execution data", err);
        } finally {
          setLoading(false);
        }
      };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ---------------- VERIFY COMPONENT ---------------- */

 const handleVerify = async (componentKey) => {
    if (!componentKey) return;

    try {
      setVerifyingKey(componentKey);

      // ✅ Optimistic UI + instant progress calculation
      setComponents((prev) => {
        const updatedComponents = prev.map((c) =>
          c.key === componentKey ? { ...c, verified: true } : c
        );

        const verifiedCount = updatedComponents.filter((c) => c.verified).length;
        const progressPercent = Math.round(
          (verifiedCount / updatedComponents.length) * 100
        );

        setVerifiedCount(verifiedCount);
        setProgress(progressPercent);

        return updatedComponents;
      });

      // ✅ Backend update (no need to depend on its response for UI)
      await api.patch(
        `orders/worker-project/${id}/component/verify/`,
        { component: componentKey }
      );

    } catch (err) {
      console.error("Verification failed", err);

      // 🔁 rollback if API fails
      setComponents((prev) =>
        prev.map((c) =>
          c.key === componentKey ? { ...c, verified: false } : c
        )
      );
    } finally {
      setVerifyingKey(null);
    }
  };

  const handleComplete = async () => {
    const res = await updateOrderStatus(order.order_id, "COMPLETED");

    if (res.success) {
      toast.success("Project completed!");

      await fetchData(); // refresh UI

    } else {
      toast.error("Failed to complete project");
    }
  };

  const allVerified =
    components.length > 0 &&
    components.every((c) => c.verified);

 if (loading)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin" />
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="ms-5">
         {/* Back Button */}
        <div className="mt-5 mb-5">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Projects
          </button>
        </div>
        {/* HEADER */}
       <div className="bg-white rounded-2xl shadow-md mb-8 p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <FaTools className="text-indigo-600 text-2xl" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Project Execution
                  </h1>
                  <p className="text-sm text-gray-500">
                    Order ID: {order?.order_id}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  order?.status === "CANCELLED"
                    ? "bg-red-100 text-red-600"
                    : order?.status === "COMPLETED"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {order?.status}
              </span>

            </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CHECKLIST */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {components.map((component) => {
              const iconConfig = ICON_MAP.find(
                (item) => item.key === component.key
              );

              const Icon = iconConfig?.icon || FaCube;
              const gradient =
                iconConfig?.gradient ||
                "from-gray-500 to-gray-700";

              return (
                <motion.div
                  key={component.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl`}>
                      <Icon className="text-white text-2xl" />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        {component.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        ₹ {component.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={component.verified}
                    onClick={() =>
                      handleVerify(component.key)
                    }
                    className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition ${
                      component.verified
                        ? "bg-green-100 text-green-700"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {verifyingKey === component.key
                      ? "Updating..."
                      : component.verified ? (
                        <>
                          <FaCheckCircle />
                          Verified
                        </>
                      ) : (
                        <>
                          <FaShieldAlt />
                          Verify
                          <FaArrowRight className="text-sm" />
                        </>
                      )}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* PROGRESS PANEL */}
<div className="lg:col-span-1">
  <div className="sticky top-24 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <h2 className="font-semibold text-lg text-gray-800">
        Build Progress
      </h2>
      <span className="text-sm text-gray-500">
        {verifiedCount}/{components.length}
      </span>
    </div>

    {/* Vertical Progress Section */}
    <div className="flex justify-center mb-8">

      <div className="relative h-56 w-20 bg-gray-100 rounded-2xl overflow-hidden shadow-inner">

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_#000_1px,_transparent_0)] bg-[length:10px_10px]" />

        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-600 to-blue-400 transition-all duration-700 ease-out flex items-center justify-center"
          style={{ height: `${progress}%` }}
        >
          <span className="text-white text-sm font-semibold">
            {progress}%
          </span>
        </div>

      </div>

    </div>

    {/* Info Text */}
    <div className="text-center mb-6">
      <p className="text-sm text-gray-500">
        Components Verified
      </p>
      <p className="text-lg font-semibold text-gray-800">
        {verifiedCount} of {components.length}
      </p>
    </div>

    {/* Complete Button */}
    {allVerified && (
      <>
        {order.status === "BUILD_IN_PROGRESS" && (
          <button
            onClick={handleComplete}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-xl shadow-md"
          >
            <FaAward className="inline mr-2" />
            Mark Order Complete
          </button>
        )}

        {order.status === "COMPLETED" && (
          <div className="w-full bg-green-100 text-green-700 font-semibold py-3 rounded-xl text-center border border-green-300 shadow-sm">
             Project Completed
          </div>
        )}
      </>
    )}

  </div>
</div>

        </div>
      </div>
    </div>
  );
}