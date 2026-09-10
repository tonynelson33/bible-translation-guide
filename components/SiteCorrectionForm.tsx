"use client";

import { useState, type FormEvent } from "react";

const fieldClass =
  "rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600";

/**
 * A "submit a correction" form for anything on the site that isn't a church
 * listing. Posts to church_suggestions (type "site_correction") via
 * lib/churchSuggestions — insert-only for anon, reviewed by hand.
 */
export default function SiteCorrectionForm() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("");
  const [note, setNote] = useState("");
  // Honeypot — hidden from real users; a bot that fills every field trips it.
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (url.trim() !== "") {
      setStatus("done"); // honeypot tripped — feign success
      return;
    }
    if (note.trim() === "") return;
    setStatus("submitting");
    // Loaded on submit so the Supabase client stays out of the initial /about bundle.
    const { submitSiteCorrection } = await import("@/lib/churchSuggestions");
    const result = await submitSiteCorrection({ page, note });
    setStatus(result.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        Thanks &mdash; this goes to a review queue and the site&rsquo;s updated from there.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 rounded-md border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:border-brand-300 hover:bg-brand-100"
      >
        Submit a correction
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-2 rounded-md border border-neutral-200 bg-white p-3"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field blank
          <input
            type="text"
            name="url"
            tabIndex={-1}
            autoComplete="off"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
        Page or section <span className="font-normal text-neutral-400">(optional)</span>
        <input
          type="text"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder="e.g. the NIV profile, /verses, the history timeline"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
        What&rsquo;s wrong? <span className="font-normal text-neutral-400">If you can, say how you know.</span>
        <textarea
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className={fieldClass}
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting" || note.trim() === ""}
          className="rounded-md bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-neutral-500 hover:underline"
        >
          Cancel
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600">Something went wrong — try again in a moment.</p>
      )}
    </form>
  );
}
