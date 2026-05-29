"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Trash2, Eye, EyeOff, Search, ChevronLeft, ChevronRight } from "lucide-react";

type Inquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service_interest: string;
  message: string;
  preferred_time: string;
  is_read: boolean;
  created_at: string;
};

const PAGE_LIMIT = 20;

export default function AdminInquiries({
  apiBase,
  onStatsChange,
}: {
  apiBase: string;
  onStatsChange: () => void;
}) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected]   = useState<Inquiry | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const [filter, setFilter]   = useState<"all" | "unread">("all");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const headers = { "Content-Type": "application/json" };

  const load = useCallback(async (pg = page, s = search, f = filter) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page:   String(pg),
        limit:  String(PAGE_LIMIT),
        filter: f,
        search: s,
      });
      const r = await fetch(`${apiBase}/api/admin/inquiries?${params}`, { headers });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setInquiries(d.inquiries || []);
      setTotal(d.total || 0);
      setTotalPages(d.totalPages || 1);
    } catch {
      setError("Cannot reach backend.");
    } finally {
      setLoading(false);
    }
  }, [apiBase, page, search, filter]);

  useEffect(() => { load(page, search, filter); }, [page, filter]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search, filter); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const markRead = async (id: string, is_read: boolean) => {
    try {
      await fetch(`${apiBase}/api/admin/inquiries/${id}`, {
        method: "PATCH", headers, body: JSON.stringify({ is_read }),
      });
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, is_read } : i)));
      if (selected?.id === id) setSelected((s) => s ? { ...s, is_read } : s);
      onStatsChange();
    } catch {
      setError("Failed to update inquiry.");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await fetch(`${apiBase}/api/admin/inquiries/${id}`, { method: "DELETE", headers });
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selected?.id === id) setSelected(null);
      setTotal((t) => t - 1);
      onStatsChange();
    } catch {
      setError("Failed to delete inquiry.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-0">
      {/* Inquiry List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col" style={{ maxHeight: "80vh" }}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-brand-navy text-sm">
              {total} Inquiries
            </span>
            <div className="flex gap-1">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors
                  ${filter === f ? "bg-brand-navy text-white" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  {f === "all" ? "All" : "Unread"}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Search name, company, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-brand-cyan/50"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs p-4 bg-red-50 flex-shrink-0">{error}</p>}

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {loading && <p className="text-center text-gray-400 text-sm py-8">Loading...</p>}
          {!loading && inquiries.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No inquiries found</p>
          )}
          {inquiries.map((inq) => (
            <button
              key={inq.id}
              onClick={() => {
                setSelected(inq);
                if (!inq.is_read) markRead(inq.id, true);
              }}
              className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors
              ${selected?.id === inq.id ? "bg-brand-light border-l-2 border-l-brand-cyan" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`text-sm truncate ${!inq.is_read ? "font-semibold text-brand-navy" : "text-gray-700"}`}>
                    {inq.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{inq.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{inq.service_interest || "General"}</p>
                </div>
                {!inq.is_read && <span className="w-2 h-2 rounded-full bg-brand-cyan flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {new Date(inq.created_at).toLocaleDateString("en-IN")}
              </p>
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-gray-400">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Inquiry Details */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 py-16">
            <Mail size={40} className="mb-3" />
            <p className="text-sm">Select an inquiry to view details</p>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-brand-navy">{selected.name}</h3>
                <p className="text-sm text-gray-400">
                  {selected.company} · {new Date(selected.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => markRead(selected.id, !selected.is_read)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                >
                  {selected.is_read ? <><EyeOff size={12} /> Mark Unread</> : <><Eye size={12} /> Mark Read</>}
                </button>
                <button
                  onClick={() => del(selected.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Email", value: selected.email, href: `mailto:${selected.email}` },
                { label: "Phone", value: selected.phone, href: `tel:${selected.phone}` },
                { label: "Service", value: selected.service_interest || "—" },
                { label: "Preferred Time", value: selected.preferred_time || "—" },
              ].map(({ label, value, href }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-brand-electric hover:underline">{value}</a>
                  ) : (
                    <p className="text-sm font-medium text-brand-navy">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {selected.message && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
