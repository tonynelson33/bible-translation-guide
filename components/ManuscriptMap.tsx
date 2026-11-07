"use client";

import { useState } from "react";
import {
  blackSea,
  byzantineArea,
  deadSea,
  geoLabels,
  islands,
  mapPlaces,
  mapViews,
  marmara,
  mediterranean,
  redSea,
  rivers,
  seaOfGalilee,
  type LonLat,
  type MapView,
} from "@/lib/manuscriptMap";
import { ntManuscripts, otManuscripts, type Family } from "@/lib/manuscripts";

/**
 * "Where they come from" on /manuscripts: a schematic map with two views. Every dot is
 * a numbered row from the page's tables; the numbers match the badges on those rows.
 * Plain equirectangular projection, corrected for latitude so shapes aren't squashed.
 */

const WIDTH = 1000;

function projector(view: MapView) {
  const [west, south, east, north] = view.bounds;
  const k = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const height = (WIDTH * (north - south)) / ((east - west) * k);
  const project = ([lon, lat]: LonLat): [number, number] => [
    ((lon - west) / (east - west)) * WIDTH,
    ((north - lat) / (north - south)) * height,
  ];
  return { project, height, lonUnit: WIDTH / (east - west), latUnit: height / (north - south) };
}

const path = (pts: LonLat[], project: (p: LonLat) => [number, number], close = true) =>
  pts.map((p, i) => `${i ? "L" : "M"}${project(p).map((n) => n.toFixed(1)).join(",")}`).join("") +
  (close ? "Z" : "");

const rowNumber = new Map<string, number>([
  ...otManuscripts.map((m, i) => [m.id, i + 1] as [string, number]),
  ...ntManuscripts.map((m, i) => [m.id, i + 1] as [string, number]),
]);
const rowName = new Map<string, string>([
  ...otManuscripts.map((m) => [m.id, m.name] as [string, string]),
  ...ntManuscripts.map((m) => [m.id, m.name] as [string, string]),
]);
const rowFamily = new Map<string, Family | undefined>(ntManuscripts.map((m) => [m.id, m.family]));

/** [1,2,3,4,9] -> "1–4, 9" */
function numberLabel(rows: string[]) {
  const nums = rows.map((r) => rowNumber.get(r) ?? 0).sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < nums.length; i++) {
    let j = i;
    while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
    parts.push(j > i + 1 ? `${nums[i]}–${nums[j]}` : j === i + 1 ? `${nums[i]}, ${nums[j]}` : `${nums[i]}`);
    i = j;
  }
  return parts.join(", ");
}

// Same colors as the family labels in the tables (SVG fills, so hex values).
const familyFill: Record<Family, string> = {
  Alexandrian: "#d97706",
  Byzantine: "#213f61",
  Western: "#059669",
  Caesarean: "#7c3aed",
  Mixed: "#737373",
  "Too small to tell": "#737373",
};
const OT_FILL = "#8a6018";

