import { useContext, useRef, useState } from "react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import { WebSocketContext } from "../context/WebSocketContext";
import { v4 as uuid } from "uuid";

const ChatInput = ({ receiverId, theme = "dark" }) => {
  const { sendMessage } = useContext(WebSocketContext);
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const isDark = theme === "dark";

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  };

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`border-t p-3 sm:p-4 ${isDark ? "border-white/10 bg-slate-950/50" : "border-slate-200/80 bg-white/75"}`}>
      <div
        className={`flex items-end gap-2 rounded-[24px] border p-2.5 shadow-lg transition sm:gap-3 sm:p-3 ${
          isDark
            ? "border-white/10 bg-white/8"
            : "border-slate-200 bg-slate-50"
        } ${isFocused ? "ring-2 ring-sky-400/25" : ""}`}
      >
        <button
          type="button"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${isDark ? "text-slate-400 hover:bg-white/10 hover:text-slate-200" : "text-slate-500 hover:bg-white hover:text-slate-700"}`}
          title="Emoji"
        >
          <Smile className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            rows={1}
            onChange={(e) => {
              setText(e.target.value);
              resizeTextarea();
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message"
            className={`max-h-32 min-h-[24px] w-full resize-none bg-transparent py-1 text-sm outline-none sm:text-[15px] ${isDark ? "text-slate-100 placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"}`}
          />
        </div>

        <button
          type="button"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${isDark ? "text-slate-400 hover:bg-white/10 hover:text-slate-200" : "text-slate-500 hover:bg-white hover:text-slate-700"}`}
          title="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition ${
            text.trim()
              ? "bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:scale-[1.02]"
              : isDark
                ? "bg-slate-800 text-slate-500 shadow-none"
                : "bg-slate-200 text-slate-400 shadow-none"
          }`}
          title="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>

      {text.length > 0 && (
        <div className="mt-2 flex justify-end px-1">
          <span className={`text-[11px] ${text.length > 500 ? "text-rose-500" : isDark ? "text-slate-500" : "text-slate-400"}`}>
            {text.length}/500
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
