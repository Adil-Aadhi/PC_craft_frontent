import { useState } from "react";
import api from "../../../../api/axios";
import { uploadImageToCloudinary } from "../../../../utils/cloudinaryUpload";

const IdentityVerification = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    id_type: "",
    id_number: "",
    id_front: null,
    id_back: null,
  });

  const [preview, setPreview] = useState({
    front: null,
    back: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Handle text input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔹 Handle file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;

    const file = files[0];

    // 🔒 validation
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    const localUrl = URL.createObjectURL(file);

    if (name === "id_front") {
      setPreview((prev) => ({ ...prev, front: localUrl }));
    }

    if (name === "id_back") {
      setPreview((prev) => ({ ...prev, back: localUrl }));
    }
  };

  // 🔹 Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.id_type) newErrors.id_type = "Select ID type";
    if (!formData.id_number) newErrors.id_number = "Enter ID number";
    if (!formData.id_front) newErrors.id_front = "Upload front image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit identity KYC
  const handleNext = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      // 🔹 Upload front image
      const frontUpload = await uploadImageToCloudinary(formData.id_front);

      // 🔹 Upload back image (optional)
      let backUpload = null;
      if (formData.id_back) {
        backUpload = await uploadImageToCloudinary(formData.id_back);
      }

      // 🔹 API payload
      const payload = {
        id_type: formData.id_type,
        id_number: formData.id_number,
        id_front_url: frontUpload.url,
        id_front_id: frontUpload.publicId,
        id_back_url: backUpload?.url || null,
        id_back_id: backUpload?.publicId || null,
      };

      // 🔹 Call DRF API
      await api.post("/workers/profile/worker-kyc/identity/", payload);

      // 🔹 Move to next step
      onComplete?.();

    } catch (err) {
      console.error("Identity KYC submit failed", err);
      alert("Failed to submit identity KYC");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Identity Verification</h2>

      {/* ID Type */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">ID Type *</label>
        <select
          name="id_type"
          value={formData.id_type}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select ID</option>
          <option value="aadhaar">Aadhaar</option>
          <option value="pan">PAN</option>
          <option value="dl">Driving License</option>
          <option value="voter">Voter ID</option>
        </select>
        {errors.id_type && (
          <p className="text-red-500 text-sm">{errors.id_type}</p>
        )}
      </div>

      {/* ID Number */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">ID Number *</label>
        <input
          type="text"
          name="id_number"
          value={formData.id_number}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          placeholder="Enter ID number"
        />
        {errors.id_number && (
          <p className="text-red-500 text-sm">{errors.id_number}</p>
        )}
      </div>

      {/* Front Upload */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">ID Front Image *</label>
        <input
          type="file"
          name="id_front"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {errors.id_front && (
          <p className="text-red-500 text-sm">{errors.id_front}</p>
        )}
        {preview.front && (
          <img
            src={preview.front}
            alt="Front Preview"
            className="mt-2 h-32 rounded-lg border"
          />
        )}
      </div>

      {/* Back Upload */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          ID Back Image (Optional)
        </label>
        <input
          type="file"
          name="id_back"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {preview.back && (
          <img
            src={preview.back}
            alt="Back Preview"
            className="mt-2 h-32 rounded-lg border"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleNext}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {submitting ? "Submitting..." : "Continue"}
      </button>
    </div>
  );
};

export default IdentityVerification;2