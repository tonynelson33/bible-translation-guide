export function parseLeadingNumber(value: string): number | null {
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

export function gradeLevelSortValue(gradeLevel: string): number {
  return parseLeadingNumber(gradeLevel) ?? 0;
}

export function quoteLimitSortValue(quoteLimit: string): number {
  if (/unlimited/i.test(quoteLimit)) return Infinity;
  return parseLeadingNumber(quoteLimit) ?? -1;
}

export function compareValues(a: string | number | boolean, b: string | number | boolean): number {
  if (typeof a === "boolean" && typeof b === "boolean") {
    if (a === b) return 0;
    return a ? 1 : -1;
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b));
}
