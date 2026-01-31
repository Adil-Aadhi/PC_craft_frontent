import { useEffect, useState } from "react";
import { FiMapPin, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { useUserAddress } from "../context/UserAddressContext";
import AddressModal from "./AddressModal";

/* ✅ Safe empty form (NEVER null) */
const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

const BillingAddressCard = () => {
  const { userAddress, loading, updateAddress } = useUserAddress();

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});


  const defaultAddress =
    userAddress?.find((a) => a.is_default) || userAddress?.[0] || null;

  const [form, setForm] = useState(EMPTY_FORM);
  const [originalForm, setOriginalForm] = useState(EMPTY_FORM);

  /* ✅ Sync default address → form safely */
  useEffect(() => {
    if (!defaultAddress) {
      setForm(EMPTY_FORM);
      setOriginalForm(EMPTY_FORM);
      return;
    }

    const data = {
      fullName: defaultAddress.full_name || "",
      phone: defaultAddress.phone || "",
      addressLine: defaultAddress.address_line || "",
      city: defaultAddress.city || "",
      state: defaultAddress.state || "",
      pincode: defaultAddress.pincode || "",
    };

    setForm(data);
    setOriginalForm(data);
  }, [defaultAddress])


  const handleSave = async  () => {
    if (!defaultAddress) return;

     const isValid = validate();
      if (!isValid) return;

    await  updateAddress(defaultAddress.id, {
      full_name: form.fullName,
      phone: form.phone,
      address_line: form.addressLine,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(originalForm || EMPTY_FORM);
    setIsEditing(false);
  };

  const validate = () => {
    const newErrors = {};

    // Phone: exactly 10 digits
    if (!form.phone || !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Pincode: exactly 6 digits
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ✅ Loading state */
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        Loading address...
      </div>
    );
  }

  /* ✅ No address state (important) */
  if (!defaultAddress) {
    return (
      <div className="bg-white rounded-2xl shadow border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiMapPin className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Billing Address</h3>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100 text-sm"
          >
            Manage Addresses
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          No billing address found. Please add one from{" "}
          <b>Manage Addresses</b>.
        </p>

        {showModal && (
          <AddressModal onClose={() => setShowModal(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiMapPin className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Billing Address</h3>
        </div>

        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg border hover:bg-slate-100"
              title="Edit"
            >
              <FiEdit2 />
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100 text-sm"
          >
            Manage Addresses
          </button>
        </div>
      </div>

      {/* Address Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["fullName", "Full Name"],
          ["phone", "Phone"],
          ["addressLine", "Address Line", true],
          ["city", "City"],
          ["state", "State"],
          ["pincode", "Pincode"],
        ].map(([key, label, span]) => (
          <div
              key={key}
              className={span ? "md:col-span-2" : ""}
            >
          <input
            key={key}
            value={form[key]}
            disabled={!isEditing}
            onChange={(e) => {
                let value = e.target.value;

                if (key === "phone") {
                  value = value.replace(/\D/g, "").slice(0, 10);
                }

                if (key === "pincode") {
                  value = value.replace(/\D/g, "").slice(0, 6);
                }

                setForm({ ...form, [key]: value });

                // clear error while typing
                setErrors((prev) => ({ ...prev, [key]: "" }));
              }}
            placeholder={label}
            className={`input ${
              span ? "md:col-span-2" : ""
            } ${!isEditing ? "bg-slate-100 cursor-not-allowed" : ""}`}
          />
                {errors[key] && (
            <p className="text-xs text-red-500 mt-1">
              {errors[key]}
            </p>
          )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {isEditing && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border hover:bg-slate-100"
          >
            <FiX /> Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!form.phone || !form.pincode}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <FiSave /> Save Changes
          </button>
        </div>
      )}

      {showModal && (
        <AddressModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default BillingAddressCard;
