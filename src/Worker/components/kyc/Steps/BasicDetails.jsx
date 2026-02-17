import { useState } from "react";
import { useWorkerPersonalInfo } from "../../../context/workerProfileInfoContext";

const BasicDetails = ({ onComplete }) => {
  const { updatePersonalInfo } = useWorkerPersonalInfo();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (form.full_name.length < 3) {
      newErrors.full_name = "Full name must be at least 3 characters";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (new Date(form.dob) >= new Date()) {
      newErrors.dob = "Date of birth must be in the past";
    }

    if (!form.gender) {
      newErrors.gender = "Please select gender";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const success = await updatePersonalInfo(form);

    if (success) {
      onComplete()
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className="input"
          placeholder="Enter your full name"
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm">{errors.full_name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                    if (value.length <= 10) {
                    setForm({ ...form, phone: value });
                    }
                }}
                className={`input ${errors.phone ? "border-red-500" : ""}`}
                placeholder="10-digit mobile number"
                />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone}</p>
        )}
      </div>

      {/* DOB */}
      <div>
        <label className="block text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="input"
        />
        {errors.dob && (
          <p className="text-red-500 text-sm">{errors.dob}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        Save & Continue
      </button>
    </form>
  );
};

export default BasicDetails;
