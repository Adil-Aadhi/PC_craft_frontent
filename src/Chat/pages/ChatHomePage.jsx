import { useParams, useNavigate } from "react-router-dom";
import { useMemo,useState,useEffect  } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatList from "../components/ChatList";
import ChatLayout from "../components/ChatLayout";
import WorkerListModal from "../../Worker/components/WorkerListModal";
import api from "../../api/axios";
import { useLocation } from "react-router-dom";

/* =========================
   ANIMATION VARIANTS
========================= */
const panelVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.3 },
  },
};

const ChatHomePage = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  

  const [users, setUsers] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const hasChats = users.length > 0;

 const selectedUser = useMemo(() => {
  if (!receiverId) return null;
  return users.find(
    (u) => u.other_user.id === Number(receiverId)
  ) || null;
}, [receiverId, users]);

const selectedChat = users.find(
  (u) => u.other_user.id === Number(receiverId)
);

const roomName = location.state?.roomName || selectedChat?.room_name;

const userMap = useMemo(() => {
  const map = {};
  users.forEach((u) => {
    map[u.other_user.id] = u.other_user;
  });
  return map;
}, [users]);

  


  const fetchChats = async () => {
    try {
      const res = await api.get("users/chat/list/");
      console.log("CHAT LIST DATA:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(()=>{
    fetchChats()
  },[])


  /* =========================
     CASE 1 — NO CHATS
  ========================== */
  if (!loadingChats && !hasChats) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
            <motion.div
              className="relative mx-auto w-24 h-24"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </motion.div>

            <div className="space-y-3">
              <h2 className="text-4xl font-extrabold text-gray-900">
                Welcome to Chats
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              <p className="text-gray-600 text-lg">
                No conversations yet. Start connecting with people!
              </p>
            </div>

            <button
              onClick={() => setShowWorkerModal(true)}
              className="px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Start New Conversation
            </button>
            <WorkerListModal
              isOpen={showWorkerModal}
              onClose={() => setShowWorkerModal(false)}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  /* =========================
     CASE 2 & 3 — NORMAL LAYOUT
  ========================== */
  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-96 flex-shrink-0 bg-white shadow-2xl border-r border-gray-200/80 flex flex-col">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Messages</h1>

            <button
              onClick={() => navigate("/users")}
              className="p-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition"
              title="Start new chat"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {loadingChats ? (
              <div className="p-4 space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-24 bg-gray-300 rounded"></div>
                      <div className="h-3 w-16 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ChatList users={users} />
            )}
          </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col bg-white min-h-0">
        <AnimatePresence mode="wait">
          {receiverId && selectedUser ? (
            /* ================= CHAT OPEN ================= */
            <motion.div
              key="chat-open"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col flex-1 min-h-0"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 flex-shrink-0 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  {selectedUser.other_user.full_name}
                </h2>

                <button
                  onClick={() => navigate("/chat")}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              {/* Chat body */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ChatLayout receiverId={Number(receiverId)}
                roomName={roomName}
                userMap={userMap} />
              </div>
            </motion.div>
          ) : (
            /* ================= EMPTY STATE ================= */
            <motion.div
              key="empty-state"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white relative"
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
                onClick={() => navigate("/")}
              >
                ✕
              </button>

              {/* Content */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="text-center space-y-6 p-8 max-w-md"
              >
                <motion.div
                  className="relative mx-auto w-32 h-32"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50"></div>
                  <div className="relative flex items-center justify-center w-full h-full">
                    <svg
                      className="w-16 h-16 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </motion.div>

                <h3 className="text-2xl font-semibold text-gray-800">
                  No chat selected
                </h3>
                <p className="text-gray-600 text-lg">
                  Select a conversation from the left panel to start messaging
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatHomePage;
