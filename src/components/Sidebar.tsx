import { useState, useEffect } from "react";
import { getHealth } from "../api";
import DocumentsPanel from "./DocumentsPanel";
import { Flask, Plus, Pin, PinOff, MessageSquare, BookOpen } from "./Icons";
import type { ChatSession, HealthResponse } from "../types";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  visible: boolean;
  pinned: boolean;
  onPin: () => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  visible,
  pinned,
  onPin,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"chats" | "docs">("chats");
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealth(null));
  }, []);

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <aside className={`sidebar ${visible ? "" : "hidden"}`}>
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Flask size={15} color="#fff" />
            </div>
            <span className="sidebar-brand-name">ClinicalRAG</span>
          </div>
          <button
            className="pin-btn"
            onClick={onPin}
            title={pinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {pinned ? <Pin size={15} /> : <PinOff size={15} />}
          </button>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={14} color="#fff" /> New conversation
        </button>
      </div>

      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === "chats" ? "active" : ""}`}
          onClick={() => setActiveTab("chats")}
        >
          <MessageSquare size={13} /> Chats
        </button>
        <button
          className={`sidebar-tab ${activeTab === "docs" ? "active" : ""}`}
          onClick={() => setActiveTab("docs")}
        >
          <BookOpen size={13} /> Sources
        </button>
      </div>

      {activeTab === "chats" ? (
        <>
          <div className="sidebar-section-title">Recent</div>
          <div className="sidebar-chats">
            {sessions.length === 0 ? (
              <div style={{ padding: "24px 12px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                No conversations yet
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className={`sidebar-chat-item ${s.id === activeSessionId ? "active" : ""}`}
                  onClick={() => onSelectSession(s.id)}
                >
                  <div className="sidebar-chat-title">{s.title}</div>
                  <div className="sidebar-chat-time">{formatTime(s.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <DocumentsPanel />
        </div>
      )}

      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="sidebar-stat">
            <span className="sidebar-stat-label">Chunks</span>
            <span className="sidebar-stat-value">{health?.total_chunks ?? "—"}</span>
          </div>
          <div className="sidebar-stat">
            <span className="sidebar-stat-label">Documents</span>
            <span className="sidebar-stat-value">{health?.total_documents ?? "—"}</span>
          </div>
          <div className="sidebar-stat">
            <span className="sidebar-stat-label">Status</span>
            <span className="sidebar-stat-value">
              {health?.status === "ok" ? "● Online" : "● Offline"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
