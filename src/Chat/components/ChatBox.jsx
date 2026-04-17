import { useContext, useRef, useEffect, useState, useCallback } from "react";
import React from "react";
import { Cpu, PackageOpen } from "lucide-react";
import { WebSocketContext } from "../context/WebSocketContext";
import { useProfile } from "../../Customer/context/ProfileContext";
import BuildDetailsModal from "../../cart/components/cartcomponentmodel";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const COMPONENT_IMAGES = [
  "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=200&h=150&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&h=150&fit=crop&auto=format",
];

const BuildBundleCard = React.memo(
  ({ buildId, isMe, onStatusLoad, setSelectedBuild, theme }) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const prevStatusRef = useRef(null);
    const isDark = theme === "dark";

    useEffect(() => {
      let isMounted = true;

      const fetchSummary = async () => {
        try {
          const res = await api.get(`/cart/items/${buildId}/summary/`);
          if (!isMounted) return;

          const newStatus = res.data.status;
          setSummary(res.data);

          if (prevStatusRef.current !== newStatus) {
            prevStatusRef.current = newStatus;
            onStatusLoad?.(buildId, newStatus);
          }
        } catch (err) {
          console.error("Summary load failed", err);
        }
      };

      if (buildId) fetchSummary();

      return () => {
        isMounted = false;
      };
    }, [buildId, onStatusLoad]);

    const handleOpen = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/cart/items/${buildId}/chat/`);
        setSelectedBuild(res.data);
      } catch (err) {
        console.error("Failed to load build", err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <button
        type="button"
        onClick={handleOpen}
        className={`relative w-full max-w-[18rem] overflow-hidden rounded-[24px] border text-left transition duration-300 hover:-translate-y-0.5 ${
          isMe
            ? "border-orange-300/25 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-[0_18px_40px_rgba(249,115,22,0.26)]"
            : isDark
              ? "border-white/12 bg-white/8 text-slate-100 shadow-[0_18px_40px_rgba(2,6,23,0.24)]"
              : "border-slate-200 bg-white text-slate-900 shadow-[0_16px_35px_rgba(148,163,184,0.18)]"
        } ${loading ? "pointer-events-none opacity-80" : ""}`}
      >
        <div className="relative h-28 overflow-hidden">
          <div className="absolute inset-0 flex">
            {COMPONENT_IMAGES.map((src) => (
              <img
                key={src}
                src={src}
                alt="component"
                loading="lazy"
                className="h-full w-1/2 object-cover"
                draggable={false}
              />
            ))}
          </div>
          <div className={`absolute inset-0 ${isMe ? "bg-gradient-to-t from-red-700/90 via-orange-700/35 to-transparent" : "bg-gradient-to-t from-black/75 via-black/25 to-transparent"}`}></div>
          <span className="absolute bottom-3 right-3 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
            Custom Build
          </span>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold sm:text-base">
                {summary?.build_name || "PC Build"}
              </h3>
              <p className={`mt-1 text-xs ${isMe ? "text-white/75" : isDark ? "text-slate-400" : "text-slate-500"}`}>
                Open to review selected parts and pricing.
              </p>
            </div>
            <div className={`rounded-xl px-2 py-1 text-[11px] ${isMe ? "bg-white/20" : isDark ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
              <div className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" />
                <span className="max-w-16 truncate">{summary?.cpu || "Build"}</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between border-t pt-3 ${isMe ? "border-white/15" : isDark ? "border-white/10" : "border-slate-200"}`}>
            <div>
              <p className={`text-[11px] ${isMe ? "text-white/70" : isDark ? "text-slate-500" : "text-slate-500"}`}>
                Total price
              </p>
              <p className="text-lg font-semibold">{summary?.total_price || 0}</p>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium ${isMe ? "bg-white text-orange-600" : "bg-gradient-to-r from-orange-500 to-red-500 text-white"}`}>
              <PackageOpen className="h-3.5 w-3.5" />
              View Build
            </span>
          </div>
        </div>
      </button>
    );
  }
);

