import type { CountRow } from "@/lib/churches";

export default function CountTable({ title, rows }: { title: string; rows: CountRow[] }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <h2 className="border-b border-neutral-200 px-3 py-2.5 text-sm font-semibold text-neutral-800">
        {title}
      </h2>
      {/* table-fixed + explicit Count/% widths mean the table can never need
          more than 100% of its container — Name gets whatever's left and
          truncates with an ellipsis (full label on hover) instead of forcing
          the table wider, which used to push % off the visible edge. No
          overflow-x-auto wrapper: with the table never actually overflowing,
          that container only risked showing a scrollbar from sub-pixel
          rounding; the outer overflow-hidden above is enough of a backstop. */}
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <th className="px-3 py-2">Name</th>
            <th className="w-20 px-3 py-2 text-right">Count</th>
            <th className="w-16 px-3 py-2 text-right">%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
              <td className="truncate px-3 py-1.5 text-neutral-700" title={row.label}>
                {row.label}
              </td>
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
  );
}
