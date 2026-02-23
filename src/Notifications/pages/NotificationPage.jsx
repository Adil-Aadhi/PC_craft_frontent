import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const WorkerNotifications = () => {
  const {user}=useAuth()
  const navigate=useNavigate()

   let apiUrl = null;

  if (user?.role === "worker") {
    apiUrl = "/notifications/worker/list-out/";
  } else if (user?.role === "user") {
    apiUrl = "/notifications/user/list-out/";
  } else if (user?.role === "admin") {
    apiUrl = "/notifications/admin/list-out/";
  }
  return (
    <div className="min-h-screen px-4 mt-6 max-w-4xl mx-auto">

  {/* Header row */}
  <div className="flex justify-end mb-2">
    <button
          onClick={() => navigate("/worker/dashboard")}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      {apiUrl ? (
        <NotificationPanel apiUrl={apiUrl} />
      ) : (
        <p className="text-gray-500">No notifications available</p>
      )}

    </div>
  );
};

export default WorkerNotifications;
