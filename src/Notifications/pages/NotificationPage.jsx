import { motion } from "framer-motion";
import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const WorkerNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  let apiUrl = null;

  if (user?.role === "worker") {
    apiUrl = "/notifications/worker/list-out/";
  } else if (user?.role === "user") {
    apiUrl = "/notifications/user/list-out/";
  } else if (user?.role === "admin") {
    apiUrl = "/notifications/admin/list-out/";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen px-4 mt-6 max-w-4xl mx-auto"
    >
      {/* Header row */}
      <div className="flex justify-end mb-3">
        <motion.button
          onClick={() => navigate("/worker/dashboard")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center w-9 h-9 rounded-full
                     bg-white hover:bg-zinc-300
                     text-zinc-800 hover:text-zinc-700
                     transition"
          aria-label="Close"
        >
          ✕
        </motion.button>
      </div>

      {/* Panel animation */}
      {apiUrl ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          <NotificationPanel apiUrl={apiUrl}/>
        </motion.div>
      ) : (
        <p className="text-gray-500">No notifications available</p>
      )}
    </motion.div>
  );
};

export default WorkerNotifications;