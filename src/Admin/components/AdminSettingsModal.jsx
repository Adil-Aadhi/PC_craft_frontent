import { useState } from "react";
import { X, Shield, Settings } from "lucide-react";
import SecurityCard from "../../Customer/components/ProfileSecurityCard";

export default function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("security");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Admin Settings</h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>


        {/* Tabs */}
        <div className="flex border-b">

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === "security"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Shield size={16} />
            Security
          </button>

          <button
            onClick={() => setActiveTab("other")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === "other"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings size={16} />
            Other Settings
          </button>

        </div>


        {/* Content */}
        <div className="p-6 min-h-[250px]">

          {activeTab === "security" && (
            <div>
              {/* Your Change Password Component */}
              <SecurityCard />
            </div>
          )}

          {activeTab === "other" && (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
              🚧 More settings coming soon...
            </div>
          )}

        </div>

      </div>
    </div>
  );
}