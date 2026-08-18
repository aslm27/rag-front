/* ═══════════════════════════════════════════════════════════════════
   API Client for the Clinical Evidence RAG Backend
   ═══════════════════════════════════════════════════════════════════ */
import type { AuthResponse, ChatResponse, DocumentInfo, HealthResponse, UserProfile } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || "http://localhost:8000";
const AUTH_TOKEN_STORAGE_KEY = "auth_token";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function sendChat(
  query: string,
  k: number = 5,
  method: string = "hybrid"
): Promise<ChatResponse> {
  return request<ChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ query, k, method }),
  });
}

export async function getDocuments(): Promise<DocumentInfo[]> {
  return request<DocumentInfo[]>("/api/documents");
}

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/api/health");
}

export async function uploadPDF(file: File): Promise<{ status: string; file: string; uploaded_by: string; total_chunks: number; total_documents: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Upload failed: ${res.status}`);
  }
  return res.json();
}

export async function register(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      full_name: fullName?.trim() || null,
    }),
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

export { AUTH_TOKEN_STORAGE_KEY };
