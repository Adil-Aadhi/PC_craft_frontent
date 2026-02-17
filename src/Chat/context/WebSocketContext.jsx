import { createContext, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const currentRoomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

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
      currentRoomRef.current = roomName;

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }

    if (socketRef.current) return;

    socketRef.current = new WebSocket(
      `ws://localhost/ws/chat/${roomName}/?token=${token}`
    );

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 🧠 HISTORY
      if (data.type === "chat_history") {
        setMessages(data.payload);
        setHistoryLoaded(true);
        return;
      }

      // 💬 NEW MESSAGE
      if (data.type === "chat_message") {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === data.payload.id);
          return exists ? prev : [...prev, data.payload];
        });
      }
    };

    socketRef.current.onclose = () => {
      socketRef.current = null;
    };
  };

  const sendMessage = (data) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
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
        disconnectWebSocket
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
