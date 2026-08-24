"use client";

import { useState, type FormEvent } from "react";
import type { Church } from "@/lib/churches";
import { denominationOptions, translationOptions } from "@/lib/suggestionOptions";
import { submitEditSuggestion } from "@/lib/churchSuggestions";

export default function SuggestCorrectionForm({ church }: { church: Church }) {
  const [open, setOpen] = useState(false);
  const [denomination, setDenomination] = useState(church.category ?? "");
  const [translation, setTranslation] = useState(church.bibleTranslation ?? "");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const result = await submitEditSuggestion({
      churchId: church.id,
      churchName: church.name,
      denomination,
      translation,
      note,
    });
    setStatus(result.ok ? "done" : "error");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-xs font-medium text-brand-700 hover:underline"
      >
        Suggest a correction
      </button>
    );
  }

  if (status === "done") {
    return (
      <p className="mt-3 text-xs text-emerald-700">
        Thanks — we&apos;ll review this before it&apos;s applied.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-2 rounded-md border border-neutral-200 bg-white p-3"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          Denomination
          <select
            value={denomination}
            onChange={(e) => setDenomination(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="">Select…</option>
            {denominationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          Bible translation
          <select
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="">Select…</option>
            {translationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
        Note (optional) — how do you know this?
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting" || (!denomination && !translation)}
          className="rounded-md bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting…" : "Submit suggestion"}
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
