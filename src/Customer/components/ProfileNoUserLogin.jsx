import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PleaseLogin = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6"
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          w-full max-w-sm
          bg-white
          rounded-2xl
          shadow-xl
          overflow-hidden
          border border-slate-200
          hover:shadow-2xl
        "
      >
        {/* Decorative Header */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="
              w-16 h-16
              mx-auto mb-6
              rounded-full
              bg-gradient-to-br from-blue-100 to-purple-100
              flex items-center justify-center
              border-8 border-white
              shadow-lg
            "
          >
            <svg
              className="w-7 h-7 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>

          {/* Content */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-slate-900 mb-3 tracking-tight"
          >
            Access Restricted
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 mb-8 leading-relaxed"
          >
            Sign in to access services
          </motion.p>

          {/* Primary Action */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="
              w-full mb-4
              px-6 py-3.5
              rounded-lg
              text-sm font-semibold
              bg-slate-900 hover:bg-slate-800
              text-white
              shadow-md
            "
          >
            Continue to Login
          </motion.button>

          {/* Secondary Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/register")}
            className="
              w-full mb-4
              px-6 py-3
              rounded-lg
              text-sm font-medium
              bg-orange-500 hover:bg-orange-500/80
              border border-slate-300
              text-white
            "
          >
            Create Account
          </motion.button>


          {/* Theritery Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="
              w-full
              px-6 py-3
              rounded-lg
              text-sm font-medium
              bg-slate-400/30 hover:bg-slate-400/50
              border border-slate-300
              text-slate-700
            "
          >
            May be later
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PleaseLogin;
