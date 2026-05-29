"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "./ImageUploader";

type CatalogService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  badge: string;
  image_url: string;
  specs: string;
  published: boolean;
  sort_order: number;
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-brand-cyan" : "bg-gray-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  );
}

export default function AdminCatalogServices({ apiBase }: { apiBase: string }) {
  const [items, setItems]     = useState<CatalogService[]>([]);
  const [editing, setEditing] = useState<Partial<CatalogService> | null>(null);
  const [isNew, setIsNew]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(false);

  const headers = { "Content-Type": "application/json" };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/api/cms/services?catalog=true`, { headers });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setItems(d.services || []);
    } catch {
      toast.error("Failed to load catalog services");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { toast.error("Title is required"); return; }
    if (!editing.slug?.trim())  { toast.error("Slug is required"); return; }

    setSaving(true);
    try {
      const payload = {
        ...editing,
        has_page:         false,
        show_on_homepage: false,
        show_in_menu:     false,
        published:        editing.published ?? true,
      };

      if (isNew) {
        const r = await fetch(`${apiBase}/api/cms/services`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error();
        const d = await r.json();
        setItems((prev) => [...prev, d.service]);
      } else {
        const r = await fetch(`${apiBase}/api/cms/services/${editing.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error();
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? ({ ...i, ...editing } as CatalogService) : i))
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

  const del = async (id: string) => {
    if (!confirm("Delete this service card? This cannot be undone.")) return;
    try {
      const r = await fetch(`${apiBase}/api/cms/services/${id}`, { method: "DELETE", headers });
      if (!r.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editing?.id === id) setEditing(null);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const setField = <K extends keyof CatalogService>(key: K, value: CatalogService[K]) =>
    setEditing((prev) => ({ ...prev, [key]: value }));

  const startNew = () => {
    setEditing({
      slug: "", title: "", description: "", badge: "",
      image_url: "", specs: "", sort_order: 0, published: true,
    });
    setIsNew(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-heading font-semibold text-brand-navy text-sm">
            {items.length} Service Card{items.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 text-xs btn-primary py-1.5 px-3"
          >
            <Plus size={13} /> Add Card
          </button>
        </div>

        {loading && <p className="text-center text-gray-400 text-sm py-8">Loading...</p>}

        {!loading && (
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {items.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">No catalog services yet. Add one!</p>
            )}
            {items.map((s) => (
              <div
                key={s.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${editing?.id === s.id ? "bg-brand-light" : ""}`}
                onClick={() => { setEditing({ ...s }); setIsNew(false); }}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {s.image_url && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold truncate ${s.published ? "text-brand-navy" : "text-gray-400"}`}>
                        {s.title}
                      </p>
                      {s.badge && (
                        <span className="badge-cyan text-[10px]">{s.badge}</span>
                      )}
                      {!s.published && (
                        <span className="text-[10px] flex items-center gap-1 text-gray-400">
                          <EyeOff size={9} /> Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">/{s.slug}</p>
                    {s.specs && (
                      <p className="text-[11px] text-gray-300 mt-0.5 truncate">
                        {s.specs.split("|").slice(0, 2).join(" · ")}
                        {s.specs.split("|").length > 2 ? " ···" : ""}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); del(s.id); }}
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

      {/* Edit Form */}
      {editing && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <h3 className="font-heading font-semibold text-brand-navy">
            {isNew ? "Add Service Card" : "Edit Service Card"}
          </h3>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Image</label>
            <ImageUploader
              value={editing.image_url || ""}
              onChange={(url) => setField("image_url", url)}
              apiBase={apiBase}
              hint="Recommended: 800×500px landscape image. Max 5 MB."
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
            <input
              type="text"
              value={editing.title || ""}
              maxLength={120}
              onChange={(e) => setField("title", e.target.value)}
              className="input-field"
              placeholder="e.g. Checkweighers"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL Slug *</label>
            <input
              type="text"
              value={editing.slug || ""}
              onChange={(e) =>
                setField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
              }
              className="input-field font-mono text-sm"
              placeholder="e.g. checkweighers"
            />
            <p className="text-[11px] text-gray-400 mt-1">Lowercase letters, numbers, hyphens only.</p>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Badge (Optional)</label>
            <input
              type="text"
              value={editing.badge || ""}
              maxLength={30}
              onChange={(e) => setField("badge", e.target.value)}
              className="input-field"
              placeholder="e.g. High Speed, Certified"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-600">Description</label>
              <span className={`text-[11px] ${(editing.description?.length || 0) > 425 ? "text-orange-400" : "text-gray-300"}`}>
                {editing.description?.length || 0}/500
              </span>
            </div>
            <textarea
              rows={3}
              value={editing.description || ""}
              maxLength={500}
              onChange={(e) => setField("description", e.target.value)}
              className="input-field resize-none"
              placeholder="Brief description of what this service offers..."
            />
          </div>

          {/* Specs */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Spec Tags (pipe-separated)</label>
            <input
              type="text"
              value={editing.specs || ""}
              onChange={(e) => setField("specs", e.target.value)}
              className="input-field"
              placeholder="e.g. Up to 300 packs/min|±0.1g accuracy|IP65 rated"
            />
            <p className="text-[11px] text-gray-400 mt-1">Separate spec tags with | — shown as small chips on the card.</p>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sort Order</label>
            <input
              type="number"
              value={editing.sort_order ?? 0}
              onChange={(e) => setField("sort_order", Number(e.target.value))}
              className="input-field w-24"
            />
            <p className="text-[11px] text-gray-400 mt-1">Lower numbers appear first.</p>
          </div>

          {/* Visibility toggle */}
          <div className="pt-2 border-t border-gray-100">
            <Toggle
              checked={editing.published ?? true}
              onChange={(v) => setField("published", v)}
              label="Published (visible on website)"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving} className="btn-primary flex-1 justify-center">
              <Save size={14} /> {saving ? "Saving..." : "Save Card"}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn-outline-dark px-4 py-2.5 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
