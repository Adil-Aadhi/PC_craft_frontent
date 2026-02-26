import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";

const EmailStep = ({ email, setEmail, onSend, loading, error, message }) => (
  <motion.form
    onSubmit={onSend}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-5"
  >
    <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center"
            >
              <Mail className="w-6 h-6 text-blue-500" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Find your account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your email address to receive a verification code
            </p>
          </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-1">
        <Mail className="w-4 h-4 text-blue-500" />
        Email Address
      </label>

      <div className="relative">
        <motion.input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl 
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                     outline-none transition-all duration-200 text-gray-700 
                     placeholder:text-gray-400 shadow-sm"
        />
        {email && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
          </motion.div>
        )}
      </div>
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

    {/* SUCCESS MESSAGE */}
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2"
      >
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-700 flex-1">{message}</p>
      </motion.div>
    )}

    {/* BUTTON */}
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                 py-3.5 rounded-xl font-medium shadow-lg shadow-blue-500/25 
                 hover:shadow-xl hover:shadow-blue-500/30 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Sending OTP...</span>
        </>
      ) : (
        <>
          <span>Send OTP</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </motion.button>

    <p className="text-xs text-gray-500 text-center mt-4">
      We'll send a 6-digit verification code to this email
    </p>
  </motion.form>
);

export default EmailStep;