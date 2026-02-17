import { useContext, useState } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import { v4 as uuid } from "uuid";

const ChatInput = ({ receiverId }) => {
  const { sendMessage } = useContext(WebSocketContext);
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;

    const messageId = uuid();
    
    sendMessage({
      type: "chat_message",
      payload: {
        id: messageId,
        receiver_id: receiverId,
        message: text,
      },
    });

    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-white border-t border-gray-200 backdrop-blur-lg bg-opacity-80">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      
      <div className="p-4">
        <div className={`flex items-end gap-3 bg-gray-50 rounded-2xl p-3 transition-all duration-200 ${
          isFocused ? "ring-2 ring-purple-500 ring-opacity-50 shadow-lg" : "shadow-sm"
        }`}>
          {/* Emoji/Attachment button */}
          <button 
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-purple-500 transition-colors rounded-full hover:bg-purple-50"
            title="Add emoji"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              className="w-full bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400 max-h-32 min-h-[24px] py-1"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={1}
              style={{
                height: 'auto',
                minHeight: '24px',
                maxHeight: '128px',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
          </div>

          {/* Attachment button */}
          <button 
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-purple-500 transition-colors rounded-full hover:bg-purple-50"
            title="Attach file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Send button */}
          <button 
            onClick={handleSend}
            disabled={!text.trim()}
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              text.trim()
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-end mt-2 px-1">
          {text.length > 0 && (
            <p className={`text-xs ${text.length > 200 ? "text-red-500" : "text-gray-400"}`}>
              {text.length}/500
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;