import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Lock, Eye, EyeOff, CheckCircle, AlertCircle,Loader2,Shield } from "lucide-react";

const ResetPasswordStep = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onReset,
  loading,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthTexts = ["Weak", "Fair", "Good", "Strong"];
  const strengthMessages = [
    "Use at least 8 characters",
    "Add uppercase letters",
    "Add numbers",
    "Add special characters"
  ];

  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password && confirmPassword && password === confirmPassword;
  const isFormValid = isPasswordValid && doPasswordsMatch;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Create New Password</h3>
        <p className="text-sm text-gray-500">
          Choose a strong password you haven't used before
        </p>
      </div>

      {/* PASSWORD INPUT */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1">
          <Key className="w-4 h-4 text-green-500" />
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 pr-12 bg-white border-2 border-gray-100 
                       rounded-xl focus:border-green-500 focus:ring-4 
                       focus:ring-green-100 outline-none transition-all 
                       duration-200 text-gray-700 placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password strength indicator */}
        {password && (
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
                Strength: <span className="font-medium">{strengthTexts[strength - 1] || "Very weak"}</span>
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

      {/* CONFIRM PASSWORD INPUT */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1">
          <Lock className="w-4 h-4 text-green-500" />
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3.5 pr-12 bg-white border-2 border-gray-100 
                       rounded-xl focus:border-green-500 focus:ring-4 
                       focus:ring-green-100 outline-none transition-all 
                       duration-200 text-gray-700 placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password match indicator */}
        {confirmPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 mt-1"
          >
            {password === confirmPassword ? (
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

      {/* ERROR MESSAGE */}
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

      {/* RESET BUTTON */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        disabled={loading || !isFormValid}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 
                   text-white py-3.5 rounded-xl font-medium 
                   shadow-lg shadow-green-500/25 
                   hover:shadow-xl hover:shadow-green-500/30 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Updating Password...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Reset Password</span>
          </>
        )}
      </motion.button>

      {/* Password requirements */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Password requirements:</p>
        <ul className="space-y-1">
          <li className="flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
            At least 8 characters
          </li>
          <li className="flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
            One uppercase letter
          </li>
          <li className="flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
            One number
          </li>
          <li className="flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
            One special character
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ResetPasswordStep;