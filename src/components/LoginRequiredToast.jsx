import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaLock } from "react-icons/fa";

const LoginRequiredToast = ({ toastId }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    toast.dismiss(toastId); // ✅ close ONLY this toast
    navigate("/login");
  };

  const handleClose = () => {
    toast.dismiss(toastId); // ✅ close ONLY this toast
  };

  return (
    <div className="flex items-start gap-4 p-4 w-full">
      {/* Icon */}
      <div className="flex-shrink-0">
        <div
          className="
            w-12 h-12
            rounded-xl
            flex items-center justify-center
            bg-gradient-to-br from-blue-500/20 to-purple-500/20
            border border-white/10
            backdrop-blur-md
          "
        >
          <FaLock className="w-5 h-5 text-red-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-base font-semibold text-white">
            Authentication Required
          </h4>
          
        </div>

        <p className="text-sm text-gray-300 mb-4">
          This feature requires you to be signed in to your account.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleLogin}
            className="
              flex items-center justify-center gap-2
              px-4 py-2.5
              rounded-xl
              text-sm font-semibold
              bg-gradient-to-r from-blue-600 to-blue-500
              hover:from-blue-500 hover:to-blue-400
              text-white
              shadow-lg shadow-blue-500/25
              hover:shadow-blue-500/40
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            <FaSignInAlt className="w-4 h-4" />
            Sign In Now
          </button>

          <button
            onClick={handleClose}
            className="
              px-4 py-2.5
              rounded-xl
              text-sm font-medium
              bg-white/5
              hover:bg-white/10
              border border-white/10
              text-gray-300
              transition-all duration-200
            "
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredToast;
