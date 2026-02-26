import { useContext, useRef, useEffect } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import { useProfile } from "../../Customer/context/ProfileContext";
import { useState } from "react";
import BuildDetailsModal from "../../cart/components/cartcomponentmodel";
import api from "../../api/axios";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useCallback } from "react";



const ChatBox = ({userMap }) => {
  const { messages, user,historyLoaded } = useContext(WebSocketContext);
  const messagesEndRef = useRef(null);
  const { profile } = useProfile();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const { user:User } = useAuth();
  const isWorker = User?.role === "worker";
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [bundleStatus, setBundleStatus] = useState({});

   const handleStatusLoad = useCallback((id, status) => {
        setBundleStatus((prev) => {
          if (prev[id] === status) return prev; // 🔥 prevent useless state update
          return { ...prev, [id]: status };
        });
      }, []);


  const handleCartRequest = async (buildId, status) => {
      try {
        await api.post(`/cart/items/${buildId}/status/`, {
          status: status,
        });

        setBundleStatus((prev) => ({
          ...prev,
          [buildId]: status,
        }));
      } catch (err) {
        console.error("Status update failed", err);
      }
    };


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

 

  // Sample component images for visual appeal
  const COMPONENT_IMAGES = [
  // "https://images.unsplash.com/photo-1555680202-c86f2e2f7a5a?w=200&h=150&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=200&h=150&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&h=150&fit=crop&auto=format",
];


 const BuildBundleCard = React.memo(({ buildId, isMe, title = "PC Build",onStatusLoad  }) => {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [summary, setSummary] = useState(null);

  const prevStatusRef = useRef(null);

   useEffect(() => {
      let isMounted = true;

      const fetchSummary = async () => {
        try {
          const res = await api.get(`/cart/items/${buildId}/summary/`);
          if (!isMounted) return;

          const newStatus = res.data.status;

          setSummary(res.data);

          // 🔥 only fire when status actually changes
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
    }, [buildId]);

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
    <div
      onClick={handleOpen}
      className={`
        relative w-72 rounded-2xl overflow-hidden cursor-pointer 
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${isMe 
          ? "bg-gradient-to-br from-orange-500 to-red-500 text-white" 
          : "bg-white text-gray-800 border border-gray-200"
        }
        ${loading ? "pointer-events-none opacity-80" : ""}
      `}
    >
      {/* Image Gallery Strip */}
      <div className="relative h-28 overflow-hidden">
        <div className="absolute inset-0 flex">
          {!imageError ? (
            <>
              {COMPONENT_IMAGES.map((src, i) => (
                <img
                  key={src}                // 🔥 stable key
                  src={src}
                  alt="component"
                  loading="lazy"           // 🔥 prevents blocking
                  className="w-1/2 h-full object-cover"
                  draggable={false}
                />
              ))}
            </>
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              isMe ? "bg-orange-600" : "bg-gradient-to-br from-orange-50 to-red-50"
            }`}>
              <span className="text-5xl filter drop-shadow-lg">⚡</span>
            </div>
          )}
        </div>
        
        {/* Gradient Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-t 
          ${isMe 
            ? "from-orange-600/90 via-orange-600/40 to-transparent" 
            : "from-gray-900/70 via-gray-900/30 to-transparent"
          }
        `} />

        {/* Category Tag */}
        <div className="absolute bottom-2 right-2">
          <span className={`
            px-2 py-1 text-[10px] font-medium rounded-full
            ${isMe 
              ? "bg-white/30 text-white" 
              : "bg-orange-500 text-white"
            }
          `}>
            Gaming Rig
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title and Rating */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base font-bold  line-clamp-1 flex items-center gap-1">
            <span className="bg-white/30 px-1 rounded-lg">
              {summary?summary?.build_name:"-"}
             </span> 
              
              
            </h3>
            <p className={`text-xs mt-0.5 ${isMe ? "text-white/70" : "text-gray-500"}`}>
              Complete Gaming Setup
            </p>
          </div>
          
          {/* Quick Specs */}
          <div className="flex items-center gap-1">
            <div className={`text-xs px-2 py-1 rounded-full ${
              isMe ? "bg-white/20" : "bg-orange-100"
            }`}>
              {summary?summary?.cpu:"none"}
            </div>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <p className={`text-xl font-bold ${isMe ? "text-white" : "text-gray-800"}`}>
              {summary?summary?.total_price:0}
            </p>
          </div>
          
          <button 
            className={`
              px-4 py-2 rounded-xl text-xs font-medium transition-all
              ${isMe
                ? "bg-white text-orange-600 hover:bg-gray-100 hover:scale-105"
                : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105"
              }
              ${loading ? "opacity-70 cursor-wait" : ""}
              flex items-center gap-1
            `}
            disabled={loading}
          >
              <>
                <span>View Build</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
          </button>
        </div>
      </div>

      {/* Loading Overlay (optional) */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
          <div className="bg-white/90 rounded-full p-3 shadow-lg">
            <svg className="animate-spin h-6 w-6 text-orange-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});



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
              const currentStatus = bundleStatus[m.build_ids?.[0]];
              
              
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
                   {m.message_type === "build_bundle" ? (
                    <div className="flex flex-col gap-2">
                      <BuildBundleCard buildId={m.build_ids?.[0]} isMe={isMe} onStatusLoad={handleStatusLoad}/>

                      {currentStatus === "accepted" && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700 mt-1 inline-block">
                            Accepted
                          </span>
                        )}

                        {currentStatus === "rejected" && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-red-100 text-red-700 mt-1 inline-block">
                            Rejected
                          </span>
                        )}
                  
                    </div>
                      
                    ) : (
                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                          isMe
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{m.message}</p>
                      </div>
                    )}
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