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

type FAQ = {
  id: string;
  page: string;
  question: string;
  answer: string;
  sort_order: number;
};

const PAGES = [
  "home",
  "about",
  "contact",
  "single-entry-weighing",
  "double-entry-weighing",
  "pharma-industry-services",
  "other-services",
];

export default function AdminFAQs({
  apiBase,
  fixedPage,
}: {
  apiBase: string;
  fixedPage?: string;
}) {
  const [faqs, setFaqs] =
    useState<FAQ[]>([]);

  const [page, setPage] =
    useState(fixedPage ?? "about");

  const [editing, setEditing] =
    useState<
      Partial<FAQ> | null
    >(null);

  const [isNew, setIsNew] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // No token required now
  const headers = {
    "Content-Type":
      "application/json",
  };

  // Load FAQs
  const load = useCallback(
    async () => {
      setLoading(true);

      try {
        const r = await fetch(
          `${apiBase}/api/cms/faqs?page=${page}`,
          {
            headers,
          }
        );

        if (!r.ok) {
          throw new Error(
            "Failed to load FAQs"
          );
        }

        const d = await r.json();

        setFaqs(
          d.faqs || []
        );
      } catch {
        toast.error(
          "Failed to load FAQs"
        );
      } finally {
        setLoading(false);
      }
    },
    [apiBase, page]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Save FAQ
  const save = async () => {
    if (!editing) return;

    setSaving(true);

    try {
      if (isNew) {
        // Create FAQ
        const r = await fetch(
          `${apiBase}/api/cms/faqs`,
          {
            method: "POST",

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
            "Create failed"
          );
        }

        const d = await r.json();

        setFaqs((prev) => [
          ...prev,
          d.faq,
        ]);
      } else {
        // Update FAQ
        const r = await fetch(
          `${apiBase}/api/cms/faqs/${editing.id}`,
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

        setFaqs((prev) =>
          prev.map((f) =>
            f.id === editing.id
              ? ({
                  ...f,
                  ...editing,
                } as FAQ)
              : f
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

  // Delete FAQ
  const del = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this FAQ?"
      )
    )
      return;

    try {
      const r = await fetch(
        `${apiBase}/api/cms/faqs/${id}`,
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

      setFaqs((prev) =>
        prev.filter(
          (f) => f.id !== id
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
      {/* FAQ List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-brand-navy text-sm">
              {faqs.length} FAQs
            </span>

            <button
              onClick={() => {
                setEditing({
                  question:
                    "",
                  answer:
                    "",
                  sort_order: 0,
                });

                setIsNew(true);
              }}
              className="flex items-center gap-1.5 text-xs btn-primary py-1.5 px-3"
            >
              <Plus size={13} />
              Add
            </button>
          </div>

          {/* Page Select — hidden when fixedPage is set */}
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
              {PAGES.map((p) => (
                <option
                  key={p}
                  value={p}
                >
                  {p}
                </option>
              ))}
            </select>
          )}
          {fixedPage && (
            <p className="text-xs text-gray-400">
              Page: <strong className="text-brand-navy">{fixedPage}</strong>
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400 text-sm py-8">
            Loading FAQs...
          </p>
        )}

        {/* Empty */}
        {!loading &&
          faqs.length ===
            0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              No FAQs for
              this page
            </p>
          )}

        {/* FAQ Items */}
        {!loading && (
          <div className="divide-y divide-gray-50">
            {faqs.map(
              (f) => (
                <div
                  key={
                    f.id
                  }
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors
                  ${
                    editing?.id ===
                    f.id
                      ? "bg-brand-light"
                      : ""
                  }`}
                  onClick={() => {
                    setEditing(
                      {
                        ...f,
                      }
                    );

                    setIsNew(
                      false
                    );
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {/* Question */}
                      <p className="text-sm font-semibold text-brand-navy line-clamp-2">
                        {
                          f.question
                        }
                      </p>

                      {/* Answer */}
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {
                          f.answer
                        }
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        del(
                          f.id
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
              ? "Add FAQ"
              : "Edit FAQ"}
          </h3>

          {/* Question */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Question *
            </label>

            <input
              type="text"
              value={
                editing.question ||
                ""
              }
              onChange={(e) =>
                setEditing(
                  (
                    prev
                  ) => ({
                    ...prev,
                    question:
                      e.target
                        .value,
                  })
                )
              }
              className="input-field"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Answer *
            </label>

            <textarea
              rows={4}
              value={
                editing.answer ||
                ""
              }
              onChange={(e) =>
                setEditing(
                  (
                    prev
                  ) => ({
                    ...prev,
                    answer:
                      e.target
                        .value,
                  })
                )
              }
              className="input-field resize-none"
            />
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