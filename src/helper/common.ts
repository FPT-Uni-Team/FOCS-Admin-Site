import type { SelectOption } from "../type/common/common";

export function createSelectOptions<T extends string | number | boolean>(
  record: Record<string, T>,
  allLabel?: string
): SelectOption<string>[] {
  const base = allLabel ? [{ value: "", label: allLabel }] : [];
  const entries = Object.entries(record).map(([key, value]) => ({
    value: String(value),
    label: key,
  }));

  return [...base, ...entries];
}
