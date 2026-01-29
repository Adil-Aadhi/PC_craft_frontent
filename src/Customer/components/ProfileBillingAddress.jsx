import { useState } from "react";
import { FiMapPin, FiSave } from "react-icons/fi";

const BillingAddressCard = () => {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // later → API call
    console.log("Billing Address:", address);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FiMapPin className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Billing Address
        </h3>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="input"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          className="input"
        />

        <input
          name="addressLine"
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

        <input
          name="country"
          value={address.country}
          disabled
          className="input bg-slate-100 cursor-not-allowed"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          <FiSave />
          Save Address
        </button>
      </div>
    </div>
  );
};

export default BillingAddressCard;
