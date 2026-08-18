import type { Message } from "../types";
import ConfidenceBadge from "./ConfidenceBadge";
import CitationCard from "./CitationCard";
import { User, Sparkles, AlertTriangle, Stethoscope } from "./Icons";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className="message">
      <div className="message-header">
        <div className={`message-avatar ${message.role}`}>
          {isUser ? <User size={13} /> : <Sparkles size={13} />}
        </div>
        <span className="message-role">
          {isUser ? "You" : "ClinicalRAG"}
        </span>
      </div>

      {message.isLoading ? (
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
      ) : isUser ? (
        <div className="message-content">
          <p>{message.content}</p>
        </div>
      ) : (
        <>
          {message.answer?.recommendation && (
            <div className="message-content">
              <p>{message.answer.recommendation}</p>
            </div>
          )}

          {!message.answer?.recommendation && message.content && (
            <div className="message-content">
              <p>{message.content}</p>
            </div>
          )}

          {message.answer && (
            <div className="ai-answer-card">
              <div className="ai-answer-header">
                <span className="ai-answer-title">Evidence Summary</span>
                <ConfidenceBadge confidence={message.answer.confidence} />
              </div>

              <div className="ai-answer-body">
                {message.answer.refusal_reason && (
                  <div className="refusal-text">
                    <AlertTriangle size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
                    {message.answer.refusal_reason}
                  </div>
                )}

                {message.answer.supporting_evidence.length > 0 && (
                  <ul className="evidence-list">
                    {message.answer.supporting_evidence.map((ev, i) => (
                      <li key={i} className="evidence-item">{ev}</li>
                    ))}
                  </ul>
                )}

                {message.answer.citations.length > 0 && (
                  <div className="citations-section">
                    <div className="citations-title">
                      Sources ({message.answer.citations.length})
                    </div>
                    <div className="citations-grid">
                      {message.answer.citations.map((c, i) => (
                        <CitationCard key={c.chunk_id || i} citation={c} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="disclaimer-text">
                  <Stethoscope size={13} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
                  {message.answer.disclaimer}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
