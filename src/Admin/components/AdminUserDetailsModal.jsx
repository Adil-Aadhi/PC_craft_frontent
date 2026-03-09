import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function UserDetailModal({ user, onClose, onToggle }) {
  const [isToggling, setIsToggling] = useState(false);

  if (!user) return null;

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(user.id);
    setIsToggling(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getKYCStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient background */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            <div className="absolute inset-0 bg-black/20" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile section - overlapping card */}
          <div className="relative px-6 pb-6">
            <motion.div
              initial={{ scale: 0.5, y: -50 }}
              animate={{ scale: 1, y: -60 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="absolute left-6"
            >
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.full_name || user.username}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(user.full_name || user.username)}
                  </span>
                </div>
              )}
            </motion.div>

            <div className="ml-28 pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.full_name || user.username}
                  </h2>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </p>
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}
                >
                  {user.role?.toUpperCase()}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4 px-6 mb-6">

            {/* Worker Stats */}
            {user.role === "worker" && (
                <>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 rounded-xl p-4 text-center"
                >
                    <div className="text-2xl font-bold text-gray-900">
                    {user.rating || "0"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Rating</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gray-50 rounded-xl p-4 text-center"
                >
                    <div className="text-2xl font-bold text-gray-900">
                    {user.completed_orders || "0"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Completed</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 rounded-xl p-4 text-center"
                >
                    <div className="text-2xl font-bold text-gray-900">
                    {user.reviews_count || "0"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Reviews</div>
                </motion.div>
                </>
            )}

            {/* User Stats */}
            {user.role === "user" && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-4 text-center col-span-3"
                >
                <div className="text-2xl font-bold text-gray-900">
                    {user.order_count || "0"}
                </div>
                <div className="text-xs text-gray-500 mt-1">Orders</div>
                </motion.div>
            )}

            </div>

          {/* Info Grid with improved design */}
          <div className="px-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {user.phone || "Not provided"}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <p className="text-xs text-gray-500 mb-1">Member Since</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(user.date_joined)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <p className="text-xs text-gray-500 mb-1">Last Login</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(user.last_login) || "Never"}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                 {user.address
                    ? `${user.address.city}, ${user.address.state}`
                    : "Not specified"}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Status and KYC Section */}
          <div className="px-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border rounded-xl p-4"
              >
                <p className="text-xs text-gray-500 mb-2">Account Status</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.is_active 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {user.is_active ? "Active" : "Blocked"}
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {user.id}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="border rounded-xl p-4"
              >
                <p className="text-xs text-gray-500 mb-2">KYC Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getKYCStatusColor(user.kyc_status)}`}>
                  {user.kyc_status || "N/A"}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons - Preserved original workflow */}
          <div className="px-6 py-6 bg-gray-50 mt-6 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggle}
              disabled={isToggling}
              className={`px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all flex items-center gap-2 ${
                user.is_active
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isToggling ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {user.is_active ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Block User
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Unblock User
                    </>
                  )}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}