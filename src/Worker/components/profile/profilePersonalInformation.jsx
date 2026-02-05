import { FiEdit2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useWorkerPersonalInfo } from "../../context/workerProfileInfoContext";

const WorkerPersonalInfo = () => {
  const {
    personalInfo,
    fetchPersonalInfo,
    updatePersonalInfo,
    loading,
  } = useWorkerPersonalInfo();

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
  });

  // 🔹 Load data once
  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  // 🔹 Sync form with data
  useEffect(() => {
    if (personalInfo) {
      setFormData({
        full_name: personalInfo.full_name || "",
        phone: personalInfo.phone || "",
        date_of_birth: personalInfo.date_of_birth || "",
      });
    }
  }, [personalInfo]);

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );

    const success = await updatePersonalInfo(payload);
    if (success) {
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: personalInfo?.full_name || "",
      phone: personalInfo?.phone || "",
      date_of_birth: personalInfo?.date_of_birth || "",
    });
    setErrors({});
  };

  const inputClass = (value) =>
    `w-full mt-1 px-4 py-3 rounded-lg border bg-slate-100 ${
      value ? "text-slate-700" : "text-slate-400 italic"
    }`;

  if (loading && !personalInfo) {
    return <p className="text-sm text-slate-500">Loading profile...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Personal Information
        </h2>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <FiEdit2 />
            Edit
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="text-sm text-slate-600">Full Name</label>
          <input
            disabled={!isEditing}
            value={
              isEditing
                ? formData.full_name
                : personalInfo?.full_name || "Not provided"
            }
            onChange={(e) =>
              setFormData((p) => ({ ...p, full_name: e.target.value }))
            }
            className={inputClass(formData.full_name)}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.full_name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-slate-600">Phone</label>
          <input
            disabled={!isEditing}
            value={
              isEditing
                ? formData.phone
                : personalInfo?.phone || "Not provided"
            }
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                phone: e.target.value.replace(/\D/g, ""),
              }))
            }
            maxLength={10}
            className={inputClass(formData.phone)}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm text-slate-600">Date of Birth</label>
          <input
            type="date"
            disabled={!isEditing}
            value={formData.date_of_birth}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                date_of_birth: e.target.value,
              }))
            }
            className={inputClass(formData.date_of_birth)}
          />
          {!formData.date_of_birth && !isEditing && (
            <p className="text-xs text-slate-400 italic mt-1">
              Not provided
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {isEditing && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkerPersonalInfo;
