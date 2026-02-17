import { useState } from "react";
import api from "../../../../api/axios";

const UpiDetails = ({ onComplete }) => {
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

      await api.post("/workers/profile/kyc/payout/", { 
        upi_id: upiId,
      });

      // 🔹 Move to next step
      onComplete?.();

    } catch (err) {
      console.error("UPI save failed", err);
      setError("Failed to save UPI ID");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Payout Details (UPI)</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">UPI ID *</label>
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value.trim())}
          placeholder="example@upi"
          className="w-full border rounded-lg p-2"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {submitting ? "Saving..." : "Continue"}
      </button>
    </div>
  );
};

export default UpiDetails;