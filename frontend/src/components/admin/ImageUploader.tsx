"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  apiBase: string;
  hint?: string;
}

export default function ImageUploader({ value, onChange, apiBase, hint }: Props) {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const doUpload = useCallback(async (file: File) => {
    const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    const form = new FormData();
    form.append("image", file);

    try {
      const r = await fetch(`${apiBase}/api/cms/media/upload`, { method: "POST", body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [apiBase, onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  }, [doUpload]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    e.target.value = "";
  };

  // ── Preview state (image already set) ──────────────────────────────────────
  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-white text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <X size={12} /> Remove
            </button>
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

        {uploading && (
          <p className="text-xs text-brand-cyan flex items-center gap-1.5">
            <Loader2 size={11} className="animate-spin" /> Uploading new image…
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <AlertCircle size={11} /> {error}
          </p>
        )}
        {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
      </div>
    );
  }

  // ── Empty state (no image yet) ──────────────────────────────────────────────
  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onKeyDown={(e) => e.key === "Enter" && !uploading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={[
          "relative w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all",
          "flex flex-col items-center justify-center gap-2 text-sm select-none",
          dragging
            ? "border-brand-cyan bg-cyan-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white",
          uploading ? "cursor-wait opacity-60" : "",
        ].join(" ")}
      >
        {uploading ? (
          <>
            <Loader2 size={22} className="text-brand-cyan animate-spin" />
            <span className="text-gray-500 text-xs">Uploading…</span>
          </>
        ) : (
          <>
            <ImageIcon size={22} className={dragging ? "text-brand-cyan" : "text-gray-300"} />
            <span className="text-gray-400 text-xs font-medium">
              {dragging ? "Drop to upload" : "Click to upload or drag & drop"}
            </span>
            <span className="text-gray-300 text-[11px]">PNG, JPG, WebP — max 5 MB</span>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
