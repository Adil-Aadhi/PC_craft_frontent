import {
  FiCpu,
  FiTrendingUp,
  FiPackage,
  FiMessageSquare,
  FiDollarSign,
  FiCalendar,
  FiSettings,
} from "react-icons/fi";

export default function WorkerSidebar() {
  return (
    <div
      className="
        group
        bg-gradient-to-b from-gray-900 to-gray-800
        text-white
        rounded-2xl
        shadow-xl
        sticky top-20
        transition-all duration-300
        w-20 hover:w-64
        flex flex-col
        overflow-hidden
        p-3
        mt-10
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-3 mb-4">
        <div className="p-2 bg-blue-500 rounded-xl">
          <FiCpu className="text-xl" />
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <h1 className="text-base font-bold whitespace-nowrap">
            PC Customizer
          </h1>
          <p className="text-xs text-gray-400 whitespace-nowrap">
            Professional Builder
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        <NavItem icon={<FiTrendingUp />} label="Overview" active />
        <NavItem icon={<FiPackage />} label="Projects" count={5} />
        <NavItem icon={<FiMessageSquare />} label="Messages" count={3} />
        <NavItem icon={<FiDollarSign />} label="Earnings" />
        <NavItem icon={<FiCalendar />} label="Calendar" />
        <NavItem icon={<FiCpu />} label="Inventory" />
        <NavItem icon={<FiSettings />} label="Settings" />
      </nav>
    </div>
  );
}



/* Sidebar Item */
const NavItem = ({ icon, label, active, count }) => (
  <button
    className={`
      w-full flex items-center gap-3 p-3 rounded-xl
      transition-all
      ${active
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"}
    `}
  >
    {/* Icon */}
    <span className="text-lg shrink-0">{icon}</span>

    {/* Label (hidden until hover) */}
    <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {label}
    </span>

    {/* Count badge */}
    {count && (
      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
        {count}
      </span>
    )}
  </button>
);
