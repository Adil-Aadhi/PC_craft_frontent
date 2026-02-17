import { useContext, useEffect } from "react";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";
import { WebSocketContext } from "../context/WebSocketContext";

const ChatLayout = ({ receiverId, roomName,userMap }) => {
  const { user, connectWebSocket,  } = useContext(WebSocketContext);

  if (!user || !roomName) return null;

  useEffect(() => {
    connectWebSocket(roomName);
  }, [roomName, connectWebSocket]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatBox userMap={userMap}/>
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput receiverId={receiverId} roomName={roomName} />
      </div>
    </div>
  );
};

export default ChatLayout;
