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
  Star,
} from "lucide-react";

import toast from "react-hot-toast";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  sort_order: number;
};

const empty = (): Omit<
  Testimonial,
  "id"
> => ({
  quote: "",
  author: "",
  role: "",
  company: "",
  rating: 5,
  sort_order: 0,
});

export default function AdminTestimonials({
  apiBase,
}: {
  apiBase: string;
}) {
  const [items, setItems] =
    useState<Testimonial[]>(
      []
    );

  const [editing, setEditing] =
    useState<
      Partial<Testimonial> | null
    >(null);

  const [isNew, setIsNew] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // No token needed now
  const headers = {
    "Content-Type":
      "application/json",
  };

  // Load Testimonials
  const load = useCallback(
    async () => {
      setLoading(true);

      try {
        const r = await fetch(
          `${apiBase}/api/cms/testimonials`,
          {
            headers,
          }
        );

        if (!r.ok) {
          throw new Error(
            "Failed to load testimonials"
          );
        }

        const d = await r.json();

        setItems(
          d.testimonials || []
        );
      } catch {
        toast.error(
          "Failed to load testimonials"
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

  // Save Testimonial
  const save = async () => {
    if (!editing) return;

    setSaving(true);

    try {
      if (isNew) {
        // Create
        const r = await fetch(
          `${apiBase}/api/cms/testimonials`,
          {
            method: "POST",

            headers,

            body: JSON.stringify(
              editing
            ),
          }
        );

        if (!r.ok) {
          throw new Error(
            "Create failed"
          );
        }

        const d = await r.json();

        setItems((prev) => [
          ...prev,
          d.testimonial,
        ]);
      } else {
        // Update
        const r = await fetch(
          `${apiBase}/api/cms/testimonials/${editing.id}`,
          {
            method: "PATCH",

            headers,

            body: JSON.stringify(
              editing
            ),
          }
        );

        if (!r.ok) {
          throw new Error(
            "Update failed"
          );
        }

        setItems((prev) =>
          prev.map((i) =>
            i.id === editing.id
              ? ({
                  ...i,
                  ...editing,
                } as Testimonial)
              : i
          )
        );
      }

      toast.success("Saved!");

      setEditing(null);

      setIsNew(false);
    } catch {
      toast.error(
        "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Testimonial
  const del = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this testimonial?"
      )
    )
      return;

    try {
      const r = await fetch(
        `${apiBase}/api/cms/testimonials/${id}`,
        {
          method: "DELETE",
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
          (i) => i.id !== id
        )
      );

      if (
        editing?.id === id
      ) {
        setEditing(null);
      }

      toast.success(
        "Deleted"
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
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-heading font-semibold text-brand-navy text-sm">
            {
              items.length
            }{" "}
            Testimonials
          </span>

          <button
            onClick={() => {
              setEditing(
                empty()
              );

              setIsNew(true);
            }}
            className="flex items-center gap-1.5 text-xs btn-primary py-1.5 px-3"
          >
            <Plus size={13} />
            Add
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400 text-sm py-8">
            Loading
            testimonials...
          </p>
        )}

        {/* Empty */}
        {!loading &&
          items.length ===
            0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              No
              testimonials
              found
            </p>
          )}

        {/* Items */}
        {!loading && (
          <div className="divide-y divide-gray-50">
            {items.map(
              (t) => (
                <div
                  key={
                    t.id
                  }
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${
                    editing?.id ===
                    t.id
                      ? "bg-brand-light"
                      : ""
                  }`}
                  onClick={() => {
                    setEditing(
                      {
                        ...t,
                      }
                    );

                    setIsNew(
                      false
                    );
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {/* Author */}
                      <p className="text-sm font-semibold text-brand-navy truncate">
                        {
                          t.author
                        }
                      </p>

                      {/* Role */}
                      <p className="text-xs text-gray-400 truncate">
                        {
                          t.role
                        }{" "}
                        ·{" "}
                        {
                          t.company
                        }
                      </p>

                      {/* Quote */}
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        "
                        {
                          t.quote
                        }
                        "
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        del(
                          t.id
                        );
                      }}
                      className="text-red-400 hover:text-red-600 flex-shrink-0 p-1"
                    >
                      <Trash2
                        size={
                          14
                        }
                      />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-0.5 mt-2">
                    {Array.from(
                      {
                        length:
                          t.rating,
                      }
                    ).map(
                      (
                        _,
                        i
                      ) => (
                        <Star
                          key={
                            i
                          }
                          size={
                            10
                          }
                          className="text-brand-cyan fill-brand-cyan"
                        />
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Editor */}
      {editing && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-brand-navy">
            {isNew
              ? "Add Testimonial"
              : "Edit Testimonial"}
          </h3>

          {[
            {
              key: "quote",
              label:
                "Quote *",
              long: true,
            },

            {
              key: "author",
              label:
                "Author *",
            },

            {
              key: "role",
              label:
                "Role",
            },

            {
              key: "company",
              label:
                "Company",
            },
          ].map(
            ({
              key,
              label,
              long,
            }) => (
              <div
                key={key}
              >
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {label}
                </label>

                {long ? (
                  <textarea
                    rows={
                      3
                    }
                    value={
                      (
                        editing as Record<
                          string,
                          string
                        >
                      )[key] ||
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
                          [key]:
                            e
                              .target
                              .value,
                        })
                      )
                    }
                    className="input-field resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      (
                        editing as Record<
                          string,
                          string
                        >
                      )[key] ||
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
                          [key]:
                            e
                              .target
                              .value,
                        })
                      )
                    }
                    className="input-field"
                  />
                )}
              </div>
            )
          )}

          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Rating
            </label>

            <select
              value={
                editing.rating ||
                5
              }
              onChange={(
                e
              ) =>
                setEditing(
                  (
                    prev
                  ) => ({
                    ...prev,
                    rating:
                      Number(
                        e
                          .target
                          .value
                      ),
                  })
                )
              }
              className="input-field"
            >
              {[
                5, 4, 3,
                2, 1,
              ].map((n) => (
                <option
                  key={n}
                  value={n}
                >
                  {n} Stars
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={
                saving
              }
              className="btn-primary flex-1 justify-center"
            >
              <Save size={14} />

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