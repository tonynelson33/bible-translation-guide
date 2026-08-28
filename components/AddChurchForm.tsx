"use client";

import { useState, type FormEvent } from "react";
import { denominationOptions, translationOptions } from "@/lib/suggestionOptions";
import { submitNewChurchSuggestion } from "@/lib/churchSuggestions";

export default function AddChurchForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState("");
  const [region, setRegion] = useState("");
  const [zip, setZip] = useState("");
  const [denomination, setDenomination] = useState("");
  const [translation, setTranslation] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const result = await submitNewChurchSuggestion({
      churchName: name,
      address,
      locality,
      region,
      zip,
      denomination,
      translation,
    });
    setStatus(result.ok ? "done" : "error");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 text-sm font-medium text-brand-700 hover:underline"
      >
        Don&apos;t see your church? Add it →
      </button>
    );
  }

  if (status === "done") {
    return (
      <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Thanks! We&apos;ll check it&apos;s not already listed under a different name before adding
        it.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
    >
      <h2 className="text-sm font-semibold text-neutral-800">Add a church</h2>
      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
        Church name
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
        Street address
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          City
          <input
            type="text"
            required
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          State
          <input
            type="text"
            required
            maxLength={2}
            value={region}
            onChange={(e) => setRegion(e.target.value.toUpperCase())}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm uppercase text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          Zip code
          <input
            type="text"
            required
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-neutral-600">
          Denomination
          <select
            required
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
            required
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
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-neutral-500 hover:underline"
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
