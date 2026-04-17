import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ChatList = ({ users, theme = "dark", loading = false }) => {
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const redirectPath = user?.role === "worker" ? "/worker/chat" : "/chat";
  const isDark = theme === "dark";

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((chatUser) => {
      const name = chatUser.other_user.full_name || "";
      const lastMessage = chatUser.last_message || "";
      return (
        name.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  const containerClass = isDark ? "bg-transparent text-slate-100" : "bg-transparent text-slate-900";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const searchClass = isDark
    ? "border-white/10 bg-slate-900 text-slate-100 placeholder:text-slate-500"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400";
  const itemBaseClass = isDark
    ? "border-white/8 hover:border-cyan-300/18 hover:bg-white/8"
    : "border-slate-200/70 hover:border-sky-200 hover:bg-white";
  const activeClass = isDark
    ? "border-cyan-300/25 bg-gradient-to-r from-cyan-400/14 to-teal-400/10 shadow-[0_20px_40px_rgba(8,145,178,0.14)]"
    : "border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 shadow-[0_18px_35px_rgba(14,165,233,0.12)]";

  return (
    <div className={`flex h-full w-full flex-col ${containerClass}`}>
      <div className={`border-b px-4 pb-4 pt-5 sm:px-5 ${isDark ? "border-white/10" : "border-slate-200/80"}`}>
        <p className={`text-[11px] uppercase tracking-[0.28em] ${mutedClass}`}>
          Inbox
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Your chats</h2>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              {users.length} conversation{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <Search className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${mutedClass}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className={`w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 ${searchClass}`}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`rounded-3xl border p-4 ${isDark ? "border-white/8 bg-white/6" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-2xl ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
                  <div className="flex-1 space-y-2">
                    <div className={`h-3 w-24 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
                    <div className={`h-3 w-40 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex h-full min-h-[260px] items-center justify-center px-6 text-center">
            <div>
              <h3 className="text-lg font-semibold">No matching chats</h3>
              <p className={`mt-2 text-sm ${mutedClass}`}>
                Try a different name or message keyword.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredUsers.map((chatUser) => {
              const isActive = String(receiverId) === String(chatUser.other_user.id);
              const name = chatUser.other_user.full_name || "Unknown";
              const initial = name.charAt(0).toUpperCase();

              return (
                <button
                  key={chatUser.id}
                  type="button"
                  onClick={() =>
                    navigate(`${redirectPath}/${chatUser.other_user.id}`, {
                      state: { roomName: chatUser.room_name },
                    })
                  }
                  className={`relative w-full rounded-[26px] border p-4 text-left transition duration-200 ${
                    isActive ? activeClass : itemBaseClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-lg ${
                          isActive
                            ? "bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500"
                            : "bg-gradient-to-br from-slate-500 to-slate-700"
                        }`}
                      >
                        {initial}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400"></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="truncate text-sm font-semibold sm:text-[15px]">{name}</h4>
                        <span className={`shrink-0 text-[11px] ${mutedClass}`}>
                          {chatUser.last_message_time
                            ? new Date(chatUser.last_message_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <p className={`truncate text-sm ${mutedClass}`}>
                          {chatUser.last_message || "Start conversation"}
                        </p>

                        {!isActive && chatUser.unread_count > 0 && (
                          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-2 py-1 text-[11px] font-semibold text-white shadow-lg">
                            {chatUser.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
