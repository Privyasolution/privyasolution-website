"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  Plus,
  Trash2,
  Save,
} from "lucide-react";

import toast from "react-hot-toast";

type Stat = {
  id: string;
  page: string;
  value: string;
  label: string;
  sort_order: number;
};

const PAGE_OPTIONS = [
  "global",
  "home",
  "about",
  "contact",
  "other-services",
];

export default function AdminStats({
  apiBase,
  fixedPage,
}: {
  apiBase: string;
  fixedPage?: string; // when set, locks to this page and hides the page selector
}) {
  const [items, setItems] =
    useState<Stat[]>(
      []
    );

  const [page, setPage] =
    useState(fixedPage ?? "global");

  const [
    editing,
    setEditing,
  ] = useState<
    Partial<Stat> | null
  >(null);

  const [isNew, setIsNew] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // No token required
  const headers = {
    "Content-Type":
      "application/json",
  };

  // Load Stats
  const load = useCallback(
    async () => {
      try {
        const r = await fetch(
          `${apiBase}/api/cms/stats?page=${page}`,
          {
            headers,
          }
        );

        if (!r.ok) {
          throw new Error(
            "Failed to load stats"
          );
        }

        const d = await r.json();

        setItems(
          d.stats || []
        );
      } catch {
        toast.error(
          "Failed to load stats"
        );
      }
    },
    [apiBase, page]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Save Stat
  const save = async () => {
    if (!editing) return;

    setSaving(true);

    try {
      if (isNew) {
        const r =
          await fetch(
            `${apiBase}/api/cms/stats`,
            {
              method:
                "POST",

              headers,

              body: JSON.stringify(
                {
                  ...editing,
                  page,
                }
              ),
            }
          );

        if (!r.ok) {
          throw new Error(
            "Failed to create stat"
          );
        }

        const d =
          await r.json();

        setItems((prev) => [
          ...prev,
          d.stat,
        ]);
      } else {
        const r =
          await fetch(
            `${apiBase}/api/cms/stats/${editing.id}`,
            {
              method:
                "PATCH",

              headers,

              body: JSON.stringify(
                editing
              ),
            }
          );

        if (!r.ok) {
          throw new Error(
            "Failed to update stat"
          );
        }

        setItems((prev) =>
          prev.map((i) =>
            i.id === editing.id
              ? ({
                  ...i,
                  ...editing,
                } as Stat)
              : i
          )
        );
      }

      toast.success(
        "Saved successfully!"
      );

      setEditing(null);
    } catch {
      toast.error(
        "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Stat
  const del = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this stat?"
      )
    )
      return;

    try {
      const r = await fetch(
        `${apiBase}/api/cms/stats/${id}`,
        {
          method:
            "DELETE",

          headers,
        }
      );

      if (!r.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      setItems((prev) =>
        prev.filter(
          (i) =>
            i.id !== id
        )
      );

      if (
        editing?.id === id
      ) {
        setEditing(null);
      }

      toast.success(
        "Deleted successfully!"
      );
    } catch {
      toast.error(
        "Delete failed"
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Stats List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-brand-navy text-sm">
              {
                items.length
              }{" "}
              Stats
            </span>

            <button
              onClick={() => {
                setEditing({
                  value: "",
                  label: "",
                  sort_order: 0,
                });

                setIsNew(true);
              }}
              className="flex items-center gap-1.5 text-xs btn-primary py-1.5 px-3"
            >
              <Plus
                size={13}
              />
              Add
            </button>
          </div>

          {/* Page Filter — hidden when locked to a specific page */}
          {!fixedPage && (
            <select
              value={page}
              onChange={(e) =>
                setPage(
                  e.target.value
                )
              }
              className="input-field text-xs"
            >
              {PAGE_OPTIONS.map(
                (p) => (
                  <option
                    key={p}
                    value={p}
                  >
                    {p}
                  </option>
                )
              )}
            </select>
          )}
          {fixedPage && (
            <span className="text-xs text-gray-400">
              Page:{" "}
              <strong className="text-brand-navy">
                {fixedPage}
              </strong>
            </span>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {items.length ===
            0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              No stats for
              this page
            </p>
          )}

          {items.map((s) => (
            <div
              key={s.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                editing?.id ===
                s.id
                  ? "bg-brand-light"
                  : ""
              }`}
              onClick={() => {
                setEditing({
                  ...s,
                });

                setIsNew(false);
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-heading font-black gradient-text">
                    {
                      s.value
                    }
                  </p>

                  <p className="text-xs text-gray-500">
                    {
                      s.label
                    }
                  </p>
                </div>

                <button
                  onClick={(
                    e
                  ) => {
                    e.stopPropagation();

                    del(s.id);
                  }}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2
                    size={14}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {editing && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-brand-navy">
            {isNew
              ? "Add Stat"
              : "Edit Stat"}
          </h3>

          {/* Value */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Value *
            </label>

            <input
              type="text"
              value={
                editing.value ||
                ""
              }
              onChange={(
                e
              ) =>
                setEditing(
                  (
                    prev
                  ) => ({
                    ...prev,
                    value:
                      e
                        .target
                        .value,
                  })
                )
              }
              className="input-field"
              placeholder="500+"
            />
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Label *
            </label>

            <input
              type="text"
              value={
                editing.label ||
                ""
              }
              onChange={(
                e
              ) =>
                setEditing(
                  (
                    prev
                  ) => ({
                    ...prev,
                    label:
                      e
                        .target
                        .value,
                  })
                )
              }
              className="input-field"
              placeholder="Installations"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Sort Order
            </label>

            <input
              type="number"
              value={
                editing.sort_order ??
                0
              }
              onChange={(
                e
              ) =>
                setEditing(
                  (
                    prev
                  ) => ({
                    ...prev,
                    sort_order:
                      Number(
                        e
                          .target
                          .value
                      ),
                  })
                )
              }
              className="input-field"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={
                saving
              }
              className="btn-primary flex-1 justify-center"
            >
              <Save
                size={14}
              />

              {saving
                ? "Saving..."
                : "Save"}
            </button>

            <button
              onClick={() =>
                setEditing(
                  null
                )
              }
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