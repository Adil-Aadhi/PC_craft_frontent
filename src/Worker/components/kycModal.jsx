import { FiAlertCircle, FiArrowRight, FiX, FiShield, FiCheckCircle } from "react-icons/fi";

const KycModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal with slide-in animation */}
      <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              >
                <FiX className="text-gray-500 w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FiShield className="text-white w-7 h-7" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                    <FiAlertCircle className="text-orange-500 w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  KYC Verification Required
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Unlock full platform access
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Benefits list */}
            <div className="mb-8">
              <p className="text-gray-700 mb-4">
                Complete your KYC verification to access premium features and ensure secure transactions.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Enhanced security for your account</span>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Access to all platform features</span>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Higher transaction limits</span>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Verification progress</span>
                <span className="font-semibold text-blue-600">20%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: '20%' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="
                  flex-1 px-6 py-3.5
                  border-2 border-gray-300
                  text-gray-700 font-medium
                  rounded-xl
                  hover:bg-gray-50
                  hover:border-gray-400
                  active:bg-gray-100
                  transition-all duration-200
                  transform hover:-translate-y-0.5
                "
              >
                Remind me later
              </button>

              <button
                onClick={() => {
                  onClose();
                  // later: navigate("/worker/kyc");
                }}
                className="
                  flex-1 px-6 py-3.5
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  text-white font-medium
                  rounded-xl
                  hover:from-blue-700 hover:to-indigo-700
                  active:scale-[0.98]
                  transition-all duration-200
                  transform hover:-translate-y-0.5
                  shadow-lg hover:shadow-xl
                  flex items-center justify-center gap-2
                "
              >
                <span>Start Verification</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Footer note */}
            <p className="text-xs text-gray-500 text-center mt-6">
              Takes 2-3 minutes • Your data is 256-bit encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycModal;