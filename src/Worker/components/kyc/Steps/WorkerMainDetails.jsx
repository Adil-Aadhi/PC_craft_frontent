import { useState } from "react";
import api from "../../../../api/axios";
import { toast } from "react-toastify";

const WorkerDetails = ({ onComplete }) => {
  const [form, setForm] = useState({
    description: "",
    skills: "",
    experience_years: "",
    hourly_rate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!form.skills.trim()) {
      newErrors.skills = "Skills are required";
    }

    if (!form.experience_years) {
      newErrors.experience_years = "Experience is required";
    } else if (form.experience_years < 0) {
      newErrors.experience_years = "Invalid experience";
    }

    if (!form.hourly_rate) {
      newErrors.hourly_rate = "Hourly rate is required";
    } else if (Number(form.hourly_rate) <= 0) {
      newErrors.hourly_rate = "Hourly rate must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      await api.patch("/workers/profile/worker-details/", {
        description: form.description,
        skills: form.skills,
        experience_years: Number(form.experience_years),
        hourly_rate: Number(form.hourly_rate),
      });

      // 🔥 move to next step only after save
      onComplete();
    } catch (err) {
      console.error("Worker details update failed", err);
      toast.error("Failed to save worker details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="px-6 py-4 border-b mb-3 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Professional Details</h2>
          </div>
        </div>
      </div>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description - Enhanced Textarea */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Short Description <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Briefly describe yourself, your experience, and what makes you unique..."
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description}
          </p>
        )}
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Minimum 50 characters recommended for better visibility
        </p>
      </div>

      {/* Skills - Enhanced with chips preview */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Skills <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none ${
              errors.skills ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="e.g., PC building, troubleshooting, cable management"
          />
        </div>
        
        {/* Skills Preview - Shows when skills are entered */}
        {form.skills && !errors.skills && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.skills.split(',').map((skill, index) => {
              const trimmedSkill = skill.trim();
              return trimmedSkill && (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {trimmedSkill}
                </span>
              );
            })}
          </div>
        )}
        
        {errors.skills && (
          <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.skills}
          </p>
        )}
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Separate skills with commas
        </p>
      </div>

      {/* Experience and Rate - Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Experience */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Experience <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="number"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              min="0"
              step="0.5"
              className={`w-full pl-10 pr-12 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none ${
                errors.experience_years ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">years</span>
            </div>
          </div>
          {errors.experience_years && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.experience_years}
            </p>
          )}
        </div>

        {/* Hourly Rate */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Hourly Rate <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm font-medium">₹</span>
            </div>
            <input
              type="number"
              name="hourly_rate"
              value={form.hourly_rate}
              onChange={handleChange}
              min="1"
              step="1"
              className={`w-full pl-8 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none ${
                errors.hourly_rate ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="500"
            />
          </div>
          {errors.hourly_rate && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.hourly_rate}
            </p>
          )}
          {form.hourly_rate && !errors.hourly_rate && (
            <p className="text-green-600 text-xs flex items-center gap-1 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ₹{form.hourly_rate}/hour
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <span>Save & Continue</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      {/* Form Progress Indicator */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${form.description ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div className={`w-2 h-2 rounded-full ${form.skills ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div className={`w-2 h-2 rounded-full ${form.experience_years ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div className={`w-2 h-2 rounded-full ${form.hourly_rate ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
        <p className="text-xs text-gray-500">
          Complete all fields to continue
        </p>
      </div>
    </form>
    </div>
  );
};

export default WorkerDetails;