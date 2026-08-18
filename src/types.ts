export type Confidence = "High" | "Medium" | "Low" | "Insufficient Evidence";
export type RetrievalMethod = "semantic" | "bm25" | "hybrid";

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
  confidence: Confidence;
  disclaimer: string;
  refusal_reason?: string | null;
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
  method: RetrievalMethod | string;
  k: number;
  refusal: boolean;
  pipeline: string[];
  request_id: string;
  conversation_id?: string;
  message_id?: string;
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

export interface DocumentInfo {
  name: string;
  publisher: string;
  source_url: string;
  chunk_count: number;
  page_count: number;
}

export type DocumentStatus = "uploaded" | "queued" | "ingesting" | "ready" | "failed";

export interface Project {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  filename: string;
  status: DocumentStatus;
  size_bytes: number;
  content_type: string;
  created_at: string;
  updated_at: string;
  ingested_at?: string | null;
  job_id?: string | null;
  chunk_count: number;
  error?: string | null;
}

export interface Job {
  id: string;
  type: string;
  status: "queued" | "running" | "succeeded" | "failed";
  project_id?: string | null;
  document_id?: string | null;
  created_at: string;
  updated_at: string;
  result?: Record<string, unknown> | null;
  error?: string | null;
}

export interface RetrieveResponse {
  query: string;
  method: string;
  k: number;
  evidence: EvidenceChunk[];
  safety_threshold: number;
  max_similarity: number;
  safe_to_generate: boolean;
}

export interface EvaluationResponse {
  query: string;
  citation_precision: number;
  citation_recall?: number | null;
  grounded: boolean;
  notes: string[];
}

export interface HealthResponse {
  status: string;
  topic: string;
  total_chunks: number;
  total_documents: number;
  embedding_backend: string;
  index_loaded: boolean;
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
