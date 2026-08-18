/* ═══════════════════════════════════════════════════════════════════
   Types for the Clinical Evidence RAG Dashboard
   ═══════════════════════════════════════════════════════════════════ */

export interface Citation {
  document_name: string;
  section_title: string;
  page_number: number;
  chunk_id: string;
  source_url: string;
  quote: string;
}

export interface GroundedAnswer {
  recommendation: string;
  supporting_evidence: string[];
  citations: Citation[];
  confidence: "High" | "Medium" | "Low" | "Insufficient Evidence";
  disclaimer: string;
  refusal_reason: string | null;
}

export interface EvidenceChunk {
  chunk_id: string;
  document_name: string;
  publisher: string;
  source_url: string;
  page_number: number;
  section_title: string;
  text: string;
  similarity_score: number;
}

export interface ChatResponse {
  answer: GroundedAnswer;
  evidence: EvidenceChunk[];
  query: string;
  method: string;
  k: number;
}

export interface DocumentInfo {
  name: string;
  publisher: string;
  source_url: string;
  chunk_count: number;
  page_count: number;
}

export interface HealthResponse {
  status: string;
  topic: string;
  total_chunks: number;
  total_documents: number;
  embedding_backend: string;
  index_loaded: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  answer?: GroundedAnswer;
  evidence?: EvidenceChunk[];
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
