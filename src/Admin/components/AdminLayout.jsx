import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaBars, FaTachometerAlt, FaUsers, FaUserCog, FaShoppingCart, FaCreditCard, FaChartLine, FaBoxOpen, FaCog, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import LogoutModal from "./AdminLogoutModal";
import SettingsModal from "./AdminSettingsModal";

export default function AdminLayout() {

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user } = useAuth();

  const isSidebarOpen = sidebarExpanded || sidebarHovered;

  const mobileMenu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Worker Verification", icon: <FaUserCog />, path: "/admin/workers" },
    { name: "Order Completions", icon: <FaCreditCard />, path: "/admin/completions" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/admin/orders" },
    { name: "Revenue", icon: <FaChartLine />, path: "/admin/revenue" },
    { name: "Products", icon: <FaBoxOpen />, path: "/admin/products" },
  ];

  const mobileBottomMenu = [
    { name: "Settings", icon: <FaCog />, onClick: () => { setSettingsOpen(true); setMobileOpen(false); } },
    { name: "Logout", icon: <FaSignOutAlt />, onClick: () => { setLogoutOpen(true); setMobileOpen(false); } },
  ];

  return (
    <div>

      {/* ✅ Desktop Sidebar (UNCHANGED) */}
      <div className="hidden md:block">
        <AdminSidebar
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarHovered={sidebarHovered}
          setSidebarHovered={setSidebarHovered}
        />
      </div>

      {/* ✅ Mobile Floating Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
          md:hidden
          fixed bottom-6 left-6
          z-50
          w-14 h-14
          rounded-full
          bg-blue-600 text-white
          flex items-center justify-center
          shadow-xl
        "
      >
        <FaBars className="text-xl" />
      </button>

      {/* ✅ Mobile Menu — Centered Glassmorphic Popup */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex items-center justify-center p-5">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />

          {/* Centered Glassmorphic Card */}
          <div
            className="relative z-10 w-full max-w-xs flex flex-col"
            style={{
              background: `
                linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))
              `,
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              boxShadow: `
                0 8px 32px rgba(0,0,0,0.45),
                inset 0 1px 0 rgba(255,255,255,0.25),
                inset 0 -1px 0 rgba(255,255,255,0.05)
              `,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Admin Panel</p>
                  <p className="text-white/40 text-[10px]">v2.0.1</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            {/* Nav Items */}
            <div className="overflow-y-auto flex-1 py-3 px-3 space-y-1">
              {mobileMenu.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${isActive
                      ? "bg-blue-600/80 text-white shadow-lg shadow-blue-500/30"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-white/10 px-3 py-3 space-y-1 flex-shrink-0">
              {mobileBottomMenu.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}

              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 mt-1 border-t border-white/10">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-white text-xs font-medium truncate">{user?.username}</p>
                  <p className="text-white/40 text-[10px] truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => { setLogoutOpen(false); }}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* ✅ Main Content */}
      <div
        className={`
          transition-all duration-300
          ml-0
          ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}
          bg-gray-100
          min-h-screen
          p-2 sm:p-4 md:p-6
        `}
      >
        <Outlet />
      </div>

    </div>
  );
}