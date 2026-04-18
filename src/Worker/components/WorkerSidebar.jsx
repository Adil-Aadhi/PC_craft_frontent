import {
  FiCpu,
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
  FiLogOut ,
  FiUser
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import LogoutModal from "../../Admin/components/AdminLogoutModal";

export default function WorkerSidebar({ forceOpen }) {
  const navigate = useNavigate();
  const {handleLogout}=useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group text-white rounded-[2rem] shadow-2xl transition-all duration-300 flex flex-col overflow-hidden p-4 
        ${forceOpen ? "w-[min(85vw,280px)] max-h-[75vh] bg-white/10 backdrop-blur-2xl border border-white/20" : "bg-gradient-to-b from-gray-900 to-gray-800 w-20 hover:w-64 sticky top-20 mt-10 shadow-xl"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-3 mb-4">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="p-2 bg-blue-500 rounded-xl"
        >
          <FiCpu className="text-xl" />
        </motion.div>

        <div className={`${forceOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-200`}>
          <h1 className="text-base font-bold whitespace-nowrap">
            PC Customizer
          </h1>
          <p className="text-xs text-gray-400 whitespace-nowrap">
            Professional Builder
          </p>
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        className="flex-1 px-2 space-y-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        <NavItem icon={<FiTrendingUp />} label="Overview" onClick={() => navigate("/worker/dashboard")} forceOpen={forceOpen} />
        <NavItem icon={<FiPackage />} label="Projects" onClick={() => navigate("/worker/projects")} forceOpen={forceOpen} />
        <NavItem icon={<FiDollarSign />} label="Earnings" onClick={() => navigate("/worker/revenue")} forceOpen={forceOpen} />
        <NavItem icon={<FiUser />} label="Profile" onClick={() => navigate("/worker/profile")} forceOpen={forceOpen} />

        {/* Divider */}
        <div className="my-3 border-t border-gray-700 opacity-60" />

        {/* Logout */}
        <NavItem
          icon={<FiLogOut />}
          label="Logout"
          onClick={()=>setLogoutOpen(true)}
          forceOpen={forceOpen}
          danger
        />
      </motion.nav>
       <LogoutModal
                            isOpen={logoutOpen}
                            onClose={() => setLogoutOpen(false)}
                            onConfirm={handleLogout}
                          />
    </motion.div>
  );
}

/* Sidebar Item */
const NavItem = ({ icon, label, active, count, onClick, danger, forceOpen }) => (
  <motion.button
    onClick={onClick}
    variants={{
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 },
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`
      w-full flex items-center gap-3 p-3 rounded-xl transition-all
      ${
        danger
          ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          : active
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
          : forceOpen 
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }
    `}
  >
    <span className="text-lg shrink-0">{icon}</span>

    <span className={`${forceOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity whitespace-nowrap`}>
      {label}
    </span>

    {count && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`ml-auto ${forceOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity bg-blue-500 text-white text-xs px-2 py-1 rounded-full`}
      >
        {count}
      </motion.span>
    )}
  </motion.button>
);