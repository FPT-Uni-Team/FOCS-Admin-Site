import type { SelectProps } from "antd";

export interface SelectConfig {
  type: "select" | "input" | "date" | "rangePicker";
  name: string;
  label?: string;
  placeholder?: string;
  searchable?: boolean;
  mode?: "multiple" | "tags";
  options?: SelectProps["options"];
}

export interface FilterReuseProps {
  onFilter: (filters: Record<string, unknown>) => void;
  selectConfigs?: SelectConfig[];
  onSearch: (value: string) => void;
}
