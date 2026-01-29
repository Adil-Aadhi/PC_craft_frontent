import { FiMail } from "react-icons/fi";

const ProfileInfoCard = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Profile Information
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <img
          src="https://via.placeholder.com/120"
          className="w-28 h-28 rounded-full object-cover border"
          alt="Profile"
        />
        <div>
          <button
            disabled
            className="
              px-4 py-2
              rounded-lg
              bg-blue-600
              text-white
              opacity-60
              cursor-not-allowed
            "
          >
            Change Photo
          </button>
          <p className="text-xs text-slate-500 mt-2">
            PNG or JPG up to 2MB
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="text-sm text-slate-600">Full Name</label>
          <input
            value={user?.full_name || ""}
            disabled
            className="w-full mt-1 px-4 py-3 rounded-lg border bg-slate-100"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Phone Number</label>
          <input
            value={user?.phone || ""}
            disabled
            className="w-full mt-1 px-4 py-3 rounded-lg border bg-slate-100"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Date of Birth</label>
          <input
            type="date"
            value={user?.date_of_birth || ""}
            disabled
            className="w-full mt-1 px-4 py-3 rounded-lg border bg-slate-100"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Username</label>
          <input
            value={user?.username || ""}
            disabled
            className="w-full mt-1 px-4 py-3 rounded-lg border bg-slate-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">Email Address</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-100 text-slate-700 mt-1">
            <FiMail />
            {user?.email}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          disabled
          className="
            px-6 py-3
            rounded-lg
            bg-blue-600
            text-white
            font-semibold
            opacity-60
            cursor-not-allowed
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
