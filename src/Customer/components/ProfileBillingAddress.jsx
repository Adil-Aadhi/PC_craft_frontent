import { useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { useUserAddress } from "../context/UserAddressContext";
import AddressModal from "./AddressModal";

const BillingAddressView = () => {
  const { userAddress, loading } = useUserAddress();
  const [showModal, setShowModal] = useState(false);

  const defaultAddress =
    userAddress?.find((a) => a.is_default) || userAddress?.[0] || null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiMapPin className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold">Billing Address</h3>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-slate-50 text-sm transition-colors"
        >
          Manage Addresses
        </button>
      </div>

      {/* Address Content */}
      {!defaultAddress ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-600 mb-4">
            No billing address found. Please add one.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Full Name</p>
            <p className="font-medium text-slate-800">
              {defaultAddress.full_name}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Phone</p>
            <p className="font-medium text-slate-800">
              {defaultAddress.phone}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-slate-500 mb-1">Address</p>
            <p className="font-medium text-slate-800">
              {defaultAddress.address_line}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">City</p>
            <p className="font-medium text-slate-800">
              {defaultAddress.city}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">State</p>
            <p className="font-medium text-slate-800">
              {defaultAddress.state}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Pincode</p>
            <p className="font-medium text-slate-800">
              {defaultAddress.pincode}
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && <AddressModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default BillingAddressView;