import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Moon,
  Plus,
  Sun,
  X,
} from "lucide-react";
import ChatList from "../components/ChatList";
import ChatLayout from "../components/ChatLayout";
import WorkerListModal from "../../Worker/components/WorkerListModal";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const panelVariants = {
  hidden: { opacity: 0, scale: 0.985, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.24, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: 12,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.06, duration: 0.28 },
  },
};

const THEME_KEY = "chat-theme";

const ChatHomePage = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const buildToSend = location.state?.buildToSend;
  const chatBasePath = user?.role === "worker" ? "/worker/chat" : "/chat";
  const dashboardPath = user?.role === "worker" ? "/worker/dashboard" : "/";

  const [users, setUsers] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";
  const hasChats = users.length > 0;
  const isChatSelected = Boolean(receiverId);

  const selectedUser = useMemo(() => {
    if (!receiverId) return null;
    return users.find((u) => u.other_user.id === Number(receiverId)) || null;
  }, [receiverId, users]);

  const selectedChat = useMemo(
    () => users.find((u) => u.other_user.id === Number(receiverId)),
    [receiverId, users]
  );

  const roomName = location.state?.roomName || selectedChat?.room_name;

  const userMap = useMemo(() => {
    const map = {};
    users.forEach((chatUser) => {
      map[chatUser.other_user.id] = chatUser.other_user;
    });
    return map;
  }, [users]);

  const shellClass = isDark
    ? "bg-[#07111f] text-slate-100"
    : "bg-[#f4f7fb] text-slate-900";

  const backdropClass = isDark
    ? "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.08),_transparent_26%),linear-gradient(180deg,#07111f_0%,#0b1220_48%,#111827_100%)]"
    : "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,#eef4ff_0%,#f7fafc_45%,#edf3f9_100%)]";

  const panelClass = isDark
    ? "border-white/10 bg-white/8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl"
    : "border-slate-200/80 bg-white/88 shadow-[0_24px_70px_rgba(148,163,184,0.22)] backdrop-blur-2xl";

  const subTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const topBarClass = isDark
    ? "border-white/10 bg-white/8"
    : "border-slate-200/80 bg-white/80";
  const iconButtonClass = isDark
    ? "border-white/10 bg-white/10 text-slate-200 hover:bg-white/16"
    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100";

  const fetchChats = async () => {
    try {
      const res = await api.get("users/chat/list/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleClosePage = () => {
    navigate(dashboardPath);
  };

  const handleBackToList = () => {
    navigate(chatBasePath);
  };

  if (!loadingChats && !hasChats) {
    return (
      <div className={`min-h-screen ${shellClass}`}>
        <div className={`min-h-screen ${backdropClass} px-4 py-5 sm:px-6`}>
          <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-5xl flex-col">
            <div className={`mb-6 flex items-center justify-between rounded-[28px] border px-4 py-3 sm:px-5 ${topBarClass} backdrop-blur-xl`}>
              <div>
                <p className={`text-xs uppercase tracking-[0.28em] ${subTextClass}`}>
                  Conversation Hub
                </p>
                <h1 className="mt-1 text-xl font-semibold sm:text-2xl">Chat</h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={handleClosePage}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              className={`mx-auto flex w-full max-w-2xl flex-1 items-center justify-center rounded-[32px] border p-6 sm:p-10 ${panelClass}`}
            >
              <div className="text-center">
                <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] border ${isDark ? "border-cyan-400/20 bg-cyan-400/10" : "border-sky-200 bg-sky-50"}`}>
                  <MessageSquare className={`h-11 w-11 ${isDark ? "text-cyan-300" : "text-sky-600"}`} />
                </div>

                <h2 className="text-3xl font-semibold sm:text-4xl">No conversations yet</h2>
                <p className={`mx-auto mt-3 max-w-md text-sm sm:text-base ${subTextClass}`}>
                  Once a worker or user starts a conversation, it will appear here. We can also start a new one right now.
                </p>

                {user?.role === "user" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowWorkerModal(true)}
                      className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(14,165,233,0.28)] transition hover:scale-[1.01]"
                    >
                      <Plus className="h-4 w-4" />
                      Start New Conversation
                    </button>
                    <WorkerListModal
                      isOpen={showWorkerModal}
                      onClose={() => setShowWorkerModal(false)}
                    />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <div className={`min-h-screen ${backdropClass} px-4 py-4 sm:px-6 sm:py-7`}>
        <div className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-[1600px] flex-col gap-3 sm:h-[calc(100vh-2.5rem)] sm:gap-4">
          <div className={`flex items-center justify-between rounded-[26px] border px-4 py-3 sm:px-5 ${topBarClass} backdrop-blur-xl`}>
            <div>
              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">Messages</h1>
            </div>

            <div className="flex items-center gap-2">
              {user?.role === "user" && (
                <button
                  type="button"
                  onClick={() => setShowWorkerModal(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 px-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(14,165,233,0.22)] transition hover:scale-[1.01]"
                  title="Start new chat"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={handleClosePage}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
                aria-label="Close chat page"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 gap-4">
            <div
              className={`min-h-0 w-full lg:flex lg:w-[380px] lg:flex-shrink-0 ${
                isChatSelected ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className={`flex min-h-0 w-full flex-col overflow-hidden rounded-[30px] border ${panelClass}`}>
                <ChatList users={users} theme={theme} loading={loadingChats} />
              </div>
            </div>

            <div
              className={`min-h-0 flex-1 ${
                !isChatSelected ? "hidden lg:flex" : "flex"
              }`}
            >
              <div className={`flex min-h-0 w-full flex-col overflow-hidden rounded-[30px] border ${panelClass}`}>
                <AnimatePresence mode="wait">
                  {receiverId && selectedUser ? (
                    <motion.div
                      key="chat-open"
                      variants={panelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex min-h-0 flex-1 flex-col"
                    >
                      <div
                        className={`flex items-center justify-between border-b px-4 py-4 sm:px-6 ${
                          isDark
                            ? "border-white/10 bg-slate-950/35"
                            : "border-slate-200/80 bg-white/70"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={handleBackToList}
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition lg:hidden ${iconButtonClass}`}
                            aria-label="Back to chats"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>

                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-cyan-400/10 text-cyan-200" : "bg-sky-100 text-sky-700"}`}>
                            {(selectedUser.other_user.full_name || "U").charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold sm:text-lg">
                              {selectedUser.other_user.full_name}
                            </h2>
                            <p className={`truncate text-xs sm:text-sm ${subTextClass}`}>
                              {user?.role === "worker" ? "Customer conversation" : "Worker conversation"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleBackToList}
                          className={`hidden h-10 w-10 items-center justify-center rounded-2xl border transition lg:flex ${iconButtonClass}`}
                          aria-label="Close current chat"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="min-h-0 flex-1">
                        <ChatLayout
                          receiverId={Number(receiverId)}
                          roomName={roomName}
                          userMap={userMap}
                          buildToSend={buildToSend}
                          theme={theme}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-state"
                      variants={panelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-1 items-center justify-center"
                    >
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-md px-8 text-center"
                      >
                        <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] border ${isDark ? "border-cyan-400/15 bg-cyan-400/8" : "border-sky-200 bg-sky-50"}`}>
                          <MessageSquare className={`h-11 w-11 ${isDark ? "text-cyan-300" : "text-sky-600"}`} />
                        </div>
                        <h3 className="text-2xl font-semibold">Choose a conversation</h3>
                        <p className={`mt-3 text-sm sm:text-base ${subTextClass}`}>
                          Desktop keeps the list and chat together. On mobile, the list opens first and each conversation gets its own focused screen.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {user?.role === "user" && (
          <WorkerListModal
            isOpen={showWorkerModal}
            onClose={() => setShowWorkerModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatHomePage;
