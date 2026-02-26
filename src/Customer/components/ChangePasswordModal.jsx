import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  AlertCircle, 
  CheckCircle,
  Key,
  Shield 
} from "lucide-react";
import LoadingSpinner from "../context/LoadingSpinner";

const ChangePasswordModal = ({ onClose, onSubmit, loading, error }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(newPass);
  const strengthColors = [
    "bg-red-500", 
    "bg-orange-500", 
    "bg-yellow-500", 
    "bg-green-500"
  ];
  const strengthTexts = ["Weak", "Fair", "Good", "Strong"];
  
  const isPasswordValid = newPass.length >= 8;
  const doPasswordsMatch = newPass && confirmPass && newPass === confirmPass;
  const isFormValid = oldPass && isPasswordValid && doPasswordsMatch;

  const handleSubmit = () => {
    onSubmit(oldPass, newPass, confirmPass);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", damping: 25, stiffness: 300 } 
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Change Password
            </h3>
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 
                       hover:text-white transition-colors p-1 rounded-full 
                       hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Old Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Lock className="w-4 h-4 text-slate-500" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? "text" : "password"}
                  placeholder="Enter current password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:border-slate-500 focus:ring-4 
                           focus:ring-slate-100 outline-none transition-all 
                           duration-200 text-gray-700 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showOldPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Key className="w-4 h-4 text-slate-500" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:border-slate-500 focus:ring-4 
                           focus:ring-slate-100 outline-none transition-all 
                           duration-200 text-gray-700 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPass && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 mt-2"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= strength ? strengthColors[strength - 1] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Strength:{" "}
                      <span className="font-medium">
                        {strengthTexts[strength - 1] || "Very weak"}
                      </span>
                    </p>
                    {isPasswordValid && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Length OK
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Lock className="w-4 h-4 text-slate-500" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:border-slate-500 focus:ring-4 
                           focus:ring-slate-100 outline-none transition-all 
                           duration-200 text-gray-700 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password match indicator */}
              {confirmPass && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 mt-1"
                >
                  {newPass === confirmPass ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 flex-1">{error}</p>
              </motion.div>
            )}

            {/* Password requirements */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-2 text-gray-700">Password requirements:</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    newPass.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={newPass.length >= 8 ? 'text-green-600' : ''}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    /[A-Z]/.test(newPass) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={/[A-Z]/.test(newPass) ? 'text-green-600' : ''}>
                    One uppercase letter
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    /[0-9]/.test(newPass) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={/[0-9]/.test(newPass) ? 'text-green-600' : ''}>
                    One number
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    /[^A-Za-z0-9]/.test(newPass) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={/[^A-Za-z0-9]/.test(newPass) ? 'text-green-600' : ''}>
                    One special character
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border-2 border-gray-200 
                       text-gray-700 font-medium hover:bg-gray-100 
                       transition-all duration-200"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !isFormValid}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-slate-900 
                       to-slate-800 text-white font-medium shadow-lg 
                       shadow-slate-900/25 hover:shadow-xl 
                       hover:shadow-slate-900/30 disabled:opacity-50 
                       disabled:cursor-not-allowed transition-all duration-200
                       flex items-center justify-center gap-2 min-w-[140px]"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordModal;