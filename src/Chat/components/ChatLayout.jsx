import { useContext, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import { WebSocketContext } from "../context/WebSocketContext";
import { useLocation, useNavigate } from "react-router-dom";

const ChatLayout = ({ receiverId, roomName, userMap, buildToSend }) => {
  const {
    user,
    connectWebSocket,
    sendMessage,
    historyLoaded,
    socketReady,
  } = useContext(WebSocketContext);

  const location = useLocation();
  const navigate = useNavigate();

  const hasSentBundle = useRef(false);
  const buildRef = useRef(null);

  // 🔁 Sync ref when buildToSend arrives (fix first-load issue)
  useEffect(() => {
    if (buildToSend) {
      buildRef.current = buildToSend;
    }
  }, [buildToSend]);

  // 🔌 Connect socket when room changes
  useEffect(() => {
    if (roomName) {
      connectWebSocket(roomName);
    }
  }, [roomName, connectWebSocket]);

  // 📦 Auto-send bundle AFTER socket + history ready
  useEffect(() => {
    if (!buildRef.current) return;
    if (!socketReady) return;
    if (!historyLoaded) return;
    if (hasSentBundle.current) return;

    const bundlePayload = {
      type: "build_bundle",
      payload: {
        id: crypto.randomUUID(),
        message: buildRef.current.build_name || "PC Build",
        build_ids: [buildRef.current.id],
      },
    };

    console.log("📦 SENDING BUNDLE:", bundlePayload);

    sendMessage(bundlePayload);

    hasSentBundle.current = true;

    // 🧹 Clear router state so refresh won’t resend
    navigate(location.pathname, { replace: true });
  }, [socketReady, historyLoaded, navigate, location.pathname]);

  if (!user || !roomName) return null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatBox userMap={userMap} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput receiverId={receiverId} roomName={roomName} />
      </div>
    </div>
  );
};

export default ChatLayout;