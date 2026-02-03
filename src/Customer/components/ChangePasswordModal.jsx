import { useState } from "react";
import LoadingSpinner from "../context/LoadingSpinner";

const ChangePasswordModal = ({ onClose, onSubmit, loading, error }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Change Password
        </h3>

        <input
          type="password"
          placeholder="Old password"
          className="w-full border rounded-lg px-3 py-2"
          onChange={(e) => setOldPass(e.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          className="w-full border rounded-lg px-3 py-2 mt-3"
          onChange={(e) => setNewPass(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full border rounded-lg px-3 py-2 mt-3"
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={() =>
              onSubmit(oldPass, newPass, confirmPass)
            }
            className="px-4 py-2 rounded-lg bg-slate-900 text-white"
          >
            {loading ? <LoadingSpinner/> : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
