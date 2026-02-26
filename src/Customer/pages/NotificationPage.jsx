import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NotificationPanel from "../../Notifications/components/NotificationPanel";

const UserNotifications = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="px-4 flex justify-center bg-white min-h-screen"
    >
      <div className="w-full max-w-3xl mt-20">

        {/* Header */}
        <div className="flex justify-end mt-10">
          <motion.button
            onClick={() => navigate(-1)}
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

        {/* Add spacing ONLY before card */}
        <div className="mt-5"> 
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <NotificationPanel apiUrl={"/notifications/worker/list-out/"} />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default UserNotifications;