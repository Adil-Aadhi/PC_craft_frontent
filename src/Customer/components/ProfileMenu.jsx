import { motion } from "framer-motion";
import {
  FiUser,
  FiMapPin,
  FiPackage,
  FiShield,
  FiActivity,
  FiAlertTriangle,
  FiImage,
} from "react-icons/fi";

const MENU = [
  { id: "avatar", label: "Avatar", icon: FiImage },
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "address", label: "Address", icon: FiMapPin },
  { id: "orders", label: "Orders", icon: FiPackage },
  { id: "security", label: "Security", icon: FiShield },
  { id: "sessions", label: "Sessions", icon: FiActivity },
  { id: "danger", label: "Danger", icon: FiAlertTriangle },
];

const ProfileMenu = ({ active }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -120;
    const y =
      el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="sticky top-32 h-[calc(100vh-8rem)] flex items-center">
      <div className="w-full">

        {/* GLASS MENU CARD */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-3 flex flex-col">

          

          {/* MENU ITEMS */}
          <div className="relative space-y-1 flex-1">
            {MENU.map((item) => {
              const isActive = active === item.id;
              const Icon = item.icon;
              const isDanger = item.id === "danger";

              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="relative w-full text-left px-4 py-2.5 rounded-xl"
                >
                  {/* ACTIVE GLIDING BACKGROUND */}
                  {isActive && (
                    <motion.div
                      layoutId="activeRow"
                      className="absolute inset-0 rounded-xl bg-slate-900"
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 28,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3">
                    {/* ICON */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                            isActive
                            ? "bg-white/20 text-white"
                            : isDanger
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* LABEL */}
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isActive ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* CHEVRON */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-auto text-white/70"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  {/* ACTIVE DOT */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* ACTIVE STATUS — INSIDE CARD */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 pt-3 border-t border-white/30"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
              <span className="tracking-wide">
                {MENU.find((m) => m.id === active)?.label}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
