"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  Save,
  CheckCircle2,
} from "lucide-react";

import toast from "react-hot-toast";

type Settings = Record<
  string,
  {
    value: string;
    label: string;
  }
>;

const GROUPS = [
  {
    title: "Company Info",
    keys: [
      "company_name",
      "tagline",
      "phone",
      "email",
      "address",
      "whatsapp",
    ],
  },

  {
    title: "Social Links",
    keys: [
      "linkedin",
      "facebook",
      "youtube",
    ],
  },

  {
    title: "Other",
    keys: ["brochure_url"],
  },
];

export default function AdminSettings({
  apiBase,
}: {
  apiBase: string;
}) {
  const [settings, setSettings] =
    useState<Settings>({});

  const [dirty, setDirty] =
    useState<
      Record<string, string>
    >({});

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // No token required now
  const headers = {
    "Content-Type":
      "application/json",
  };

  // Load settings
  const load = useCallback(
    async () => {
      setLoading(true);

      try {
        const r = await fetch(
          `${apiBase}/api/cms/settings`,
          {
            headers,
          }
        );

        if (!r.ok) {
          throw new Error(
            "Failed to load settings"
          );
        }

        const d = await r.json();

        setSettings(
          d.settings || {}
        );
      } catch {
        toast.error(
          "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    },
    [apiBase]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Handle input changes
  const handleChange = (
    key: string,
    value: string
  ) => {
    setDirty((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save settings
  const save = async () => {
    if (
      Object.keys(dirty)
        .length === 0
    )
      return;

    setSaving(true);

    try {
      const r = await fetch(
        `${apiBase}/api/cms/settings`,
        {
          method: "PATCH",

          headers,

          body: JSON.stringify(
            dirty
          ),
        }
      );

      if (r.ok) {
        toast.success(
          "Settings saved!"
        );

        setSettings((prev) => {
          const updated = {
            ...prev,
          };

          Object.entries(
            dirty
          ).forEach(
            ([k, v]) => {
              updated[k] = {
                ...updated[k],
                value: v,
              };
            }
          );

          return updated;
        });

        setDirty({});
      } else {
        toast.error(
          "Save failed"
        );
      }
    } catch {
      toast.error(
        "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // Get current value
  const getValue = (
    key: string
  ) =>
    dirty[key] !== undefined
      ? dirty[key]
      : settings[key]?.value ||
        "";

  // Loading UI
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-16">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {GROUPS.map((group) => (
        <div
          key={group.title}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          {/* Group Title */}
          <h3 className="font-heading font-semibold text-brand-navy mb-5 pb-3 border-b border-gray-100">
            {group.title}
          </h3>

          {/* Fields */}
          <div className="space-y-4">
            {group.keys.map(
              (key) => {
                const label =
                  settings[key]
                    ?.label ||
                  key;

                const value =
                  getValue(
                    key
                  );

                const isLong =
                  key ===
                    "address" ||
                  key ===
                    "tagline";

                return (
                  <div
                    key={key}
                  >
                    {/* Label */}
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      {label}
                    </label>

                    {/* Textarea */}
                    {isLong ? (
                      <textarea
                        value={
                          value
                        }
                        onChange={(
                          e
                        ) =>
                          handleChange(
                            key,
                            e.target
                              .value
                          )
                        }
                        rows={
                          3
                        }
                        className="input-field resize-none"
                      />
                    ) : (
                      // Input
                      <input
                        type="text"
                        value={
                          value
                        }
                        onChange={(
                          e
                        ) =>
                          handleChange(
                            key,
                            e.target
                              .value
                          )
                        }
                        className="input-field"
                      />
                    )}

                    {/* Unsaved */}
                    {dirty[
                      key
                    ] !==
                      undefined && (
                      <p className="text-xs text-brand-cyan mt-1 flex items-center gap-1">
                        <CheckCircle2
                          size={
                            11
                          }
                        />
                        Unsaved
                        change
                      </p>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <button
        onClick={save}
        disabled={
          saving ||
          Object.keys(dirty)
            .length === 0
        }
        className="btn-primary disabled:opacity-50"
      >
        <Save size={15} />

        {saving
          ? "Saving..."
          : `Save Changes${
              Object.keys(
                dirty
              ).length > 0
                ? ` (${Object.keys(dirty).length})`
                : ""
            }`}
      </button>
    </div>
  );
}