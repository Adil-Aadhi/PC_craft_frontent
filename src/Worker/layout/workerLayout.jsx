import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import WorkerSidebar from "../components/WorkerSidebar";
import WorkerNavbar from "../components/workerNavbar";

export default function WorkerLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

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
    isNotificationsPage || isChatPage ? "p-0" : "px-2 sm:px-4 pb-4 pt-2";

  return (
    <div className={`min-h-screen ${layoutBgClass} relative overflow-x-hidden`}>
      {!hideNavbar && <WorkerNavbar />}

      {/* Mobile Floating Menu Button */}
      {!hideSidebar && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20"
        >
          {isSidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-l" />}
        </motion.button>
      )}

      {/* Mobile Sidebar Menu (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
            />

            {/* Sidebar Content (Centered) */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[56] flex items-center justify-center p-6 lg:hidden pointer-events-none"
            >
              <div className="pointer-events-auto w-full flex justify-center">
                <WorkerSidebar forceOpen={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`flex gap-4 ${contentSpacingClass}`}>
        {!hideSidebar && (
          <div className="hidden lg:block flex-shrink-0 sticky top-24 self-start">
            <WorkerSidebar />
          </div>
        )}

        <main className="flex-1 min-w-0 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
