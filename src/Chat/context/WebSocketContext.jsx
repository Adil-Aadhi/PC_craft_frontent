import { createContext, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const currentRoomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const token = localStorage.getItem("accessToken");

  let user = null;
  if (token) {
    const decoded = jwtDecode(token);
    user = { id: decoded.user_id };
  }

  const connectWebSocket = (roomName) => {
    if (!token) return;

    // 🔁 switching rooms
    if (currentRoomRef.current !== roomName) {
      setMessages([]);
      setHistoryLoaded(false);
      setSocketReady(false);
      currentRoomRef.current = roomName;

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }

    if (socketRef.current) return;

    socketRef.current = new WebSocket(
     `wss://pccraft3d.duckdns.org/ws/chat/${roomName}/?token=${token}`
    );

    socketRef.current.onopen = () => {
      setSocketReady(true);   // 🔥 socket is ready
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 🧠 HISTORY
      if (data.type === "chat_history") {
        setMessages(data.payload);
        setHistoryLoaded(true);
        return;
      }

      // 💬 NEW MESSAGE
      if (data.type === "chat_message" || data.type === "build_bundle") {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === data.payload.id);
          return exists ? prev : [...prev, data.payload];
        });
        return;
      }
    };

    socketRef.current.onclose = () => {
      socketRef.current = null;
      setSocketReady(false);
    };
  };

  const sendMessage = (data) => {
    console.log("WS STATE:", socketRef.current?.readyState);
    console.log("WS OUT STRING:", JSON.stringify(data));
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }else {
    console.warn("WS NOT OPEN — message not sent");}
  };

  const disconnectWebSocket = () => {
  if (socketRef.current) {
    socketRef.current.close();
    socketRef.current = null;
    currentRoomRef.current = null;
  }
};

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        sendMessage,
        connectWebSocket,
        user,
        historyLoaded,
        disconnectWebSocket,
        socketReady
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
