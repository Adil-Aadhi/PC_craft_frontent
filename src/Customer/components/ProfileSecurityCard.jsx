import { FiShield, FiLock } from "react-icons/fi";

const SecurityCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FiShield /> Security
      </h2>

      <button
        disabled
        className="
          px-4 py-3
          rounded-lg
          bg-slate-900
          text-white
          opacity-60
          cursor-not-allowed
        "
      >
        <FiLock className="inline mr-2" />
        Change Password
      </button>
    </div>
  );
};

export default SecurityCard;
