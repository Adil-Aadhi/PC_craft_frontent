import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";

const NotificationPanel = ({ apiUrl }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get(apiUrl);
      setNotifications(res.data || []);
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [apiUrl]);

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = [
      { label: "y", seconds: 31536000 },
      { label: "mo", seconds: 2592000 },
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
      { label: "s", seconds: 1 },
    ];

    for (let i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count > 0) return `${count}${i.label} ago`;
    }
    return "just now";
  };

  const handleAction = async (chatRequestId, action) => {
    if (!chatRequestId) return;

    try {
      const res = await api.patch(
        `workers/chat/request/${chatRequestId}/action/`,
        {
          status: action === "accept" ? "accepted" : "rejected",
        }
      );

      const newStatus = res.data.status;

      // 🔥 Update UI instantly using chat_request_status
      setNotifications((prev) =>
        prev.map((n) =>
          n.chat_request_id === chatRequestId
            ? { ...n, chat_request_status: newStatus }
            : n
        )
      );
    } catch (err) {
      console.log("action error", err);
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">
              Notifications
            </h2>
          </div>

          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {notifications.length} total
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 rounded-full"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No notifications
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const status = notification.chat_request_status;

              return (
                <div key={notification.id} className="p-4">
  <div className="flex justify-between items-start gap-4">
    {/* LEFT CONTENT */}
    <div className="flex-1">
      <div className="flex justify-between">
        <p className="font-semibold">{notification.title}</p>

        {notification.created_at && (
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeAgo(notification.created_at)}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-1">
        {notification.message}
      </p>
    </div>

    {/* RIGHT SIDE ACTIONS */}
    <div className="flex flex-col items-end gap-2 min-w-[90px]">
      {notification.chat_request_id && status === "pending" && (
        <>
          <button
            onClick={() =>
              handleAction(notification.chat_request_id, "accept")
            }
            className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white w-full"
          >
            Accept
          </button>

          <button
            onClick={() =>
              handleAction(notification.chat_request_id, "reject")
            }
            className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white w-full"
          >
            Reject
          </button>
        </>
      )}

      {/* STATUS BADGE ON RIGHT */}
      {status && status !== "pending" && (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {status === "accepted" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Accepted
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </>
                  )}
                </span>
              )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;