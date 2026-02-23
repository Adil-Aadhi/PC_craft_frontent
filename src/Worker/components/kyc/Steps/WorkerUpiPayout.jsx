import { useState } from "react";
import api from "../../../../api/axios";

const UpiDetails = ({ onComplete,setKycSuccess,UpdateKycStatus }) => {
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  

  // 🔹 Basic UPI validation
  const validateUpi = (value) => {
    if (!value) return "UPI ID is required";
    if (!value.includes("@")) return "Invalid UPI ID format";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateUpi(upiId);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res=await api.post("/workers/profile/kyc/payout/", { 
                    upi_id: upiId,
                });

      // 🔹 Move to next step
      onComplete?.();
      await UpdateKycStatus();

      if (res.status === 200) {
            setKycSuccess(true);
        }

    } catch (err) {
      console.error("UPI save failed", err);
      setError("Failed to save UPI ID");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-2xl mx-auto">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Payout Details</h2>
      <p className="text-sm text-gray-500 mt-0.5">
        Add your UPI ID to receive payments
      </p>
    </div>

    <span className="text-xs font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
      Secure & Encrypted
    </span>
  </div>

  {/* UPI Input */}
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      UPI ID <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value.trim())}
        placeholder="e.g., yourname@okhdfcbank"
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-gray-700 ${
          error ? "border-red-300 bg-red-50" : "border-gray-200"
        }`}
      />

      {/* Valid tick */}
      {upiId && !error && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 
              1 0 00-1.414-1.414L9 10.586 7.707 
              9.293a1 1 0 00-1.414 1.414l2 
              2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>

    {/* Error */}
    {error && (
      <p className="text-red-500 text-sm mt-2">{error}</p>
    )}

    {/* Helper */}
    {!error && (
      <p className="text-xs text-gray-500 mt-2">
        Format: <span className="font-medium">name@provider</span> (no spaces)
      </p>
    )}
  </div>

  {/* Supported Apps */}
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-6">
    <p className="text-sm font-medium text-gray-700 mb-2">
      Supported UPI Apps
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
      <span>Google Pay</span>
      <span>PhonePe</span>
      <span>Paytm</span>
      <span>BHIM</span>
    </div>

    <p className="text-xs text-gray-400 mt-3">
      Your UPI ID works across all these apps
    </p>
  </div>

  {/* Submit */}
  <button
    onClick={handleSubmit}
    disabled={submitting}
    className="w-full bg-green-600 text-white py-3.5 px-4 rounded-xl font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
  >
    {submitting ? (
      <>
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 
            0 0 5.373 0 12h4zm2 
            5.291A7.962 7.962 0 014 
            12H0c0 3.042 1.135 5.824 
            3 7.938l3-2.647z"
          />
        </svg>
        Saving UPI ID...
      </>
    ) : (
      "Verify & Continue"
    )}
  </button>

  {/* Security note */}
  <p className="text-xs text-gray-400 text-center mt-3">
    Your UPI details are encrypted and never shared
  </p>

 
</div>

  );
};

export default UpiDetails;