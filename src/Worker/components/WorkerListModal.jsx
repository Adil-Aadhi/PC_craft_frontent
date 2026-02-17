import { useEffect, useState } from "react";
import api from "../../api/axios";
import { X } from "lucide-react";

const WorkerListModal = ({ isOpen, onClose }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchWorkers();
    }
  }, [isOpen]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/workers/worker_list/");
      setWorkers(res.data);
    } catch (err) {
      console.error("Failed to load workers", err);
    } finally {
      setLoading(false);
    }
  };

  const sendChatRequest = async (workerId) => {
    try {
      setSendingId(workerId);

      await api.post("workers/chat/requests/", {
        receiver_id: workerId,
      });

      alert("Chat request sent ✅");

      onClose(); // close modal after sending
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to send request");
    } finally {
      setSendingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Start New Conversation</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[500px] overflow-y-auto">

          {loading && (
            <p className="text-center py-6 text-gray-500">Loading workers...</p>
          )}

          {!loading && workers.length === 0 && (
            <p className="text-center py-6 text-gray-500">
              No workers available
            </p>
          )}

          {!loading &&
            workers.map((worker) => (
              <div
                key={worker.user_id}
                className="flex items-center justify-between px-6 py-4 border-b hover:bg-gray-50"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <img
                    src={worker.profile_image || "/default-avatar.png"}
                    alt={worker.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-sm text-gray-500">{worker.skills}</p>
                    <p className="text-sm text-yellow-500">
                      ⭐ {worker.rating}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <button
                onClick={() => sendChatRequest(worker.user_id)}
                disabled={worker.has_requested || sendingId === worker.user_id}
                className={`px-4 py-2 rounded-lg text-white
                    ${worker.has_requested
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                {worker.has_requested
                    ? "Requested"
                    : sendingId === worker.user_id
                    ? "Sending..."
                    : "Request"}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerListModal;