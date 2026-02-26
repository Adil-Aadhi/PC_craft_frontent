import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, X, Loader2,RefreshCw } from "lucide-react";
import api from "../api/axios";
import ResetPasswordStep from "../components/ResetPasswordStep";
import OtpStep from "../components/OtpStep";
import EmailStep from "../components/EmailStep";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  //////////////////// SEND OTP ////////////////////
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) return setError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email");

    try {
      setLoading(true);
      await api.post("auth/forgetpassword/", { email });
      setMessage(" OTP sent successfully to your email");
      setStep(2);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  //////////////////// VERIFY OTP ////////////////////
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return setError("Please enter complete 6-digit OTP");

    try {
      setLoading(true);
      await api.post("auth/verifyotp/", { email, otp: otpCode });
      setMessage("✓ OTP verified successfully!");
      setStep(3);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP. Please try again");
    } finally {
      setLoading(false);
    }
  };

  //////////////////// RESET PASSWORD ////////////////////
  const handleResetPassword = async () => {
    if (!password || !confirmPassword)
      return setError("All fields are required");

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    if (password.length < 8)
      return setError("Password must be at least 8 characters long");

    try {
      setLoading(true);
      await api.post("auth/resetpassword/", { email, password });
      
      // Show success message before redirect
      setMessage(" Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  //////////////////// RESEND TIMER ////////////////////
  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  //////////////////// ANIMATION VARIANTS ////////////////////
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const stepVariants = {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { x: -30, opacity: 0, transition: { duration: 0.3 } }
  };


  //////////////////// UI ////////////////////
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="relative w-full max-w-md"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-20 -z-10 transform rotate-3"></div>
        
        <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate("/login")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                      s === step 
                        ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                        : s < step 
                        ? "bg-green-400" 
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={() => navigate("/login")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>


          {/* Message/Error notifications */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">{message}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2"
              >
                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <EmailStep
                  email={email}
                  setEmail={setEmail}
                  onSend={handleSendOtp}
                  loading={loading}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <OtpStep
                  otp={otp}
                  setOtp={setOtp}
                  onVerify={handleVerifyOtp}
                //   onResend={handleSendOtp}
                  loading={loading}
                  email={email}
                />
                
                {/* Resend OTP option */}
                <div className="mt-4 text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend code in {resendTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      className="text-sm text-purple-600 hover:text-purple-700 
                       font-medium inline-flex items-center gap-1 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
                    >
                    <RefreshCw className="w-4 h-4" />
                      Resend OTP
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ResetPasswordStep
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  onReset={handleResetPassword}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer with login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Loading overlay */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center"
            >
              <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-gray-700 font-medium">Processing...</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;