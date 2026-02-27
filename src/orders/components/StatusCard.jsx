import {
  ClockIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const StatusCard = ({ title, count, color = "gray", icon }) => {
  const colorClasses = {
    yellow:
      "bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 backdrop-blur-md",
    blue:
      "bg-blue-500/10 border border-blue-500/30 text-blue-300 backdrop-blur-md",
    green:
      "bg-green-500/10 border border-green-500/30 text-green-300 backdrop-blur-md",
    red:
      "bg-red-500/10 border border-red-500/30 text-red-300 backdrop-blur-md",
    gray:
      "bg-gray-500/10 border border-gray-500/30 text-gray-300 backdrop-blur-md",
  };

  const getIcon = () => {
    const baseClass = "w-8 h-8 mx-auto opacity-80";

    switch (icon) {
      case "pending":
        return <ClockIcon className={baseClass} />;
      case "processing":
        return <CogIcon className={`${baseClass} animate-spin-slow`} />;
      case "completed":
        return <CheckCircleIcon className={baseClass} />;
      case "cancelled":
        return <XCircleIcon className={baseClass} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-xl p-5 text-center transition-all duration-300 
      hover:shadow-lg hover:shadow-black/30 ${colorClasses[color]}`}
    >
      {/* Icon */}
      <div className="mb-2">{getIcon()}</div>

      {/* Count */}
      <p className="text-3xl font-bold text-white">{count}</p>

      {/* Label */}
      <p className="text-sm font-medium mt-1 opacity-80">{title}</p>
    </div>
  );
};

export default StatusCard;