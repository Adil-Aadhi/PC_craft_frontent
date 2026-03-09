import { FiBell, FiChevronDown, FiLogOut, FiMessageSquare } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useKycGuard from "../hooks/useKycGuard";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import LogoutModal from "../../Admin/components/AdminLogoutModal";

export default function WorkerNavbar() {
  const navigate = useNavigate();
  const { checkKyc } = useKycGuard();
  const { handleLogout, user } = useAuth();
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const HanndleProfileView = () => navigate("/worker/profile");
  const HanndleMessageView = () => navigate("/worker/chat");
  const HanndleNotificationView = () => navigate("/worker/notifications");

  const fetchImage = async () => {
    try {
      const res = await api.get("workers/profile-image/");
      setImage(res.data.profile_image);
    } catch (err) {
      console.error("Image fetch failed", err);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-4 z-50 w-full flex justify-center"
    >
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 flex items-center justify-between shadow-md">

        {/* Left */}
        <Link to="/worker/dashboard" className="flex items-center gap-1">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-md opacity-30" />
            <Zap className="relative w-5 h-5 text-purple-500" />
          </div>
          <span className="text-md font-bold text-gray-900">
            PC<span className="text-purple-500">craft</span>
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={HanndleNotificationView}
            className="relative p-1 rounded-lg hover:bg-white/40 transition"
          >
            <FiBell className="text-xl text-gray-700" />
          </motion.button>

          {/* Messages */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => checkKyc(HanndleMessageView)}
            className="relative p-1 rounded-lg hover:bg-white/40 transition"
          >
            <FiMessageSquare className="text-xl text-gray-700" />
          </motion.button>

          {/* Profile section */}
          <div className="relative flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/40 transition">

            {/* Avatar + info */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => checkKyc(HanndleProfileView)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden 
                bg-gradient-to-r from-blue-500 to-purple-600 
                flex items-center justify-center 
                text-white text-xs font-semibold">

                {image ? (
                  <img
                    src={image}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.username?.charAt(0).toUpperCase()
                )}
              </div>

              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold text-gray-800">
                  {user?.username}
                </p>
                <p className="text-[10px] text-gray-500">PC Builder</p>
              </div>
            </motion.div>

            {/* Dropdown trigger */}
            <motion.div
              whileTap={{ rotate: 180 }}
              onClick={() => setOpen(!open)}
              className="cursor-pointer"
            >
              <FiChevronDown className="text-gray-600 text-sm" />
            </motion.div>

            {/* Dropdown */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg"
                >
                  <button
                    onClick={()=>setLogoutOpen(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut size={14} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
                  <LogoutModal
                        isOpen={logoutOpen}
                        onClose={() => setLogoutOpen(false)}
                        onConfirm={handleLogout}
                      />
        </div>
      </div>
    </motion.div>
  );
}