"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Trash2, Save, Upload, Image as ImageIcon,
  Eye, EyeOff, Link as LinkIcon,
} from "lucide-react";
import toast from "react-hot-toast";

type Client = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  sort_order: number;
  published: boolean;
};

const emptyClient = (): Omit<Client, "id"> => ({
  name: "",
  logo_url: "",
  website_url: "",
  sort_order: 0,
  published: true,
});

export default function AdminClients({ apiBase }: { apiBase: string }) {
  const [items,     setItems]     = useState<Client[]>([]);
  const [editing,   setEditing]   = useState<Partial<Client> | null>(null);
  const [isNew,     setIsNew]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = { "Content-Type": "application/json" };

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/cms/clients`);
      if (!r.ok) throw new Error("Failed");
      const d = await r.json();
      setItems(d.clients || []);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { load(); }, [load]);

  // ── Image upload ──────────────────────────────────────────────────────────
  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const r = await fetch(`${apiBase}/api/cms/media/upload`, { method: "POST", body: fd });
      if (!r.ok) throw new Error("Upload failed");
      const d = await r.json();
      setEditing((prev) => ({ ...prev, logo_url: d.url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Save (create / update) ────────────────────────────────────────────────
  const save = async () => {
    if (!editing) return;
    if (!editing.name?.trim()) { toast.error("Client name is required"); return; }
    setSaving(true);
    try {
      if (isNew) {
        const r = await fetch(`${apiBase}/api/cms/clients`, {
          method: "POST", headers, body: JSON.stringify(editing),
        });
        if (!r.ok) throw new Error("Create failed");
        const d = await r.json();
        setItems((prev) => [...prev, d.client]);
      } else {
        const r = await fetch(`${apiBase}/api/cms/clients/${editing.id}`, {
          method: "PATCH", headers, body: JSON.stringify(editing),
        });
        if (!r.ok) throw new Error("Update failed");
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? ({ ...i, ...editing } as Client) : i))
        );
      }
      toast.success("Saved!");
      setEditing(null);
      setIsNew(false);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const del = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    try {
      const r = await fetch(`${apiBase}/api/cms/clients/${id}`, { method: "DELETE", headers });
      if (!r.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editing?.id === id) setEditing(null);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* ── List ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-heading font-semibold text-brand-navy text-sm">
            {items.length} Clients
          </span>
          <button
            onClick={() => { setEditing(emptyClient()); setIsNew(true); }}
            className="flex items-center gap-1.5 text-xs btn-primary py-1.5 px-3"
          >
            <Plus size={13} /> Add Client
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-400 text-sm py-10">Loading clients…</p>
        )}
        {!loading && items.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">No clients yet — click Add to start.</p>
        )}

        {!loading && (
          <div className="divide-y divide-gray-50">
            {items.map((c) => (
              <div
                key={c.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${editing?.id === c.id ? "bg-brand-light" : ""}`}
                onClick={() => { setEditing({ ...c }); setIsNew(false); }}
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {c.logo_url ? (
                      <img src={c.logo_url} alt={c.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon size={15} className="text-gray-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-brand-navy truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      Order: {c.sort_order}
                      {" · "}
                      <span className={c.published ? "text-green-500" : "text-gray-400"}>
                        {c.published ? "Published" : "Hidden"}
                      </span>
                      {c.website_url && " · Has URL"}
                    </p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); del(c.id); }}
                    className="text-red-400 hover:text-red-600 flex-shrink-0 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Editor ────────────────────────────────────────────────────────── */}
      {editing && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-brand-navy">
            {isNew ? "Add Client" : "Edit Client"}
          </h3>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Client Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={editing.name || ""}
              onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
              className="input-field"
              placeholder="e.g. Emcure Pharmaceuticals"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Logo Image
            </label>

            {/* Preview */}
            {editing.logo_url && (
              <div className="mb-2 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center px-4 overflow-hidden">
                <img
                  src={editing.logo_url}
                  alt="Preview"
                  className="h-full object-contain py-2"
                />
              </div>
            )}

            <input
              type="text"
              value={editing.logo_url || ""}
              onChange={(e) => setEditing((p) => ({ ...p, logo_url: e.target.value }))}
              className="input-field mb-2"
              placeholder="Paste image URL, or upload below"
            />

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-xs btn-outline-dark py-2 px-3 disabled:opacity-50"
            >
              <Upload size={13} />
              {uploading ? "Uploading…" : "Upload Image"}
            </button>
            <p className="text-[10px] text-gray-400 mt-1.5">JPEG, PNG, WebP or GIF · max 5 MB</p>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Website URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={editing.website_url || ""}
                onChange={(e) => setEditing((p) => ({ ...p, website_url: e.target.value }))}
                className="input-field pl-9"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Sort order + Published */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) => setEditing((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Visibility</label>
              <button
                type="button"
                onClick={() => setEditing((p) => ({ ...p, published: !p?.published }))}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                  editing.published
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-gray-300 text-gray-400 bg-gray-50"
                }`}
              >
                {editing.published ? <Eye size={14} /> : <EyeOff size={14} />}
                {editing.published ? "Published" : "Hidden"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="btn-primary flex-1 justify-center disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Saving…" : "Save Client"}
            </button>
            <button
              onClick={() => { setEditing(null); setIsNew(false); }}
              className="btn-outline-dark px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
