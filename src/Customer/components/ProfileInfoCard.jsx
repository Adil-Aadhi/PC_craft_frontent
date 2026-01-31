import { FiEdit2 } from "react-icons/fi";
import { useProfile } from "../context/ProfileContext";
import { useEffect, useState } from "react";

const ProfileInfoCard = () => {
  const { profile,UpdateProfileInfo,fetchProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
  });

  const validate = () => {
  const newErrors = {};

  // Phone – exactly 10 digits
  if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = "Phone number must be exactly 10 digits";
  }
  if (!formData.full_name || !formData.full_name.trim()) {
  newErrors.full_name = "Full name is required";
}

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // initialize form state when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        date_of_birth: profile.date_of_birth || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      date_of_birth: profile?.date_of_birth || "",
    });
  };

  const HandleSave=async ()=>{
    if (!validate()) return;

    const payload = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
      );
    const success = await UpdateProfileInfo(payload)
    if (success) {
      await fetchProfile();
      setIsEditing(false);
      setErrors({});
      
      
  }
}

  const getInputClass = (value) =>
    `w-full mt-1 px-4 py-3 rounded-lg border bg-slate-100 ${
      value ? "text-slate-700" : "text-slate-400 italic"
    }`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Profile Information
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
            name="full_name"
            disabled={!isEditing}
            value={
              isEditing
                ? formData.full_name
                : profile?.full_name || "Not provided"
            }
            onChange={handleChange}
            className={getInputClass(formData.full_name)}
            placeholder={isEditing ? "Enter full name" : ""}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.full_name}
            </p>
            )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-slate-600">Phone Number</label>
          <input
              name="phone"
              type="text"
              inputMode="numeric"
              maxLength={10}
              disabled={!isEditing}
              value={
                isEditing
                  ? formData.phone
                  : profile?.phone || "Not provided"
              }
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({
                  ...prev,
                  phone: onlyNumbers,
                }));
              }}
              className={`${getInputClass(formData.phone)} ${
                errors.phone ? "border-red-500" : ""
              }`}
              placeholder={isEditing ? "Enter phone number" : ""}
            />


          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm text-slate-600">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            disabled={!isEditing}
            value={formData.date_of_birth}
            onChange={handleChange}
            className={getInputClass(formData.date_of_birth)}
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
            className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold"
            onClick={HandleSave}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCard
