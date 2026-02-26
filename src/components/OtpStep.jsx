import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react";

const OtpStep = ({ otp, setOtp, onVerify, loading, error, onResend }) => {
  const inputs = useRef([]);

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, idx) => {
        if (idx < 6) newOtp[idx] = digit;
      });
      setOtp(newOtp);
      
      const lastFilledIndex = Math.min(digits.length, 5);
      inputs.current[lastFilledIndex]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="font-semibold text-gray-800">Enter Verification Code</h3>
        <p className="text-sm text-gray-500">
          We've sent a 6-digit code to your email
        </p>
      </div>

      {/* OTP BOXES */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <input
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 sm:w-14 sm:h-14 text-center text-xl font-semibold 
                         border-2 rounded-xl focus:border-purple-500 
                         focus:ring-4 focus:ring-purple-100 outline-none 
                         transition-all duration-200 bg-white"
              style={{
                borderColor: digit ? "#8b5cf6" : "#e5e7eb",
                boxShadow: digit ? "0 4px 6px -1px rgba(139, 92, 246, 0.1)" : "none"
              }}
            />
          </motion.div>
        ))}
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

      {/* VERIFY BUTTON */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onVerify}
        disabled={loading || !isOtpComplete}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
                   text-white py-3.5 rounded-xl font-medium 
                   shadow-lg shadow-purple-500/25 
                   hover:shadow-xl hover:shadow-purple-500/30 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Verify Code</span>
          </>
        )}
      </motion.button>

      {/* RESEND OPTION */}
      {onResend && (
        <div className="text-center">
          <button
            onClick={onResend}
            disabled={loading}
            className="text-sm text-purple-600 hover:text-purple-700 
                       font-medium inline-flex items-center gap-1 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Resend Code
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default OtpStep;