import { ArrowUp } from "./Icons";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "22px";
      el.style.height = Math.min(el.scrollHeight, 110) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <div className="input-card">
          <div className="input-card-top">
            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder="Follow up with another clinical question…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              rows={1}
            />
          </div>
          <div className="input-card-bottom">
            <div className="input-card-left" />
            <button
              className="send-btn"
              onClick={handleSubmit}
              disabled={disabled || !value.trim()}
              title="Send"
            >
              <ArrowUp size={15} color="#fff" />
            </button>
          </div>
        </div>
        <div className="input-hint">
          Evidence-grounded from ADA, PMC, StatPearls · Enter to send
        </div>
      </div>
    </div>
  );
}
