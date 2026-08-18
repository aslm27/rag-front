import type {
  AuthResponse,
  ChatResponse,
  DocumentInfo,
  EvaluationResponse,
  EvaluationResponse as EvaluationResult,
  HealthResponse,
  Job,
  Project,
  ProjectDocument,
  RetrieveResponse,
  RetrievalMethod,
  UserProfile,
} from "./types";

export const AUTH_TOKEN_STORAGE_KEY = "auth_token";
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8000").replace(/\/$/, "");
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined;

function headersFor(options?: RequestInit): HeadersInit {
  const headers = new Headers(options?.headers);
  if (!(options?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (API_KEY) headers.set("X-API-Key", API_KEY);
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: headersFor(options) });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function conversationStorageKey(): string {
  return "rag.conversation_id";
}

function getConversationId(): string {
  const existing = localStorage.getItem(conversationStorageKey());
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(conversationStorageKey(), id);
  return id;
}

export async function sendChat(
  query: string,
  k = 5,
  method: RetrievalMethod = "hybrid",
  projectId?: string,
): Promise<ChatResponse> {
  const conversationId = getConversationId();
  const response = await request<ChatResponse>(`/api/v1/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ query, k, method, project_id: projectId }),
  });
  if (response.conversation_id) localStorage.setItem(conversationStorageKey(), response.conversation_id);
  return response;
}

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

export async function getReady(): Promise<{ status: "ready" | "not_ready"; engine_loaded: boolean; index_loaded: boolean }> {
  return request("/ready");
}

export async function createProject(name: string, description = ""): Promise<Project> {
  return request<Project>("/api/v1/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function listProjects(): Promise<Project[]> {
  return request<Project[]>("/api/v1/projects");
}

export async function uploadProjectDocument(projectId: string, file: File): Promise<{ document: ProjectDocument }> {
  const form = new FormData();
  form.append("file", file);
  return request<{ document: ProjectDocument }>(`/api/v1/projects/${projectId}/documents`, {
    method: "POST",
    body: form,
  });
}

export async function listProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
  return request<ProjectDocument[]>(`/api/v1/projects/${projectId}/documents`);
}

export async function ingestDocument(documentId: string): Promise<{ document_id: string; job_id: string; status: Job["status"] }> {
  return request(`/api/v1/documents/${documentId}/ingest`, { method: "POST" });
}

export async function getDocumentStatus(documentId: string): Promise<ProjectDocument> {
  return request<ProjectDocument>(`/api/v1/documents/${documentId}/status`);
}

export async function getJob(jobId: string): Promise<Job> {
  return request<Job>(`/api/v1/jobs/${jobId}`);
}

export async function retrieve(projectId: string, query: string, k = 5, method: RetrievalMethod = "hybrid"): Promise<RetrieveResponse> {
  return request<RetrieveResponse>(`/api/v1/projects/${projectId}/retrieve`, {
    method: "POST",
    body: JSON.stringify({ query, k, method }),
  });
}

export async function evaluate(projectId: string, query: string, answer?: ChatResponse["answer"], expectedChunkIds: string[] = []): Promise<EvaluationResult> {
  return request<EvaluationResponse>(`/api/v1/projects/${projectId}/evaluations`, {
    method: "POST",
    body: JSON.stringify({ query, answer, expected_chunk_ids: expectedChunkIds }),
  });
}

// Compatibility helpers used by the existing dashboard.
export async function register(email: string, password: string, fullName?: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName?.trim() || null }),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(): Promise<UserProfile> {
  return request<UserProfile>("/auth/me");
}

export async function getDocuments(): Promise<DocumentInfo[]> {
  return request<DocumentInfo[]>("/api/documents");
}

export async function uploadPDF(file: File): Promise<{ status: string; file: string; total_chunks: number; total_documents?: number }> {
  const formData = new FormData();
  formData.append("file", file);
  return request("/api/upload", { method: "POST", body: formData });
}
