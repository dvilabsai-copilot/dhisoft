"use client";

import { useEffect, useState } from "react";

type Status = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";

type Lead = {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message: string;
  notes?: string | null;
  status: Status;
  createdAt: string;
};

type Result = {
  items: Lead[];
  page: number;
  pages: number;
  total: number;
};

const statuses: Status[] = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"];

export default function LeadsTable() {
  const [result, setResult] = useState<Result | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLeads() {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (status) {
        query.set("status", status);
      }

      try {
        const response = await fetch(`/api/admin/leads?${query}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load leads: ${response.status}`);
        }

        const data = (await response.json()) as Result;

        if (!controller.signal.aborted) {
          setResult(data);
          setError("");
        }
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        if (!controller.signal.aborted) {
          setError("Could not load leads.");
        }
      }
    }

    void fetchLeads();

    return () => {
      controller.abort();
    };
  }, [page, status]);

  async function reloadLeads() {
    const query = new URLSearchParams({
      page: String(page),
      limit: "10",
    });

    if (status) {
      query.set("status", status);
    }

    const response = await fetch(`/api/admin/leads?${query}`);

    if (!response.ok) {
      setError("Could not load leads.");
      return;
    }

    setResult((await response.json()) as Result);
    setError("");
  }

  async function update(
    id: string,
    patch: { status?: Status; notes?: string },
  ) {
    const response = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    });

    if (!response.ok) {
      setError("Could not update this lead.");
      return;
    }

    await reloadLeads();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Inbound enquiries
          </p>
          <h1 className="text-3xl font-bold">Leads</h1>
        </div>

        <label className="text-sm font-medium">
          Status
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
            className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <option value="">All</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {result?.items.length ? (
          result.items.map((lead) => (
            <article
              key={lead.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-bold">
                    {lead.name}
                    {lead.company ? ` · ${lead.company}` : ""}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                    {" · "}
                    {new Date(lead.createdAt).toLocaleString()}
                  </p>
                </div>

                <select
                  value={lead.status}
                  onChange={(event) =>
                    void update(lead.id, {
                      status: event.target.value as Status,
                    })
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2"
                >
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-slate-700">
                {lead.message}
              </p>

              <label className="mt-4 block text-sm font-medium text-slate-600">
                Internal notes
                <textarea
                  defaultValue={lead.notes ?? ""}
                  onBlur={(event) =>
                    void update(lead.id, {
                      notes: event.target.value,
                    })
                  }
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </label>
            </article>
          ))
        ) : result ? (
          <p className="rounded-2xl bg-white p-6 text-slate-500">
            No leads found.
          </p>
        ) : (
          <p role="status" className="rounded-2xl bg-white p-6">
            Loading leads…
          </p>
        )}
      </div>

      {result && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="rounded-full border px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page {result.page} of {Math.max(result.pages, 1)} · {result.total}{" "}
            total
          </span>

          <button
            disabled={page >= result.pages}
            onClick={() => setPage((value) => value + 1)}
            className="rounded-full border px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
