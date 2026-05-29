"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Trash2, Save, Upload, Image as ImageIcon,
  Eye, EyeOff, Link as LinkIcon, Star,
} from "lucide-react";
import toast from "react-hot-toast";

type LeadershipMember = {
  id: string;
  full_name: string;
  designation: string;
  bio: string;
  profile_image: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  facebook_url: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
};

const emptyMember = (): Omit<LeadershipMember, "id"> => ({
  full_name: "",
  designation: "",
  bio: "",
  profile_image: "",
  linkedin_url: "",
  twitter_url: "",
  instagram_url: "",
  facebook_url: "",
  display_order: 0,
  is_active: true,
  is_featured: false,
});

export default function AdminLeadershipTeam({ apiBase }: { apiBase: string }) {
  const [items,     setItems]     = useState<LeadershipMember[]>([]);
  const [editing,   setEditing]   = useState<Partial<LeadershipMember> | null>(null);
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
      const r = await fetch(`${apiBase}/api/cms/leadership`);
      if (!r.ok) throw new Error("Failed");
      const d = await r.json();
      setItems(d.members || []);
    } catch {
      toast.error("Failed to load leadership members");
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
      setEditing((prev) => ({ ...prev, profile_image: d.url }));
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
    if (!editing.full_name?.trim())  { toast.error("Full name is required");  return; }
    if (!editing.designation?.trim()) { toast.error("Designation is required"); return; }
    setSaving(true);
    try {
      if (isNew) {
        const r = await fetch(`${apiBase}/api/cms/leadership`, {
          method: "POST", headers, body: JSON.stringify(editing),
        });
        if (!r.ok) throw new Error("Create failed");
        const d = await r.json();
        setItems((prev) => [...prev, d.member]);
      } else {
        const r = await fetch(`${apiBase}/api/cms/leadership/${editing.id}`, {
          method: "PATCH", headers, body: JSON.stringify(editing),
        });
        if (!r.ok) throw new Error("Update failed");
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? ({ ...i, ...editing } as LeadershipMember) : i))
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
    if (!confirm("Delete this team member?")) return;
    try {
      const r = await fetch(`${apiBase}/api/cms/leadership/${id}`, { method: "DELETE", headers });
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
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-heading font-semibold text-brand-navy text-sm">
            {items.length} Member{items.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => { setEditing(emptyMember()); setIsNew(true); }}
            className="flex items-center gap-1.5 text-xs btn-primary py-1.5 px-3"
          >
            <Plus size={13} /> Add Member
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
        )}
        {!loading && items.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">No members yet — click Add to start.</p>
        )}

        {!loading && (
          <div className="divide-y divide-gray-50">
            {items.map((m) => (
              <div
                key={m.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${editing?.id === m.id ? "bg-brand-light" : ""}`}
                onClick={() => { setEditing({ ...m }); setIsNew(false); }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {m.profile_image ? (
                      <img src={m.profile_image} alt={m.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-brand-navy font-bold text-sm">
                        {m.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-brand-navy truncate flex items-center gap-1.5">
                      {m.full_name}
                      {m.is_featured && <Star size={11} className="text-brand-cyan fill-brand-cyan flex-shrink-0" />}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {m.designation}
                      {" · "}
                      Order: {m.display_order}
                      {" · "}
                      <span className={m.is_active ? "text-green-500" : "text-gray-400"}>
                        {m.is_active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); del(m.id); }}
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
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <h3 className="font-heading font-semibold text-brand-navy">
            {isNew ? "Add Member" : "Edit Member"}
          </h3>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={editing.full_name || ""}
              onChange={(e) => setEditing((p) => ({ ...p, full_name: e.target.value }))}
              className="input-field"
              placeholder="e.g. Jenin Shah"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Designation <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={editing.designation || ""}
              onChange={(e) => setEditing((p) => ({ ...p, designation: e.target.value }))}
              className="input-field"
              placeholder="e.g. Director"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Bio / Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={editing.bio || ""}
              onChange={(e) => setEditing((p) => ({ ...p, bio: e.target.value }))}
              className="input-field resize-none"
              rows={3}
              placeholder="Short professional bio…"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Profile Image
            </label>

            {editing.profile_image ? (
              <div className="mb-2 w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                <img src={editing.profile_image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="mb-2 w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <ImageIcon size={20} className="text-gray-300" />
              </div>
            )}

            <input
              type="text"
              value={editing.profile_image || ""}
              onChange={(e) => setEditing((p) => ({ ...p, profile_image: e.target.value }))}
              className="input-field mb-2"
              placeholder="Paste image URL, or upload below"
            />

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
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
            <p className="text-[10px] text-gray-400 mt-1.5">JPEG, PNG, WebP · max 5 MB · recommended 400×400px</p>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-600">Social Links <span className="text-gray-400 font-normal">(optional)</span></p>

            {[
              { key: "linkedin_url",  label: "LinkedIn URL",  placeholder: "https://linkedin.com/in/name" },
              { key: "twitter_url",   label: "Twitter / X URL", placeholder: "https://twitter.com/name" },
              { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/name" },
              { key: "facebook_url",  label: "Facebook URL",  placeholder: "https://facebook.com/name" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="relative">
                <label className="block text-[11px] text-gray-500 mb-1">{label}</label>
                <div className="relative">
                  <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={(editing as Record<string, string>)[key] || ""}
                    onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                    className="input-field pl-8 text-xs"
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Display Order + Active + Featured */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={editing.display_order ?? 0}
                onChange={(e) => setEditing((p) => ({ ...p, display_order: Number(e.target.value) }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
              <button
                type="button"
                onClick={() => setEditing((p) => ({ ...p, is_active: !p?.is_active }))}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-medium transition-colors ${
                  editing.is_active
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-gray-300 text-gray-400 bg-gray-50"
                }`}
              >
                {editing.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                {editing.is_active ? "Active" : "Inactive"}
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Featured</label>
              <button
                type="button"
                onClick={() => setEditing((p) => ({ ...p, is_featured: !p?.is_featured }))}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-medium transition-colors ${
                  editing.is_featured
                    ? "border-brand-cyan text-brand-cyan bg-cyan-50"
                    : "border-gray-300 text-gray-400 bg-gray-50"
                }`}
              >
                <Star size={13} className={editing.is_featured ? "fill-brand-cyan" : ""} />
                {editing.is_featured ? "Featured" : "Normal"}
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
              {saving ? "Saving…" : "Save Member"}
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
