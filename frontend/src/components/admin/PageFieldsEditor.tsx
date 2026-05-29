"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";

export type FieldDef = {
  key: string;
  label: string;
  long?: boolean;
  image?: boolean;   // renders ImageUploader instead of text input
  hint?: string;
  maxLength?: number;
};

export type SectionDef = {
  section: string;
  label: string;
  fields: FieldDef[];
};

type Props = {
  apiBase: string;
  page: string;
  sections: SectionDef[];
};

export default function PageFieldsEditor({ apiBase, page, sections }: Props) {
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [dirty, setDirty]     = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]   = useState(false);

  const headers = { "Content-Type": "application/json" };

  const load = useCallback(async () => {
    setLoading(true);
    setDirty({});
    try {
      const r = await fetch(`${apiBase}/api/cms/pages/${page}`, { headers });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setContent(d.content || {});
    } catch {
      toast.error("Failed to load page content");
    } finally {
      setLoading(false);
    }
  }, [apiBase, page]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (section: string, field: string, value: string) => {
    setDirty((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const getValue = (section: string, field: string): string =>
    dirty[section]?.[field] !== undefined
      ? dirty[section][field]
      : content[section]?.[field] || "";

  // Batch save — single request instead of N parallel requests
  const save = async () => {
    const changes = Object.entries(dirty).flatMap(([section, fields]) =>
      Object.entries(fields).map(([field, value]) => ({ section, field, value }))
    );
    if (changes.length === 0) return;

    setSaving(true);
    try {
      const r = await fetch(`${apiBase}/api/cms/pages/${page}/batch`, {
        method: "POST",
        headers,
        body: JSON.stringify({ changes }),
      });
      if (!r.ok) throw new Error();
      toast.success(`Saved ${changes.length} field(s)`);
      setContent((prev) => {
        const updated = { ...prev };
        Object.entries(dirty).forEach(([section, fields]) => {
          updated[section] = { ...(updated[section] || {}), ...fields };
        });
        return updated;
      });
      setDirty({});
    } catch {
      // Fall back to legacy single-field saves if batch endpoint not available
      try {
        await Promise.all(
          changes.map((e) =>
            fetch(`${apiBase}/api/cms/pages/${page}`, {
              method: "PATCH",
              headers,
              body: JSON.stringify(e),
            })
          )
        );
        toast.success(`Saved ${changes.length} field(s)`);
        setContent((prev) => {
          const updated = { ...prev };
          Object.entries(dirty).forEach(([section, fields]) => {
            updated[section] = { ...(updated[section] || {}), ...fields };
          });
          return updated;
        });
        setDirty({});
      } catch {
        toast.error("Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const totalDirty = Object.values(dirty).reduce((acc, f) => acc + Object.keys(f).length, 0);

  if (loading) {
    return <div className="text-center text-gray-400 py-16 text-sm">Loading content...</div>;
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {sections.map(({ section, label, fields }) => (
        <div key={section} className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-heading font-semibold text-brand-navy mb-5 pb-3 border-b border-gray-100">
            {label}
          </h3>
          <div className="space-y-4">
            {fields.map(({ key, label: fieldLabel, long, image, hint, maxLength }) => {
              const val     = getValue(section, key);
              const isDirty = dirty[section]?.[key] !== undefined;
              const isNearLimit = maxLength && val.length > maxLength * 0.85;
              const isOverLimit = maxLength && val.length > maxLength;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600">
                      {fieldLabel}
                    </label>
                    {maxLength && !image && (
                      <span className={`text-[11px] ${isOverLimit ? "text-red-500 font-semibold" : isNearLimit ? "text-orange-400" : "text-gray-300"}`}>
                        {val.length}/{maxLength}
                      </span>
                    )}
                  </div>

                  {image ? (
                    <ImageUploader
                      value={val}
                      onChange={(url) => handleChange(section, key, url)}
                      apiBase={apiBase}
                      hint={hint}
                    />
                  ) : long ? (
                    <textarea
                      rows={3}
                      value={val}
                      maxLength={maxLength}
                      onChange={(e) => handleChange(section, key, e.target.value)}
                      className={`input-field resize-none ${isOverLimit ? "border-red-300 focus:border-red-400" : ""}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={val}
                      maxLength={maxLength}
                      onChange={(e) => handleChange(section, key, e.target.value)}
                      className={`input-field ${isOverLimit ? "border-red-300 focus:border-red-400" : ""}`}
                    />
                  )}

                  {!image && hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
                  {isDirty && (
                    <p className="text-xs text-brand-cyan mt-1 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Unsaved change
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving || totalDirty === 0}
        className="btn-primary disabled:opacity-50"
      >
        <Save size={15} />
        {saving ? "Saving..." : `Save Changes${totalDirty > 0 ? ` (${totalDirty})` : ""}`}
      </button>
    </div>
  );
}
