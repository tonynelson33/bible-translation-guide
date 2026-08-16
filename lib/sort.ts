export function parseLeadingNumber(value: string): number | null {
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

export function gradeLevelSortValue(gradeLevel: string): number {
  // Average the bounds of a range (e.g. "7-8" -> 7.5) so a range sorts as harder
  // than its own lower bound alone (e.g. "7-8" sorts after plain "7").
  const nums = gradeLevel.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (nums.length === 0) return 0;
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
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
