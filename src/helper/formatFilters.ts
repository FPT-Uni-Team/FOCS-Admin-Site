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


  if (filters.is_available !== undefined && filters.is_available !== null) {
    if (typeof filters.is_available === "string") {
      if (filters.is_available === "") {

        delete formatted.is_available;
      } else {
        formatted.is_available = filters.is_available === "true";
      }
    } else {
      formatted.is_available = Boolean(filters.is_available);
    }
  }

  
  if (filters.is_active !== undefined && filters.is_active !== null) {
    if (typeof filters.is_active === "string") {
      if (filters.is_active === "") {
        delete formatted.is_active;
      } else {
        formatted.is_active = filters.is_active === "true";
      }
    } else {
      formatted.is_active = Boolean(filters.is_active);
    }
  }

  Object.keys(formatted).forEach((key) => {
    if (
      formatted[key] === undefined || 
      formatted[key] === null || 
      formatted[key] === ""
    ) {
      delete formatted[key];
    }
  });

  return formatted;
};
