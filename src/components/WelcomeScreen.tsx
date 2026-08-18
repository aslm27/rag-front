import { useState, useRef, useEffect } from "react";
import { Microscope, ArrowUp, Dna, Pill, BarChart, Brain, HeartPulse, Activity } from "./Icons";

interface WelcomeScreenProps {
  onSend: (query: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  { icon: <Dna size={15} />, label: "Low-carb & T2D remission" },
  { icon: <Activity size={15} />, label: "Fasting & insulin resistance" },
  { icon: <Pill size={15} />, label: "Obesity pharmacotherapy" },
  { icon: <BarChart size={15} />, label: "Low-carb vs low-fat diets" },
  { icon: <Brain size={15} />, label: "Fasting gluconeogenesis" },
  { icon: <HeartPulse size={15} />, label: "Weight loss & metabolic syndrome" },
];

const FULL_QUERIES: Record<string, string> = {
  "Low-carb & T2D remission": "What is the role of low-carbohydrate diets in type 2 diabetes remission?",
  "Fasting & insulin resistance": "How does intermittent fasting affect insulin resistance?",
  "Obesity pharmacotherapy": "What are the first-line pharmacotherapy options for obesity in diabetes?",
  "Low-carb vs low-fat diets": "Compare low-carb vs low-fat diets for glycemic control",
  "Fasting gluconeogenesis": "What role does gluconeogenesis play in fasting metabolism?",
  "Weight loss & metabolic syndrome": "How does weight loss affect metabolic syndrome markers?",
};

export default function WelcomeScreen({ onSend, disabled }: WelcomeScreenProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "24px";
      el.style.height = Math.min(el.scrollHeight, 100) + "px";
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
    <div className="welcome-container">
      <h1 className="welcome-title">What clinical question can I help with?</h1>

      <div className="welcome-input-card">
        <div className="welcome-input-top">
          <textarea
            ref={textareaRef}
            className="welcome-textarea"
            placeholder="Ask about metabolic health, insulin resistance, therapeutic nutrition…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
        </div>
        <div className="welcome-input-bottom">
          <div className="welcome-input-actions">
            <span className="method-selector">
              <Microscope size={14} />
              <select defaultValue="hybrid">
                <option value="hybrid">Hybrid Search</option>
                <option value="semantic">Semantic</option>
                <option value="bm25">BM25 Keyword</option>
              </select>
            </span>
          </div>
          <button
            className="welcome-send-btn"
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            title="Send"
          >
            <ArrowUp size={16} color="#fff" />
          </button>
        </div>
      </div>

      <div className="suggestions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            className="suggestion-pill"
            onClick={() => onSend(FULL_QUERIES[s.label] || s.label)}
          >
            <span className="suggestion-pill-icon">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
