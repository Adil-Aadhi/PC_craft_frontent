import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Bell,
  CheckCircle2,
  Clock3,
  MessageSquareMore,
  RefreshCw,
  XCircle,
} from "lucide-react";

const NotificationPanel = ({ apiUrl, theme = "dark" }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const isDark = theme === "dark";

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

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) return `${count}${interval.label} ago`;
    }

    return "just now";
  };

  const handleAction = async (chatRequestId, action) => {
    if (!chatRequestId) return;

    try {
      setProcessingId(chatRequestId);
      const res = await api.patch(`workers/chat/request/${chatRequestId}/action/`, {
        status: action === "accept" ? "accepted" : "rejected",
      });

      const newStatus = res.data.status;

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.chat_request_id === chatRequestId
            ? { ...notification, chat_request_status: newStatus }
            : notification
        )
      );
    } catch (err) {
      console.log("action error", err);
    } finally {
      setProcessingId(null);
    }
  };

  const shellClass = isDark
    ? "border-white/10 bg-white/8 text-slate-100"
    : "border-slate-200/80 bg-white/85 text-slate-900";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const dividerClass = isDark ? "divide-white/10" : "divide-slate-200/80";
  const itemClass = isDark
    ? "border-white/10 bg-slate-950/35 hover:bg-white/8"
    : "border-slate-200/80 bg-white hover:bg-slate-50";

  return (
    <div className={`flex h-full w-full flex-col overflow-hidden rounded-[28px] border ${shellClass} backdrop-blur-2xl`}>
      <div className={`border-b px-4 py-4 sm:px-6 ${isDark ? "border-white/10 bg-slate-950/35" : "border-slate-200/80 bg-white/70"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-orange-400/10 text-orange-300" : "bg-orange-50 text-orange-600"}`}>
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">Notifications</h2>
              <p className={`text-sm ${mutedClass}`}>
                Requests, updates, and recent activity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
              {notifications.length} total
            </span>
            <button
              type="button"
              onClick={fetchNotifications}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition ${isDark ? "border-white/10 bg-white/10 text-slate-200 hover:bg-white/15" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"}`}
              title="Refresh notifications"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`rounded-[24px] border p-4 ${isDark ? "border-white/10 bg-white/6" : "border-slate-200 bg-slate-50"}`}
              >
                <div className="space-y-3">
                  <div className={`h-4 w-40 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>
                  <div className={`h-3 w-full rounded-full ${isDark ? "bg-slate-900" : "bg-slate-100"}`}></div>
                  <div className={`h-3 w-3/4 rounded-full ${isDark ? "bg-slate-900" : "bg-slate-100"}`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center px-4">
            <div className="max-w-sm text-center">
              <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] border ${isDark ? "border-orange-300/15 bg-orange-400/8 text-orange-300" : "border-orange-200 bg-orange-50 text-orange-600"}`}>
                <MessageSquareMore className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-semibold">No notifications yet</h3>
              <p className={`mt-2 text-sm ${mutedClass}`}>
                When requests or updates arrive, they will appear here in a cleaner mobile-friendly feed.
              </p>
            </div>
          </div>
        ) : (
          <div className={`space-y-3 ${dividerClass}`}>
            {notifications.map((notification) => {
              const status = notification.chat_request_status;
              const isPending = notification.chat_request_id && status === "pending";
              const isProcessing = processingId === notification.chat_request_id;

              return (
                <div
                  key={notification.id}
                  className={`rounded-[24px] border p-4 transition sm:p-5 ${itemClass}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-base font-semibold sm:text-[17px]">
                            {notification.title}
                          </p>
                          <p className={`mt-1 text-sm leading-6 ${mutedClass}`}>
                            {notification.message}
                          </p>
                        </div>

                        {notification.created_at && (
                          <span className={`inline-flex items-center gap-1 text-xs ${mutedClass}`}>
                            <Clock3 className="h-3.5 w-3.5" />
                            {getTimeAgo(notification.created_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[150px]">
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAction(notification.chat_request_id, "accept")}
                            disabled={isProcessing}
                            className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isProcessing ? "Updating..." : "Accept"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(notification.chat_request_id, "reject")}
                            disabled={isProcessing}
                            className="w-full rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isProcessing ? "Updating..." : "Reject"}
                          </button>
                        </>
                      )}

                      {status && status !== "pending" && (
                        <span
                          className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-sm font-medium ${
                            status === "accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {status === "accepted" ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Accepted
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
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
