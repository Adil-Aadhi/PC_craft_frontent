import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen w-full bg-[#f4f7fb] text-slate-900 ">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.10),_transparent_24%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_42%,#eef4ff_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-0 py-2"
      >
        <div className="flex items-center justify-between rounded-[26px] border border-slate-200/80 bg-white/80 px-4 py-3 mt-24 shadow-sm backdrop-blur-xl sm:px-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
              Activity Center
            </p>
            <h1 className="mt-1 text-xl font-semibold sm:text-2xl">Notifications</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {apiUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <NotificationPanel apiUrl={apiUrl} theme="light" />
          </motion.div>
        ) : (
          <p className="text-slate-500">No notifications available</p>
        )}
      </motion.div>
    </div>
  );
};

export default WorkerNotifications;
