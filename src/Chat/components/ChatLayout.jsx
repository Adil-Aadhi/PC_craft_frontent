import { useContext, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import { WebSocketContext } from "../context/WebSocketContext";
import { useLocation, useNavigate } from "react-router-dom";

const ChatLayout = ({
  receiverId,
  roomName,
  userMap,
  buildToSend,
  theme = "dark",
}) => {
  const { user, connectWebSocket, sendMessage, historyLoaded, socketReady } =
    useContext(WebSocketContext);

  const location = useLocation();
  const navigate = useNavigate();

  const hasSentBundle = useRef(false);
  const buildRef = useRef(null);

  useEffect(() => {
    if (buildToSend) {
      buildRef.current = buildToSend;
    }
  }, [buildToSend]);

  useEffect(() => {
    if (roomName) {
      connectWebSocket(roomName);
    }
  }, [roomName, connectWebSocket]);

  useEffect(() => {
    if (!buildRef.current || !socketReady || !historyLoaded || hasSentBundle.current) {
      return;
    }

    const bundlePayload = {
      type: "build_bundle",
      payload: {
        id: crypto.randomUUID(),
        message: buildRef.current.build_name || "PC Build",
        build_ids: [buildRef.current.id],
      },
    };

    sendMessage(bundlePayload);
    hasSentBundle.current = true;
    navigate(location.pathname, { replace: true });
  }, [socketReady, historyLoaded, sendMessage, navigate, location.pathname]);

  if (!user || !roomName) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatBox userMap={userMap} theme={theme} />
      </div>

      <div className="shrink-0">
        <ChatInput receiverId={receiverId} roomName={roomName} theme={theme} />
      </div>
    </div>
  );
};

export default ChatLayout;