const ChatBox = ({ userMap, theme = "dark" }) => {
  const { messages, user, historyLoaded } = useContext(WebSocketContext);
  const messagesEndRef = useRef(null);
  const { profile } = useProfile();
  const { user: authUser } = useAuth();
  const isWorker = authUser?.role === "worker";
  const isDark = theme === "dark";

  const [selectedBuild, setSelectedBuild] = useState(null);
  const [bundleStatus, setBundleStatus] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStatusLoad = useCallback((id, status) => {
    setBundleStatus((prev) => {
      if (prev[id] === status) return prev;
      return { ...prev, [id]: status };
    });
  }, []);

  const handleCartRequest = async (buildId, status) => {
    try {
      await api.post(`/cart/items/${buildId}/status/`, { status });
      setBundleStatus((prev) => ({ ...prev, [buildId]: status }));
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!historyLoaded) {
    return (
      <div className={`flex-1 space-y-4 p-6 animate-pulse ${isDark ? "bg-transparent" : "bg-transparent"}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`h-9 w-9 rounded-2xl ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>
            <div className="flex flex-col gap-2">
              <div className={`h-3 w-24 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>
              <div className={`h-12 w-56 rounded-2xl ${isDark ? "bg-slate-900" : "bg-slate-100"}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.12),_transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.62)_0%,rgba(2,6,23,0.22)_100%)]" : "bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.10),_transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,247,237,0.92)_100%)]"}`}></div>

      <div className="relative flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] border ${isDark ? "border-orange-300/20 bg-orange-400/10 text-orange-300" : "border-orange-200 bg-orange-50 text-orange-600"}`}>
                <PackageOpen className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-semibold">No messages yet</h3>
              <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Start with a message or share a build to begin the conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isMe = Number(message.sender_id) === Number(user.id);
              const showAvatar =
                index === 0 || messages[index - 1].sender_id !== message.sender_id;
              const senderProfile = userMap?.[message.sender_id];
              const currentStatus = bundleStatus[message.build_ids?.[0]];

              return (
                <div
                  key={message.id}
                  className={`flex w-full gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="flex-shrink-0 pt-1">
                      {showAvatar ? (
                        senderProfile?.profile_image ? (
                          <img
                            src={senderProfile.profile_image}
                            alt={senderProfile?.full_name || "User"}
                            className="h-9 w-9 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-sm font-semibold text-white shadow-lg">
                            {senderProfile?.full_name?.[0]?.toUpperCase() ||
                              message.sender_name?.[0]?.toUpperCase() ||
                              "U"}
                          </div>
                        )
                      ) : (
                        <div className="h-9 w-9"></div>
                      )}
                    </div>
                  )}

                  <div className={`flex max-w-[84%] flex-col ${isMe ? "items-end" : "items-start"} sm:max-w-[72%]`}>
                    {showAvatar && !isMe && (
                      <span className={`mb-1 px-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {message.sender_name || "User"}
                      </span>
                    )}

                    {message.message_type === "build_bundle" ? (
                      <div className="flex flex-col gap-2">
                        <BuildBundleCard
                          buildId={message.build_ids?.[0]}
                          isMe={isMe}
                          onStatusLoad={handleStatusLoad}
                          setSelectedBuild={setSelectedBuild}
                          theme={theme}
                        />

                        {currentStatus === "accepted" && (
                          <span className="inline-block rounded-xl bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
                            Accepted
                          </span>
                        )}

                        {currentStatus === "rejected" && (
                          <span className="inline-block rounded-xl bg-rose-100 px-2.5 py-1 text-xs text-rose-700">
                            Rejected
                          </span>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`rounded-[22px] px-4 py-3 text-sm leading-relaxed shadow-lg ${
                          isMe
                            ? "rounded-br-md bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 text-white shadow-[0_18px_35px_rgba(249,115,22,0.28)]"
                            : isDark
                              ? "rounded-bl-md border border-white/10 bg-white/10 text-slate-100 shadow-[0_18px_35px_rgba(2,6,23,0.2)]"
                              : "rounded-bl-md border border-orange-100 bg-white text-slate-800 shadow-[0_12px_30px_rgba(251,146,60,0.12)]"
                        }`}
                      >
                        <p className="break-words">{message.message}</p>
                      </div>
                    )}

                    {message.timestamp && (
                      <div className="mt-1.5 flex flex-col items-end px-1">
                        <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMe && index === messages.length - 1 && message.is_seen && (
                          <span className={`mt-0.5 text-[11px] ${isDark ? "text-orange-300" : "text-orange-600"}`}>
                            Seen
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {isMe && (
                    <div className="flex-shrink-0 pt-1">
                      {showAvatar ? (
                        profile?.profile_image ? (
                          <img
                            src={profile.profile_image}
                            alt={profile?.full_name || "Me"}
                            className="h-9 w-9 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-sm font-semibold text-white shadow-lg">
                            {profile?.full_name?.[0]?.toUpperCase() || "M"}
                          </div>
                        )
                      ) : (
                        <div className="h-9 w-9"></div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {selectedBuild && (
        <BuildDetailsModal
          build={selectedBuild}
          isWorker={isWorker}
          currentStatus={bundleStatus[selectedBuild.id]}
          onAccept={() => handleCartRequest(selectedBuild.id, "accepted")}
          onReject={() => handleCartRequest(selectedBuild.id, "rejected")}
          location="chat"
          onClose={() => setSelectedBuild(null)}
        />
      )}
    </div>
  );
};

export default ChatBox;
