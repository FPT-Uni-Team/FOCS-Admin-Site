/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectMapper<T extends Record<string, string>>(
  data: any[],
  fieldMap: T
): any[] {
  return data.map((item) => {
    const mappedItem: any = {};
    for (const [newKey, oldKey] of Object.entries(fieldMap)) {
      mappedItem[newKey] = item[oldKey];
    }
    return mappedItem;
  });
}
