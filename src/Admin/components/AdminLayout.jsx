import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./adminSidebar";

export default function AdminLayout() {

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const isSidebarOpen = sidebarExpanded || sidebarHovered;

  return (
    <div>

      <AdminSidebar
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        sidebarHovered={sidebarHovered}
        setSidebarHovered={setSidebarHovered}
      />

      <div
        className={`
          transition-all duration-300
          ${isSidebarOpen ? "ml-64" : "ml-20"}
          bg-gray-100
          min-h-screen
          p-6
        `}
      >
        <Outlet />
      </div>

    </div>
  );
}