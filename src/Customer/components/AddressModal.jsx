import { useState } from "react";
import { FiX, FiPlus, FiCheck, FiTrash2, FiEdit2 } from "react-icons/fi";
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

const AddressModal = ({ onClose }) => {
  const { userAddress, setDefaultAddress, addAddress, deleteAddress } = useUserAddress();
  const [showAddForm, setShowAddForm] = useState(false);
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
      newErrors.full_name = "Required";
    }

    if (!form.phone) {
      newErrors.phone = "Required";
    } else if (form.phone.length !== 10) {
      newErrors.phone = "Must be 10 digits";
    }

    if (!form.address_line.trim()) {
      newErrors.address_line = "Required";
    }

    if (!form.city.trim()) {
      newErrors.city = "Required";
    }

    if (!form.state.trim()) {
      newErrors.state = "Required";
    }

    if (!form.pincode) {
      newErrors.pincode = "Required";
    } else if (form.pincode.length !== 6) {
      newErrors.pincode = "Must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (saving) return;

    if (!validate()) return;

    try {
      setSaving(true);
      const success = await addAddress(form);
      if (success) {
        setShowAddForm(false);
        setForm(EMPTY_FORM);
        setErrors({});
      }
    } catch (error) {
      console.error("Failed to add address:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const getInputMode = (key) => {
    return key === "phone" || key === "pincode" ? "numeric" : "text";
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Your Addresses</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-3 mb-6">
          {userAddress.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No addresses found. Add your first address below.
            </p>
          ) : (
            userAddress.map((addr) => (
              <div
                key={addr.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{addr.full_name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {addr.address_line}, {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>

                    {addr.is_default && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        ✓ Default Address
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!addr.is_default && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
                        title="Set as default"
                      >
                        <FiCheck size={16} /> Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-sm px-2 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1 transition-colors"
                      title="Delete address"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Address Section */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full justify-center font-medium"
          >
            <FiPlus size={18} /> Add New Address
          </button>
        ) : (
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4">Add New Address</h4>
            
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
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer mb-4">
              <input
                type="checkbox"
                name="is_default"
                checked={form.is_default}
                onChange={handleChange}
                className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
              />
              Set as default address
            </label>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressModal;