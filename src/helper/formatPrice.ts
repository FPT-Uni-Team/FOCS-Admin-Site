export const formatPrice = (rawValue: number | null | undefined) => {
  if (rawValue === null || rawValue === undefined) {
    return "";
  }
  const formatted = String(rawValue).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formatted;
};
