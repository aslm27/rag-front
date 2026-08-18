import { useRef, useEffect } from "react";
import type { Message } from "../types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import { Menu, Microscope } from "./Icons";

interface ChatPageProps {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  sidebarPinned?: boolean;
  currentUserName: string;
  onLogout: () => void;
}

export default function ChatPage({
  messages,
  onSend,
  isLoading,
  onToggleSidebar,
  sidebarPinned,
  currentUserName,
  onLogout,
}: ChatPageProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="main-content">
      <div className="top-bar">
        <div className="top-bar-left">
          <button
            className={`sidebar-toggle ${sidebarPinned ? "pinned" : ""}`}
            onClick={onToggleSidebar}
            title={sidebarPinned ? "Unpin sidebar" : "Toggle sidebar"}
          >
            <Menu size={16} />
          </button>
          {hasMessages && <span className="top-bar-title">ClinicalRAG</span>}
        </div>
        <div className="top-bar-right">
          <div className="auth-user-chip" title={currentUserName}>{currentUserName}</div>
          <button className="auth-logout-btn" onClick={onLogout}>Logout</button>
          {hasMessages && (
            <span className="method-selector">
              <Microscope size={14} />
              <select defaultValue="hybrid">
                <option value="hybrid">Hybrid</option>
                <option value="semantic">Semantic</option>
                <option value="bm25">BM25</option>
              </select>
            </span>
          )}
        </div>
      </div>

      {!hasMessages ? (
        <WelcomeScreen onSend={onSend} disabled={isLoading} />
      ) : (
        <div className="messages-container">
          <div className="messages-inner">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {hasMessages && <ChatInput onSend={onSend} disabled={isLoading} />}
    </div>
  );
}
