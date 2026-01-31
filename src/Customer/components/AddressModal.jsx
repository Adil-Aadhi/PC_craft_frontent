import { useState } from "react";
import { FiX, FiPlus, FiCheck,FiTrash2 } from "react-icons/fi";
import { useUserAddress } from "../context/UserAddressContext";

const AddressModal = ({ onClose }) => {
  const { userAddress, setDefaultAddress, addAddress,deleteAddress } = useUserAddress();
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  const handleAdd = () => {
    addAddress(form);
    setShowAddForm(false);
    setForm({
      full_name: "",
      phone: "",
      address_line: "",
      city: "",
      state: "",
      pincode: "",
      is_default: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Addresses</h3>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
          {userAddress.map((addr) => (
            <div
              key={addr.id}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-medium">{addr.full_name}</p>
                <p className="text-sm text-slate-600">
                  {addr.address_line}, {addr.city}, {addr.state} –{" "}
                  {addr.pincode}
                </p>
                <p className="text-sm text-slate-500">{addr.phone}</p>

                {addr.is_default && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>

              {!addr.is_default && (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-sm px-3 py-1.5 border rounded-lg hover:bg-slate-100 flex items-center gap-1"
                >
                  <FiCheck /> Set Default
                </button>
              )}
               <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-sm px-2 py-1.5 border rounded-lg text-red-500 hover:bg-slate-100 flex items-center gap-1"
                >
                  <FiTrash2 />
                </button>
            </div>
          ))}
        </div>

        {/* Add Address */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 border rounded-lg hover:bg-slate-100"
          >
            <FiPlus /> Add New Address
          </button>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {[
                ["full_name", "Full Name"],
                ["phone", "Phone"],
                ["address_line", "Address Line", true],
                ["city", "City"],
                ["state", "State"],
                ["pincode", "Pincode"],
              ].map(([key, label, span]) => (
                <input
                  key={key}
                  placeholder={label}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  className={`input ${
                    span ? "md:col-span-2" : ""
                  }`}
                />
              ))}
            </div>

            <label className="flex items-center gap-2 mt-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) =>
                  setForm({ ...form, is_default: e.target.checked })
                }
              />
              Set as default
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Save Address
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
