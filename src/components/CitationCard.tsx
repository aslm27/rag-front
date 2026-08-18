import { useState } from "react";
import type { Citation } from "../types";
import { ChevronDown, ChevronUp, ExternalLink } from "./Icons";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export default function CitationCard({ citation, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`citation-card ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="citation-header">
        <span className="citation-doc-name">
          [{index + 1}] {citation.document_name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="citation-meta">
            p.{citation.page_number} · {citation.section_title}
          </span>
          <span className="citation-chevron">
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </span>
        </div>
      </div>
      {citation.quote && (
        <div className="citation-quote">"{citation.quote}"</div>
      )}
      {expanded && citation.source_url && (
        <a
          href={citation.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="citation-link"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={11} style={{ display: "inline", verticalAlign: -2, marginRight: 3 }} />
          {citation.source_url}
        </a>
      )}
    </div>
  );
}
