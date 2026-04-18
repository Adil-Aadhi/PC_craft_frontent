import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserCog,
  FaShoppingCart,
  FaCreditCard,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaSignOutAlt,
  FaBoxOpen 
} from "react-icons/fa";
import {useAuth} from "../../context/AuthContext"
import { useState } from "react";
import LogoutModal from "./AdminLogoutModal";
import SettingsModal from "./AdminSettingsModal";

export default function AdminSidebar({sidebarExpanded,
  setSidebarExpanded,
  sidebarHovered,
  setSidebarHovered,
  onNavClick}) {
  const isExpanded = sidebarExpanded;
  const isHovered = sidebarHovered;
  const {user,handleLogout}=useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Worker Verification", icon: <FaUserCog />, path: "/admin/workers" },
    { name: "Order Completions", icon: <FaCreditCard />, path: "/admin/completions" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/admin/orders" },
    { name: "Revenue", icon: <FaChartLine />, path: "/admin/revenue" },
    { name: "Products", icon: <FaBoxOpen  />, path: "/admin/products" },
  ];

  const bottomMenu = [
    { name: "Settings", icon: <FaCog />, onClick:() => setSettingsOpen(true)},
    { name: "Logout", icon: <FaSignOutAlt />,  onClick: () => setLogoutOpen(true)},
  ];

  const sidebarWidth = isExpanded || isHovered ? "w-64" : "w-20";

  return (
    <div
      className={`
    fixed left-0 top-0 h-screen
    ${sidebarWidth}
    bg-white/50 backdrop-blur-xl
    border-r border-white/20
    transition-all duration-300 ease-in-out
    shadow-xl
    flex flex-col
    z-50
  `}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      {/* Logo/Header Section */}
      <div className="relative flex items-center h-20 px-4 border-b border-gray-700">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </div>
          <div className={`
            whitespace-nowrap transition-all duration-300
            ${(isExpanded || isHovered) ? 'opacity-100' : 'opacity-0'}
          `}>
            <h1 className="text-white font-bold text-lg">Admin Panel</h1>
            <p className="text-gray-400 text-xs">v2.0.1</p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className={`
            absolute -right-3 top-6
            w-6 h-6
            bg-blue-600 hover:bg-blue-700
            rounded-full
            flex items-center justify-center
            text-white text-xs
            transition-all duration-300
            border-2 border-gray-900
            ${(isExpanded || isHovered) ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="px-3 space-y-1">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={onNavClick}
              className={({ isActive }) => `
                group/nav-item
                relative flex items-center gap-4
                px-3 py-3
                rounded-xl
                transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              {/* Active Indicator */}
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  
                  {/* Icon */}
                  <span className={`
                    text-xl flex-shrink-0
                    transition-transform duration-200
                    group-hover/nav-item:scale-110
                  `}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className={`
                    whitespace-nowrap transition-all duration-300
                    ${(isExpanded || isHovered) ? 'opacity-100' : 'opacity-0'}
                  `}>
                    {item.name}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {(!isExpanded && !isHovered) && (
                    <span className="
                      absolute left-16
                      px-2 py-1
                      bg-gray-900 text-white text-sm
                      rounded-md
                      opacity-0 invisible
                      group-hover/nav-item:opacity-100 group-hover/nav-item:visible
                      transition-all duration-200
                      whitespace-nowrap
                      shadow-lg
                      z-50
                    ">
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-700 pt-4 pb-6">
        <div className="px-3 space-y-1">
          {bottomMenu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path || "#"}
              onClick={() => { item.onClick?.(); onNavClick?.(); }}
              className="
                group/bottom-item
                relative flex items-center gap-4
                px-3 py-3
                rounded-xl
                transition-all duration-200
                text-gray-100 hover:bg-gray-700/50 hover:text-white
              "
            >
              <span className="text-xl flex-shrink-0 transition-transform duration-200 group-hover/bottom-item:scale-110">
                {item.icon}
              </span>
              <span className={`
                whitespace-nowrap transition-all duration-300
                ${(isExpanded || isHovered) ? 'opacity-100' : 'opacity-0'}
              `}>
                {item.name}
              </span>
              
              {/* Tooltip for collapsed state */}
              {(!isExpanded && !isHovered) && (
                <span className="
                  absolute left-16
                  px-2 py-1
                  bg-gray-900 text-white text-sm
                  rounded-md
                  opacity-0 invisible
                  group-hover/bottom-item:opacity-100 group-hover/bottom-item:visible
                  transition-all duration-200
                  whitespace-nowrap
                  shadow-lg
                  z-50
                ">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}

          {/* User Profile Section */}
         <div
            className={`
              mt-4 pt-4 px-3
              border-t border-gray-700
              transition-all duration-300
              ${(isExpanded || isHovered) ? "opacity-100" : "opacity-0"}
            `}
          >
            <div className="flex items-center gap-3">

              {user?.profile ? (
                <img
                  src={user.profile}
                  alt="Admin"
                  className="w-8 h-8 rounded-full ring-2 ring-gray-700 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold ring-2 ring-gray-700">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">
                  {user?.username}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.email}
                </p>
              </div>

            </div>
            <LogoutModal
              isOpen={logoutOpen}
              onClose={() => setLogoutOpen(false)}
              onConfirm={handleLogout}
            />
            <SettingsModal
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
          </div>
        </div>
      </div>
    </div>
  );
}