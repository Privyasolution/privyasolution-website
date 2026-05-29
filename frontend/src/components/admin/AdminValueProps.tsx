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

type ValueProp = {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  sort_order: number;
};

const ICON_OPTIONS = [
  "ShieldCheck",
  "Zap",
  "BarChart3",
  "Clock",
  "Scale",
  "Truck",
  "FlaskConical",
  "CheckSquare",
  "Star",
  "Award",
];

export default function AdminValueProps({
  apiBase,
}: {
  apiBase: string;
}) {
  const [items, setItems] =
    useState<ValueProp[]>(
      []
    );

  const [
    editing,
    setEditing,
  ] = useState<
    Partial<ValueProp> | null
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

  // Load Value Props
  const load = useCallback(
    async () => {
      try {
        const r = await fetch(
          `${apiBase}/api/cms/value-props`,
          {
            headers,
          }
        );

        if (!r.ok) {
          throw new Error(
            "Failed to load value props"
          );
        }

        const d = await r.json();

        setItems(
          d.valueProps || []
        );
      } catch {
        toast.error(
          "Failed to load value props"
        );
      }
    },
    [apiBase]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Save
  const save = async () => {
    if (!editing) return;

    setSaving(true);

    try {
      if (isNew) {
        const r =
          await fetch(
            `${apiBase}/api/cms/value-props`,
            {
              method:
                "POST",

              headers,

              body: JSON.stringify(
                editing
              ),
            }
          );

        if (!r.ok) {
          throw new Error(
            "Failed to create value prop"
          );
        }

        const d =
          await r.json();

        setItems((prev) => [
          ...prev,
          d.valueProp,
        ]);
      } else {
        const r =
          await fetch(
            `${apiBase}/api/cms/value-props/${editing.id}`,
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
            "Failed to update value prop"
          );
        }

        setItems((prev) =>
          prev.map((i) =>
            i.id === editing.id
              ? ({
                  ...i,
                  ...editing,
                } as ValueProp)
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

  // Delete
  const del = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this value prop?"
      )
    )
      return;

    try {
      const r = await fetch(
        `${apiBase}/api/cms/value-props/${id}`,
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
      {/* List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-heading font-semibold text-brand-navy text-sm">
            {
              items.length
            }{" "}
            Value Props
          </span>

          <button
            onClick={() => {
              setEditing({
                icon_name:
                  "ShieldCheck",
                title: "",
                description:
                  "",
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

        <div className="divide-y divide-gray-50">
          {items.length ===
            0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              No value props
              yet
            </p>
          )}

          {items.map((v) => (
            <div
              key={v.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                editing?.id ===
                v.id
                  ? "bg-brand-light"
                  : ""
              }`}
              onClick={() => {
                setEditing({
                  ...v,
                });

                setIsNew(false);
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy truncate">
                    {
                      v.title
                    }
                  </p>

                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {
                      v.icon_name
                    }{" "}
                    · Order:{" "}
                    {
                      v.sort_order
                    }
                  </p>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {
                      v.description
                    }
                  </p>
                </div>

                <button
                  onClick={(
                    e
                  ) => {
                    e.stopPropagation();

                    del(v.id);
                  }}
                  className="text-red-400 hover:text-red-600 flex-shrink-0 p-1"
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
              ? "Add Value Prop"
              : "Edit Value Prop"}
          </h3>

          {/* Icon */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Icon Name
            </label>

            <select
              value={
                editing.icon_name ||
                "ShieldCheck"
              }
              onChange={(
                e
              ) =>
                setEditing(
                  (
                    prev
                  ) => ({
                    ...prev,
                    icon_name:
                      e
                        .target
                        .value,
                  })
                )
              }
              className="input-field"
            >
              {ICON_OPTIONS.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option
                    }
                    value={
                      option
                    }
                  >
                    {
                      option
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Title *
            </label>

            <input
              type="text"
              value={
                editing.title ||
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
                    title:
                      e
                        .target
                        .value,
                  })
                )
              }
              className="input-field"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Description *
            </label>

            <textarea
              rows={3}
              value={
                editing.description ||
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
                    description:
                      e
                        .target
                        .value,
                  })
                )
              }
              className="input-field resize-none"
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