import { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import { useUserAddress } from "../context/UserAddressContext";

const EMPTY_FORM = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  is_default: false,
};

const FORM_FIELDS = [
  { key: "full_name", label: "Full Name", span: false },
  { key: "phone", label: "Phone", span: false },
  { key: "address_line", label: "Address Line", span: true },
  { key: "city", label: "City", span: false },
  { key: "state", label: "State", span: false },
  { key: "pincode", label: "Pincode", span: false },
];

const AddAddressModal = ({ onClose }) => {
  const { addAddress } = useUserAddress();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Only allow digits for phone and pincode
    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "pincode") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (form.phone.length !== 10) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!form.address_line.trim()) {
      newErrors.address_line = "Address is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!form.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (form.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (saving) return;
    
    if (!validate()) return;

    try {
      setSaving(true);
      await addAddress(form);
      onClose();
    } catch (error) {
      console.error("Failed to add address:", error);
      // Optionally show error to user
    } finally {
      setSaving(false);
    }
  };

  const getInputMode = (key) => {
    return key === "phone" || key === "pincode" ? "numeric" : "text";
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Address</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {FORM_FIELDS.map(({ key, label, span }) => (
            <div key={key} className={span ? "md:col-span-2" : ""}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                id={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                inputMode={getInputMode(key)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow ${
                  errors[key] 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300"
                }`}
              />
              {errors[key] && (
                <p className="text-sm text-red-600 mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Default Checkbox */}
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
            className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
          />
          Set as default address
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiSave size={18} />
            {saving ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;