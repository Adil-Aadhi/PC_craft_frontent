import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAuthButton from "../components/GoogleButton";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { role } = useParams();
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // Mark as touched when user starts typing
    if (e.target.name === "password" && !passwordTouched) {
      setPasswordTouched(true);
    }
    if (e.target.name === "confirm_password" && !confirmTouched) {
      setConfirmTouched(true);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(form.password);
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500"
  ];
  const strengthTexts = ["Weak", "Fair", "Good", "Strong"];
  
  const isPasswordValid = form.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(form.password);
  
  const doPasswordsMatch = form.password && form.confirm_password && 
                          form.password === form.confirm_password;
  const isFormValid = form.full_name && form.email && form.username && 
                     isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setPasswordTouched(true);
      setConfirmTouched(true);
      return;
    }
    
    try {
      const user = await register(role, form);
      if (user.role === "user") {
        navigate("/");
      } else if (user.role === "worker") {
        navigate("/worker/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {}
  };

  // Role-based theme
  const theme =
    role === "user"
      ? {
          gradient: "from-blue-100 via-blue-50 to-cyan-100",
          ring: "focus:ring-blue-400 focus:border-blue-400",
          button: "bg-blue-500 hover:bg-blue-600",
          title: "text-blue-600",
          accent: "blue",
          strengthGradient: "from-blue-500 to-cyan-500",
        }
      : {
          gradient: "from-orange-100 via-orange-50 to-amber-100",
          ring: "focus:ring-orange-400 focus:border-orange-400",
          button: "bg-orange-500 hover:bg-orange-600",
          title: "text-orange-500",
          accent: "orange",
          strengthGradient: "from-orange-500 to-amber-500",
        };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.gradient} px-4 py-8`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-3">
            <HiOutlineShieldCheck className={`w-8 h-8 ${theme.title}`} />
          </div>
          <h2 className={`text-3xl font-bold capitalize ${theme.title}`}>
            Register as {role}
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Create your account in minutes
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-red-500 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Google Button */}
        <GoogleAuthButton role={role} mode="register" />

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-300" />
          <span className="text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              name="full_name"
              value={form.full_name}
              placeholder="Full Name"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                       focus:outline-none ${theme.ring} transition-all duration-200
                       bg-gray-50 focus:bg-white`}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Email Address"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                       focus:outline-none ${theme.ring} transition-all duration-200
                       bg-gray-50 focus:bg-white`}
            />
          </div>

          {/* Username */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              name="username"
              value={form.username}
              placeholder="Username"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl 
                       focus:outline-none ${theme.ring} transition-all duration-200
                       bg-gray-50 focus:bg-white`}
            />
          </div>

          {/* Password with visibility toggle */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              placeholder="Password"
              onChange={handleChange}
              onBlur={() => setPasswordTouched(true)}
              className={`w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl 
                       focus:outline-none ${theme.ring} transition-all duration-200
                       bg-gray-50 focus:bg-white`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                       hover:text-slate-600 transition-colors"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password strength indicator */}
          <AnimatePresence>
            {(passwordTouched || form.password) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 px-1"
              >
                {/* Strength bars */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <motion.div
                      key={level}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: level * 0.05 }}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        level <= strength ? strengthColors[strength - 1] : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Strength text */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Password strength:{" "}
                    <span className="font-medium">
                      {strengthTexts[strength - 1] || "Very weak"}
                    </span>
                  </p>
                  {isPasswordValid && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      ✓ Length OK
                    </span>
                  )}
                </div>

                {/* Password requirements checklist */}
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      form.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={form.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      hasUppercase ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                      Uppercase
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      hasNumber ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={hasNumber ? 'text-green-600' : 'text-gray-500'}>
                      Number
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      hasSpecial ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={hasSpecial ? 'text-green-600' : 'text-gray-500'}>
                      Special char
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm Password with visibility toggle */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirm_password}
              placeholder="Confirm Password"
              onChange={handleChange}
              onBlur={() => setConfirmTouched(true)}
              className={`w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl 
                       focus:outline-none ${theme.ring} transition-all duration-200
                       bg-gray-50 focus:bg-white
                       ${confirmTouched && !doPasswordsMatch && form.confirm_password 
                         ? 'border-red-300 bg-red-50' 
                         : doPasswordsMatch && form.confirm_password 
                         ? 'border-green-300 bg-green-50' 
                         : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 
                       hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password match indicator */}
          <AnimatePresence>
            {confirmTouched && form.confirm_password && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 px-1 text-xs"
              >
                {doPasswordsMatch ? (
                  <span className="text-green-600 flex items-center gap-1">
                    ✓ Passwords match
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    ✗ Passwords do not match
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login link */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`font-semibold underline ${
                  role === "user" ? "text-blue-600" : "text-orange-500"
                } hover:opacity-80`}
              >
                Sign in here
              </button>
            </p>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600 text-center">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading || !isFormValid}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3.5 text-white font-semibold rounded-xl 
                     transition-all duration-200 ${theme.button} 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-lg ${role === 'user' 
                       ? 'shadow-blue-500/25' 
                       : 'shadow-orange-500/25'
                     }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </motion.button>

          {/* Form validation summary */}
          {(!isFormValid && (passwordTouched || confirmTouched)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-500 text-center mt-2"
            >
              {!form.full_name && "• Full name required • "}
              {!form.email && "• Email required • "}
              {!form.username && "• Username required • "}
              {!isPasswordValid && "• Stronger password needed • "}
              {!doPasswordsMatch && form.confirm_password && "• Passwords must match"}
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Register;