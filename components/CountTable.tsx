import type { CountRow } from "@/lib/churches";

export default function CountTable({ title, rows }: { title: string; rows: CountRow[] }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <h2 className="border-b border-neutral-200 px-3 py-2.5 text-sm font-semibold text-neutral-800">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2 text-right">Count</th>
              <th className="px-3 py-2 text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                <td className="px-3 py-1.5 text-neutral-700">{row.label}</td>
                <td className="px-3 py-1.5 text-right tabular-nums text-neutral-700">
                  {row.count.toLocaleString()}
                </td>
                <td className="px-3 py-1.5 text-right tabular-nums text-neutral-500">
                  {total > 0 ? ((row.count / total) * 100).toFixed(1) : "0.0"}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-neutral-200 font-semibold text-neutral-900">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 text-right tabular-nums">{total.toLocaleString()}</td>
              <td className="px-3 py-2 text-right tabular-nums">100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
