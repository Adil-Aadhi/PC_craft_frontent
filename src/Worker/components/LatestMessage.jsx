import { FiMessageSquare, FiChevronRight } from "react-icons/fi";

/* ---------------- Dummy Messages ---------------- */
const DUMMY_MESSAGES = [
  {
    id: 1,
    name: "Alex Johnson",
    message: "Can we add more RGB lighting?",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 2,
    name: "Sarah Miller",
    message: "Build specifications approved!",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    name: "Mike Chen",
    message: "Budget increased to $3000",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    name: "Creative Team",
    message: "Video editing workstation quote needed",
    time: "Yesterday",
    unread: false,
  },
];

export default function LatestMessages() {
  // take latest 3 messages
  const latestMessages = DUMMY_MESSAGES.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <FiMessageSquare className="mr-2" />
          Latest Messages
        </h2>
        <span className="text-sm text-gray-500">
          {latestMessages.filter(m => m.unread).length} unread
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-4 flex-1">
        {latestMessages.map((msg) => (
          <MessageRow key={msg.id} message={msg} />
        ))}
      </div>

      {/* View All */}
      <button className="mt-6 w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
        View All Messages
        <FiChevronRight />
      </button>
    </div>
  );
}

/* ---------------- Message Row ---------------- */

const MessageRow = ({ message }) => {
  const { name, message: text, time, unread } = message;

  return (
    <div
      className={`p-3 rounded-lg border transition ${
        unread
          ? "bg-blue-50 border-blue-200"
          : "bg-gray-50 border-gray-200 hover:bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <p className="font-semibold text-sm text-gray-800">{name}</p>
        <span className="text-xs text-gray-500">{time}</span>
      </div>

      <p className="text-sm text-gray-600 truncate">{text}</p>

      {unread && (
        <div className="mt-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="text-xs text-blue-600">New</span>
        </div>
      )}
    </div>
  );
};
