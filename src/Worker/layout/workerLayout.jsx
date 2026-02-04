import { Outlet, useLocation } from "react-router-dom";
import WorkerSidebar from "../components/WorkerSidebar";
import WorkerNavbar from "../components/WorkerNavbar";

export default function WorkerLayout() {
  const location = useLocation();

  // adjust path according to your route
  const hideSidebar = location.pathname.includes("/profile");

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sticky Navbar */}
      <WorkerNavbar />

      {/* Content Area */}
      <div className="flex gap-4 px-4 pb-4 pt-2">

        {/* Sidebar (hidden on profile) */}
        {!hideSidebar && (
          <div className="hidden lg:block flex-shrink-0 sticky top-24 self-start">
            <WorkerSidebar />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
