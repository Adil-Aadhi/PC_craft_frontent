import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import api from "../../api/axios"; // adjust path
import { useNavigate } from "react-router-dom";

const SendBuildModal = ({ build, onClose }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("users/chat/list/"); // ChatListAPIView
        setWorkers(res.data);
      } catch (err) {
        console.error("Failed to fetch workers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  console.log("build",build)

  const handleSend = () => {
    if (!selectedRoom) return;

    onClose();

    navigate(`/chat/${selectedRoom.other_user.id}`, {
        state: { buildToSend: build },
    });
    };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Send Build to Worker
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Build Info */}
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-3 mb-4">
          <p className="text-sm text-zinc-400">Build</p>
          <p className="text-white font-semibold">
            {build.build_name || "Custom PC Build"}
          </p>
          <p className="text-cyan-400 text-sm">
            ₹{build.total_price?.toLocaleString()}
          </p>
        </div>

        {/* Worker List */}
        <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-cyan-400" />
            </div>
          ) : workers.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center">
              No workers available
            </p>
          ) : (
            workers.map((room) => {
              const rating = room.other_user?.worker_profile?.rating;

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedRoom?.id === room.id
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        room.other_user?.profile_image ||
                        "/default-avatar.png"
                      }
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm text-white">
                        {room.other_user?.full_name}
                      </p>

                      <p className="text-xs text-zinc-400">
                        {room.other_user?.rating && room.other_user?.rating > 0 ? (
                          <span className="text-yellow-400">⭐ {room.other_user?.rating}</span>
                        ) : (
                          "No rating"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send Button */}
        <button
          disabled={!selectedRoom || sending}
          onClick={handleSend}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-zinc-700 py-2 rounded-lg font-semibold"
        >
          {sending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Send size={16} />
              Send Build
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default SendBuildModal;