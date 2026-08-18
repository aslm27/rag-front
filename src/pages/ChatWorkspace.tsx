import { useCallback, useState } from "react";
import { sendChat } from "../api";
import Sidebar from "../components/Sidebar";
import ChatPage from "../components/ChatPage";
import { useAuth } from "../context/AuthContext";
import type { ChatSession, Message } from "../types";
import "../index.css";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function ChatWorkspace() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages ?? [];

  const createSession = useCallback((firstMessage?: string): string => {
    const id = uid();
    const session: ChatSession = {
      id,
      title: firstMessage
        ? firstMessage.slice(0, 55) + (firstMessage.length > 55 ? "…" : "")
        : "New conversation",
      messages: [],
      createdAt: new Date(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    setSidebarVisible(true);
    return id;
  }, []);

  const handleNewChat = useCallback(() => {
    createSession();
  }, [createSession]);

  const handleSend = useCallback(
    async (content: string) => {
      let sessionId = activeSessionId;
      if (!sessionId) sessionId = createSession(content);

      const userMsg: Message = { id: uid(), role: "user", content, timestamp: new Date() };
      const loadingMsg: Message = { id: uid(), role: "assistant", content: "", timestamp: new Date(), isLoading: true };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                title: s.messages.length === 0
                  ? content.slice(0, 55) + (content.length > 55 ? "…" : "")
                  : s.title,
                messages: [...s.messages, userMsg, loadingMsg],
              }
            : s
        )
      );

      setIsLoading(true);

      try {
        const res = await sendChat(content, 5, "hybrid");
        const assistantMsg: Message = {
          id: loadingMsg.id,
          role: "assistant",
          content: res.answer.recommendation,
          answer: res.answer,
          evidence: res.evidence,
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: s.messages.map((m) => (m.id === loadingMsg.id ? assistantMsg : m)) }
              : s
          )
        );
      } catch (error) {
        const errorMsg: Message = {
          id: loadingMsg.id,
          role: "assistant",
          content: error instanceof Error ? `⚠️ ${error.message}` : "⚠️ Something went wrong. Is the backend running?",
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: s.messages.map((m) => (m.id === loadingMsg.id ? errorMsg : m)) }
              : s
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId, createSession]
  );

  const handleToggleSidebar = useCallback(() => {
    if (sidebarPinned) {
      setSidebarPinned(false);
      setSidebarVisible(false);
    } else {
      setSidebarVisible((v) => !v);
    }
  }, [sidebarPinned]);

  const handlePinSidebar = useCallback(() => {
    setSidebarPinned((p) => !p);
    if (!sidebarVisible) setSidebarVisible(true);
  }, [sidebarVisible]);

  return (
    <div className="app-layout">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        visible={sidebarVisible}
        pinned={sidebarPinned}
        onPin={handlePinSidebar}
      />
      <ChatPage
        messages={messages}
        onSend={handleSend}
        isLoading={isLoading}
        onToggleSidebar={handleToggleSidebar}
        sidebarPinned={sidebarPinned}
        currentUserName={user?.full_name || user?.email || "User"}
        onLogout={logout}
      />
    </div>
  );
}
