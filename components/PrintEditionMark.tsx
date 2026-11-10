import YesNoIcon from "./YesNoIcon";
import type { PrintEdition } from "@/lib/types";

/** Whether a printed Bible can be bought: a check, a cross, or "Hard to find". */
export default function PrintEditionMark({ value }: { value: PrintEdition }) {
  if (value === "Limited") {
    return (
      <span className="text-xs font-medium text-amber-700" title="Print edition available: hard to find">
        Hard to find
      </span>
    );
  }
  return <YesNoIcon value={value === "Yes"} label="Print edition available" />;
}

export const printEditionSortValue = (value: PrintEdition) => ({ Yes: 2, Limited: 1, No: 0 })[value];
