import { useEffect, useState, useRef } from "react";
import { getDocuments, uploadPDF } from "../api";
import type { DocumentInfo } from "../types";
import { FileText, Building, BookOpen, Layers, Plus } from "./Icons";

export default function DocumentsPanel() {
  const [docs, setDocs] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = () => {
    getDocuments()
      .then(setDocs)
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadStatus("Only PDF files are supported");
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const res = await uploadPDF(file);
      setUploadStatus(`Ingested ${res.total_chunks} chunks`);
      fetchDocs();
    } catch (err) {
      setUploadStatus(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  return (
    <div className="documents-panel">
      {/* Upload button */}
      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          style={{ display: "none" }}
          id="pdf-upload"
        />
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <span className="upload-spinner" />
          ) : (
            <Plus size={14} />
          )}
          {uploading ? "Processing…" : "Upload PDF"}
        </button>
        {uploadStatus && (
          <div className="upload-status">{uploadStatus}</div>
        )}
      </div>

      {/* Documents list */}
      {loading ? (
        <div style={{ color: "#9ca3af", fontSize: 13, padding: "12px 0" }}>
          Loading documents…
        </div>
      ) : docs.length === 0 ? (
        <div className="empty-docs">
          <FileText size={28} color="#d1d5db" />
          <span>No documents ingested yet</span>
          <span className="empty-docs-hint">Upload a PDF to get started</span>
        </div>
      ) : (
        <div className="documents-grid">
          {docs.map((doc) => (
            <div key={doc.name} className="document-card">
              <div className="document-name" title={doc.name}>
                <FileText size={13} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
                {doc.name}
              </div>
              <div className="document-meta">
                <span>
                  <Building size={11} style={{ verticalAlign: -2 }} /> {doc.publisher}
                </span>
                <span>
                  <BookOpen size={11} style={{ verticalAlign: -2 }} /> {doc.page_count} pages
                </span>
                <span>
                  <Layers size={11} style={{ verticalAlign: -2 }} /> {doc.chunk_count} chunks
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
