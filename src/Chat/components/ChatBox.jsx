import { useContext, useRef, useEffect } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import { useProfile } from "../../Customer/context/ProfileContext";
import { useParams } from "react-router-dom";



const ChatBox = ({userMap }) => {
  const { messages, user,historyLoaded,connectWebSocket,disconnectWebSocket  } = useContext(WebSocketContext);
  const messagesEndRef = useRef(null);
  const { profile } = useProfile();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { roomName } = useParams();


  useEffect(() => {
  if (roomName) {
    connectWebSocket(roomName);
  }
  return () => {
    disconnectWebSocket(); // 🔥 cleanup on route change
  };
}, [roomName]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!historyLoaded) {
    return (
      <div className="flex-1 p-6 space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-48 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}

        <div className="flex justify-end items-start gap-3">
          <div className="flex flex-col gap-2 items-end">
            <div className="h-4 w-40 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden h-full">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(216,180,254,0.15),transparent_50%)]"></div>
      </div>

      {/* Messages container */}
      <div className="relative h-full overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-sm text-gray-400">Start a conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, index) => {
              const isMe = Number(m.sender_id) === Number(user.id);
              const showAvatar = index === 0 || messages[index - 1].sender_id !== m.sender_id;
              console.log("MSG:", m.sender_id, "ME:", user.id);
              const senderProfile = userMap?.[m.sender_id];
              
              
              return (
                <div
                  key={m.id}
                  className={`flex w-full gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  {/* Avatar for other users */}
                  {!isMe && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                          senderProfile?.profile_image ? (
                            <img
                              src={senderProfile.profile_image}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                              {senderProfile?.full_name?.[0]?.toUpperCase() ||
                                m.sender_name?.[0]?.toUpperCase() ||
                                "U"}
                            </div>
                          )
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}>
                    {showAvatar && !isMe && (
                      <span className="text-xs text-gray-500 mb-1 px-1">
                        {m.sender_name || "User"}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                        isMe
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {m.message}
                      </p>
                    </div>
                    {m.timestamp && (
                        <div className="flex flex-col items-end mt-1 px-1">
                          <span className="text-xs text-gray-400">
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          {/* Seen text only for my last message */}
                          {isMe && index === messages.length - 1 && m.is_seen && (
                            <span className="text-[11px] text-gray-400 mt-0.5">Seen</span>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Avatar for current user */}
                  {isMe && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                              profile?.profile_image ? (
                                <img
                                  src={profile.profile_image}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                                  {profile?.full_name?.[0]?.toUpperCase() || "M"}
                                </div>
                              )
                            ) : (
                              <div className="w-8 h-8"></div>
                            )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBox;