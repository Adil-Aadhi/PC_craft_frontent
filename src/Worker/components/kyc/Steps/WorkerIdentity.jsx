import { useState } from "react";
import api from "../../../../api/axios";
import { uploadImageToCloudinary } from "../../../../utils/cloudinaryUpload";
import { toast } from "react-toastify";

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
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB");
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
      toast.error("Failed to submit identity KYC");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-2xl mx-auto">
  {/* Header with Icon */}
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
    <div className="p-2.5 bg-blue-50 rounded-xl">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
    </div>
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Identity Verification</h2>
      <p className="text-sm text-gray-500 mt-0.5">Please upload valid government ID for verification</p>
    </div>
  </div>

  {/* Form Content */}
  <div className="space-y-6">
    {/* ID Type Selection */}
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        ID Type <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
        </div>
        <select
          name="id_type"
          value={formData.id_type}
          onChange={handleChange}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none bg-white ${
            errors.id_type ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
        >
          <option value="">Select ID type</option>
          <option value="aadhaar">Aadhaar Card</option>
          <option value="pan">PAN Card</option>
          <option value="dl">Driving License</option>
          <option value="voter">Voter ID</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {errors.id_type && (
        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.id_type}
        </p>
      )}
    </div>

    {/* ID Number with Format Hint */}
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        ID Number <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
        </div>
        <input
          type="text"
          name="id_number"
          value={formData.id_number}
          onChange={handleChange}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none ${
            errors.id_number ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          placeholder="Enter your ID number"
        />
      </div>
      {formData.id_type && formData.id_number && !errors.id_number && (
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formData.id_type === 'aadhaar' && 'Format: 1234 5678 9012'}
          {formData.id_type === 'pan' && 'Format: ABCDE1234F'}
          {formData.id_type === 'dl' && 'Format: MH12 20240012345'}
          {formData.id_type === 'voter' && 'Format: ABC1234567'}
        </p>
      )}
      {errors.id_number && (
        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.id_number}
        </p>
      )}
    </div>

    {/* ID Front Upload - Enhanced */}
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        ID Front Image <span className="text-red-500">*</span>
      </label>
      <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
        preview.front ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
      }`}>
        <input
          type="file"
          name="id_front"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          {preview.front ? (
            <div className="space-y-2">
              <img
                src={preview.front}
                alt="Front Preview"
                className="max-h-32 mx-auto rounded-lg shadow-sm"
              />
              <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Upload successful
              </p>
            </div>
          ) : (
            <div className="py-4">
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600">Click or drag to upload front side</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          )}
        </div>
      </div>
      {errors.id_front && (
        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.id_front}
        </p>
      )}
    </div>

    {/* ID Back Upload - Enhanced */}
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        ID Back Image <span className="text-gray-400 font-normal">(Optional)</span>
      </label>
      <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
        preview.back ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
      }`}>
        <input
          type="file"
          name="id_back"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          {preview.back ? (
            <div className="space-y-2">
              <img
                src={preview.back}
                alt="Back Preview"
                className="max-h-32 mx-auto rounded-lg shadow-sm"
              />
              <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Upload successful
              </p>
            </div>
          ) : (
            <div className="py-4">
              <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600">Click or drag to upload back side</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Requirements Checklist */}
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
      <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Document Requirements
      </h3>
      <ul className="text-xs text-blue-700 space-y-1">
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
          Clear, legible image without glare or blur
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
          All four corners of the document visible
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
          Document should not be expired
        </li>
      </ul>
    </div>

    {/* Submit Button */}
    <button
      onClick={handleNext}
      disabled={submitting}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
    >
      {submitting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Submitting...</span>
        </>
      ) : (
        <>
          <span>Continue</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </>
      )}
    </button>

    {/* Security Note */}
    <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1 mt-4">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Your documents are encrypted and securely stored
    </p>
  </div>
</div>
  );
};

export default IdentityVerification;2