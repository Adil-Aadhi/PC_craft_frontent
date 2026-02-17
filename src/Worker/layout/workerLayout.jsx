import { Outlet, useLocation } from "react-router-dom";
import WorkerSidebar from "../components/WorkerSidebar";
import WorkerNavbar from "../components/WorkerNavbar";

export default function WorkerLayout() {
  const location = useLocation();

  // adjust path according to your route
  const hideSidebar = location.pathname.includes("/profile") ||
                      location.pathname.includes("/kyc/page")

  const hideNavbar =
    location.pathname.includes("/kyc/page");

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sticky Navbar */}
      {!hideNavbar && <WorkerNavbar />}

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
