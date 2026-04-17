import { Outlet, useLocation } from "react-router-dom";
import WorkerSidebar from "../components/WorkerSidebar";
import WorkerNavbar from "../components/workerNavbar";

export default function WorkerLayout() {
  const location = useLocation();

  const isNotificationsPage = location.pathname.includes("/worker/notifications");
  const isChatPage = location.pathname.includes("/worker/chat");

  const hideSidebar =
    location.pathname.includes("/profile") ||
    location.pathname.includes("/kyc/page") ||
    isNotificationsPage ||
    isChatPage;

  const hideNavbar =
    location.pathname.includes("/kyc/page") ||
    isChatPage;

  const layoutBgClass = isNotificationsPage
    ? "bg-[#f4f7fb]"
    : isChatPage
      ? "bg-transparent"
      : "bg-gray-100";

  const contentSpacingClass =
    isNotificationsPage || isChatPage ? "p-0" : "px-4 pb-4 pt-2";

  return (
    <div className={`min-h-screen ${layoutBgClass}`}>
      {!hideNavbar && <WorkerNavbar />}

      <div className={`flex gap-4 ${contentSpacingClass}`}>
        {!hideSidebar && (
          <div className="hidden lg:block flex-shrink-0 sticky top-24 self-start">
            <WorkerSidebar />
          </div>
        )}

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
