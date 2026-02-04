import {
  FiFileText,
  FiCalendar,
  FiPlus,
  FiSettings,
} from "react-icons/fi";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">
        Quick Actions
      </h2>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <ActionCard
          icon={<FiFileText className="text-blue-500" />}
          label="New Quote"
        />
        <ActionCard
          icon={<FiCalendar className="text-green-500" />}
          label="Schedule Work"
        />
        <ActionCard
          icon={<FiPlus className="text-purple-500" />}
          label="New Project"
        />
        <ActionCard
          icon={<FiSettings className="text-yellow-500" />}
          label="Settings"
        />
      </div>
    </div>
  );
}

/* ---------------- Action Card ---------------- */

const ActionCard = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all">
    <div className="p-3 bg-gray-50 rounded-lg mb-2">
      {icon}
    </div>
    <span className="text-sm font-medium text-gray-700">
      {label}
    </span>
  </button>
);
