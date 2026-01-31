import { useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import { useUserAddress } from "../context/UserAddressContext";

const AddAddressModal = ({ onClose }) => {
  const { addAddress } = useUserAddress();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    addAddress(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Address</h3>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
            className="input"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="input"
          />
          <input
            name="address_line"
            placeholder="Address Line"
            onChange={handleChange}
            className="input md:col-span-2"
          />
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="input"
          />
          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="input"
          />
          <input
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Default checkbox */}
        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
          />
          Set as default address
        </label>

        {/* Save */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-900 text-white"
          >
            <FiSave /> Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
