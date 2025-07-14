export const formatPrice = (rawValue: number) => {
  const formatted = String(rawValue).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formatted;
};
