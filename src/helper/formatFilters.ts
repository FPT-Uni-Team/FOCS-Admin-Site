/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ListPageParams } from "../type/common/common";

type OnFilterHandlerConfig = {
  setParams: (updater: (prev: ListPageParams) => ListPageParams) => void;
  formatFilters?: (filters: Record<string, unknown>) => Record<string, any>;
};

export const createOnFilterHandler = ({
  setParams,
  formatFilters,
}: OnFilterHandlerConfig) => {
  return (values: Record<string, unknown>) => {
    const formattedFilters = formatFilters
      ? formatFilters(values)
      : defaultFormatFilters(values);

    setParams((prev) => ({
      ...prev,
      page: 1,
      filters: formattedFilters,
    }));
  };
};

const defaultFormatFilters = (filters: Record<string, unknown>) => {
  const formatted = { ...filters };

  if (filters.date && Array.isArray(filters.date)) {
    formatted.start_date = (filters.date[0] as Date).toISOString();
    formatted.end_date = (filters.date[1] as Date).toISOString();
    delete formatted.date;
  }

  if (
    typeof filters.is_available === "string" &&
    filters.is_available.length > 0
  ) {
    formatted.is_available = filters.is_available === "true" ? true : false;
  } else if (
    typeof filters.is_active === "string" &&
    filters.is_active.length > 0
  ) {
    formatted.is_active = filters.is_active === "true" ? true : false;
  }

  Object.keys(formatted).forEach((key) => {
    if (formatted[key] === undefined || formatted[key] === null) {
      delete formatted[key];
    }
  });

  return formatted;
};