function placeFill(view: "nt" | "ot", rows: string[]) {
  if (view === "ot") return OT_FILL;
  // A shared dot takes the family most of its rows belong to (Egypt: Alexandrian).
  const counts = new Map<Family, number>();
  for (const r of rows) {
    const f = rowFamily.get(r);
    if (f && f !== "Mixed" && f !== "Too small to tell") counts.set(f, (counts.get(f) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return familyFill[top ?? rowFamily.get(rows[0]) ?? "Mixed"];
}

export default function ManuscriptMap() {
  const [viewId, setViewId] = useState<"nt" | "ot">("nt");
  const view = mapViews.find((v) => v.id === viewId)!;
  const { project, height, lonUnit, latUnit } = projector(view);
  const places = mapPlaces.filter((p) => p.view === viewId);
  const r = 9;

  const legend = [
    ...places.map((p) => ({ key: p.name + p.view, place: p.name, rows: p.rows, note: p.note, fill: placeFill(viewId, p.rows), area: false })),
    ...(viewId === "nt"
      ? [{ key: "byz", place: byzantineArea.name, rows: byzantineArea.rows, note: byzantineArea.note, fill: familyFill.Byzantine, area: true }]
      : []),
  ].sort((a, b) => (rowNumber.get(a.rows[0]) ?? 0) - (rowNumber.get(b.rows[0]) ?? 0));

  return (
    <figure className="mt-6 rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-brand-900">Where they come from</h3>
        <div role="tablist" aria-label="Map view" className="inline-flex rounded-lg border border-neutral-200 p-0.5">
          {mapViews.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={viewId === v.id}
              onClick={() => setViewId(v.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                viewId === v.id ? "bg-brand-800 text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        <strong className="text-neutral-800">The dots show only the manuscripts in this page’s tables, not every copy.</strong>{" "}
        Each dot marks where a manuscript was made, if that’s known, or otherwise where it was found. The
        numbers match the rows in the {viewId === "nt" ? "New Testament" : "Old Testament"} table above.
      </p>

      <svg
        viewBox={`0 0 ${WIDTH} ${height.toFixed(0)}`}
        className="mt-4 w-full rounded-md border border-neutral-200"
        role="img"
        aria-label={`Map of where the ${view.label} manuscripts in this page's tables come from`}
      >
        <rect width={WIDTH} height={height} fill="#ede6d6" />
        {[mediterranean, blackSea, marmara, redSea, deadSea, seaOfGalilee].map((poly, i) => (
          <path key={i} d={path(poly, project)} fill="#cfe0ec" stroke="#9db8cc" strokeWidth={1} strokeLinejoin="round" />
        ))}
        {islands.map((poly, i) => (
          <path key={i} d={path(poly, project)} fill="#ede6d6" stroke="#9db8cc" strokeWidth={1} />
        ))}
        {rivers.map((line, i) => (
          <path key={i} d={path(line, project, false)} fill="none" stroke="#9db8cc" strokeWidth={1.5} />
        ))}

        {geoLabels
          .filter((g) => g.view === viewId)
          .map((g) => {
            const [x, y] = project(g.at);
            return (
              <text
                key={g.text}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={g.water ? 19 : 17}
                fontStyle={g.water ? "italic" : "normal"}
                letterSpacing={g.water ? 0.5 : 2}
                fill={g.water ? "#5b7f99" : "#8c8170"}
                className="hidden sm:inline"
              >
                {g.water ? g.text : g.text.toUpperCase()}
              </text>
            );
          })}

        {viewId === "nt" && (
          <g>
            <ellipse
              cx={project(byzantineArea.center)[0]}
              cy={project(byzantineArea.center)[1]}
              rx={byzantineArea.radius[0] * lonUnit}
              ry={byzantineArea.radius[1] * latUnit}
              fill={familyFill.Byzantine}
              fillOpacity={0.14}
              stroke={familyFill.Byzantine}
              strokeOpacity={0.45}
              strokeDasharray="6 4"
            />
            <text
              x={project(byzantineArea.center)[0]}
              y={project(byzantineArea.center)[1] + 14}
              textAnchor="middle"
              className="fill-brand-900 sm:hidden"
              fontSize={44}
              fontWeight={700}
            >
              {numberLabel(byzantineArea.rows)}
            </text>
            <text
              x={project(byzantineArea.center)[0]}
              y={project(byzantineArea.center)[1] - 6}
              textAnchor="middle"
              className="hidden fill-brand-900 sm:inline"
              fontSize={20}
              fontWeight={700}
            >
              {byzantineArea.name} ({numberLabel(byzantineArea.rows)})
            </text>
            <text
              x={project(byzantineArea.center)[0]}
              y={project(byzantineArea.center)[1] + 18}
              textAnchor="middle"
              className="hidden fill-brand-900 sm:inline"
              fontSize={18}
            >
              medieval minuscules
            </text>
          </g>
        )}

        {places.map((p) => {
          const [x, y] = project(p.at);
          const label = numberLabel(p.rows);
          const side = p.labelSide ?? "right";
          const dx = side === "right" ? r + 8 : side === "left" ? -(r + 8) : 0;
          const dy = side === "above" ? -(r + 10) : side === "below" ? r + 22 : 6;
          const anchor = side === "right" ? "start" : side === "left" ? "end" : "middle";
          const R = 20;
          const mdx = side === "right" ? R + 10 : side === "left" ? -(R + 10) : 0;
          const mdy = side === "above" ? -(R + 12) : side === "below" ? R + 44 : 15;
          return (
            <g key={p.name}>
              <title>{`${p.name}: ${p.rows.map((row) => rowName.get(row)).join(", ")}. ${p.note}`}</title>
              <g className="sm:hidden">
                <circle cx={x} cy={y} r={R} fill={placeFill(viewId, p.rows)} stroke="#fff" strokeWidth={5} />
                <text
                  x={x + mdx}
                  y={y + mdy}
                  textAnchor={anchor}
                  fontSize={44}
                  fontWeight={700}
                  className="fill-neutral-900"
                  stroke="#ede6d6"
                  strokeWidth={9}
                  paintOrder="stroke"
                >
                  {label}
                </text>
              </g>
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={placeFill(viewId, p.rows)}
                stroke="#fff"
                strokeWidth={2.5}
                className="hidden sm:inline"
              />
              <text
                className="hidden fill-neutral-900 sm:inline"
                x={x + dx}
                y={y + dy}
                textAnchor={anchor}
                fontSize={20}
                fontWeight={700}
                stroke="#ede6d6"
                strokeWidth={5}
                paintOrder="stroke"
              >
                {p.name} ({label})
              </text>
            </g>
          );
        })}
      </svg>

      <ol className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {legend.map((l) => (
          <li key={l.key} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className={`mt-1 inline-block h-3 w-3 flex-shrink-0 ${l.area ? "rounded-sm opacity-60" : "rounded-full"}`}
              style={{ backgroundColor: l.fill }}
            />
            <span className="leading-snug text-neutral-700">
              <strong className="text-brand-900">
                {l.place} ({numberLabel(l.rows)}):
              </strong>{" "}
              {l.rows.map((row) => rowName.get(row)).join(", ")}. {l.note}
            </span>
          </li>
        ))}
      </ol>
      {viewId === "nt" && (
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">
          Dot colors match the family labels in the table. The Egypt dot is colored Alexandrian
          because most of its manuscripts are. The map is schematic, not to survey accuracy.
        </p>
      )}
    </figure>
  );
}
