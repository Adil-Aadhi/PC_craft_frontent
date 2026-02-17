import { useNavigate, useParams } from "react-router-dom";

const ChatList = ({ users }) => {
  const navigate = useNavigate();
  const { receiverId } = useParams();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {users.map((u) => {
            const isActive =
              String(receiverId) === String(u.other_user.id);

            const name = u.other_user.full_name || "Unknown";
            const initial = name.charAt(0).toUpperCase();

            return (
              <div
                key={u.id}
                onClick={() =>
                  navigate(`/chat/${u.other_user.id}`,{
                    state: { roomName: u.room_name }
                  })
                }
                className={`
                  group relative cursor-pointer p-4 rounded-xl transition-all duration-200 mb-1
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md"
                          : "bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-indigo-400 group-hover:to-purple-500"
                      }
                    `}
                    >
                      {initial}
                    </div>

                    {/* Online Status Badge (static for now) */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`
                        font-semibold truncate transition-colors
                        ${isActive ? "text-indigo-900" : "text-gray-900"}
                      `}
                      >
                        {name}
                      </h4>

                      {/* Last message time */}
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {u.last_message_time
                          ? new Date(
                              u.last_message_time
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {u.last_message || "Start conversation"}
                      </p>

                      {/* Unread Badge */}
                      {!isActive && u.unread_count > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {u.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {users.length} conversation
            {users.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
