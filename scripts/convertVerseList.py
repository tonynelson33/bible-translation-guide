import json
import openpyxl

SRC = r"C:\Users\admin\Desktop\claude\bible-translation-guide\500_verse_comparison_list.xlsx"
DEST = r"C:\Users\admin\Desktop\claude\bible-translation-guide\data\verseComparisonList.json"

wb = openpyxl.load_workbook(SRC, data_only=True)
ws = wb.active

rows = list(ws.iter_rows(min_row=2, values_only=True))
entries = []
for reference, category, difference_type, passage_group in rows:
    if reference is None:
        continue
    entries.append({
        "reference": str(reference).strip(),
        "category": category,
        "differenceType": difference_type,
        "passageGroup": passage_group,
    })

with open(DEST, "w", encoding="utf-8") as f:
    json.dump(entries, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"Wrote {len(entries)} entries to {DEST}")
