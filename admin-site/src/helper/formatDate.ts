import type { FormInstance } from "antd/es/form";
import dayjs, { Dayjs } from "dayjs";

type GetFieldValue = FormInstance["getFieldValue"];

interface DateValidationOptions {
  getFieldValue: GetFieldValue;
  fieldName?: string | string[];
  message?: string;
}

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const getDisabledTime = () => {
  const now = dayjs();
  return {
    disabledHours: () =>
      Array.from({ length: 24 }, (_, i) => i).filter(
        (hour) => hour < now.hour()
      ),

    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === now.hour()) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute < now.minute() + 1
        );
      }
      return [];
    },
  };
};

export const validateDate = ({
  getFieldValue,
  fieldName,
  message,
}: DateValidationOptions) => ({
  validator(_: unknown, value: Dayjs) {
    const startDate = getFieldValue(fieldName);
    if (!value || !startDate || (value.isAfter && value.isAfter(startDate))) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(message));
  },
});
