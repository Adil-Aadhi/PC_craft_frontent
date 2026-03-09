import {
  FiBriefcase,
  FiMessageCircle,
  FiBell,
  FiUser,

} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">
        Quick Actions
      </h2>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <ActionCard
          icon={<FiBriefcase className="text-blue-500" />}
          label="Projects"
          path="/worker/projects"
          navigate={navigate}
        />

        <ActionCard
          icon={<FiMessageCircle className="text-green-500" />}
          label="Messages"
          path="/worker/chat"
          navigate={navigate}
        />

        <ActionCard
          icon={<FiBell className="text-purple-500" />}
          label="Notifications"
          path="/worker/notifications"
          navigate={navigate}
        />

        <ActionCard
          icon={<FiUser className="text-yellow-500" />}
          label="Profile"
          path="/worker/profile"
          navigate={navigate}
        />
      </div>
    </div>
  );
}

/* ---------------- Action Card ---------------- */

const ActionCard = ({ icon, label, path, navigate }) => (
  <button
    onClick={() => navigate(path)}
    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all"
  >
    <div className="p-3 bg-gray-50 rounded-lg mb-2">
      {icon}
    </div>

    <span className="text-sm font-medium text-gray-700">
      {label}
    </span>
  </button>
);



