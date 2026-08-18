import type { GroundedAnswer } from "../types";

interface ConfidenceBadgeProps {
  confidence: GroundedAnswer["confidence"];
}

const badgeClass: Record<string, string> = {
  High: "high",
  Medium: "medium",
  Low: "low",
  "Insufficient Evidence": "insufficient",
};

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const cls = badgeClass[confidence] || "insufficient";
  return (
    <span className={`confidence-badge ${cls}`}>
      <span className="confidence-dot" />
      {confidence}
    </span>
  );
}
