import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import NotificationPanel from "../../Notifications/components/NotificationPanel";

const THEME_KEY = "notification-theme";

const UserNotifications = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);


  const isDark = theme === "dark";

  const shellClass = isDark ? "bg-[#07111f] text-slate-100" : "bg-[#f4f7fb] text-slate-900";
  const backdropClass = isDark
    ? "bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.07),_transparent_24%),linear-gradient(180deg,#07111f_0%,#0b1220_48%,#111827_100%)]"
    : "bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.10),_transparent_24%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_42%,#eef4ff_100%)]";
  const topBarClass = isDark
    ? "border-white/10 bg-white/8"
    : "border-slate-200/80 bg-white/80";
  const iconButtonClass = isDark
    ? "border-white/10 bg-white/10 text-slate-200 hover:bg-white/16"
    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100";
  const subTextClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <div className={`min-h-screen ${backdropClass} px-3 py-3 sm:px-5 sm:py-5`}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-6xl flex-col gap-3 sm:h-[calc(100vh-2.5rem)] sm:gap-4"
        >
          <div className={`flex items-center justify-between rounded-[26px] border px-4 py-3 sm:px-5 ${topBarClass} backdrop-blur-xl mt-24`}>
            <div>
              <p className={`text-[11px] uppercase tracking-[0.32em] ${subTextClass}`}>
                Activity Center
              </p>
              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">Notifications</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.24, ease: "easeOut" }}
              className="h-full"
            >
              <NotificationPanel apiUrl="/notifications/worker/list-out/" theme={theme} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserNotifications;
