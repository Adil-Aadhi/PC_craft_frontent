import { FiTrash2 } from "react-icons/fi";

const DangerZoneCard = () => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-red-600 mb-3">
        Danger Zone
      </h2>

      <button
        disabled
        className="
          flex items-center gap-2
          px-4 py-3
          rounded-lg
          bg-red-600
          text-white
          opacity-60
          cursor-not-allowed
        "
      >
        <FiTrash2 /> Delete Account
      </button>
    </div>
  );
};

export default DangerZoneCard;
