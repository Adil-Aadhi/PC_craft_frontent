import { useState } from "react";
import api from "../../../../api/axios";

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
      alert("Failed to save worker details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">
          Short Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className={`input ${errors.description ? "border-red-500" : ""}`}
          placeholder="Briefly describe yourself"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium">
          Skills (comma separated)
        </label>
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          className={`input ${errors.skills ? "border-red-500" : ""}`}
          placeholder="PC building, troubleshooting, cable management"
        />
        {errors.skills && (
          <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
        )}
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium">
          Experience (years)
        </label>
        <input
          type="number"
          name="experience_years"
          value={form.experience_years}
          onChange={handleChange}
          min="0"
          className={`input ${errors.experience_years ? "border-red-500" : ""}`}
          placeholder="e.g. 3"
        />
        {errors.experience_years && (
          <p className="text-red-500 text-xs mt-1">
            {errors.experience_years}
          </p>
        )}
      </div>

      {/* Hourly Rate */}
      <div>
        <label className="block text-sm font-medium">
          Hourly Rate (₹)
        </label>
        <input
          type="number"
          name="hourly_rate"
          value={form.hourly_rate}
          onChange={handleChange}
          min="1"
          step="0.01"
          className={`input ${errors.hourly_rate ? "border-red-500" : ""}`}
          placeholder="e.g. 500"
        />
        {errors.hourly_rate && (
          <p className="text-red-500 text-xs mt-1">
            {errors.hourly_rate}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
};

export default WorkerDetails;