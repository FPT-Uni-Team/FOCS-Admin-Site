import type { FormInstance } from "antd/es/form";
import dayjs, { Dayjs } from "dayjs";

type GetFieldValue = FormInstance["getFieldValue"];

interface DateValidationOptions {
  getFieldValue: GetFieldValue;
  fieldName?: string | string[];
  message?: string;
}

export const formatDate = (date: string | Date): string => {
  if (!date) return "N/A";
  
  try {
    let dateStr: string;
    
    if (typeof date === 'string') {
      dateStr = date.replace(/\.\d+$/, '');
    } else {
      dateStr = date.toString();
    }
    
    const d = new Date(dateStr);
    
    if (isNaN(d.getTime())) {
      return "Invalid Date";
    }
    
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

export const getDisabledTime = (currentDate?: dayjs.Dayjs) => {
  const now = dayjs();

  if (currentDate && currentDate.isSame(now, "day")) {
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
  }

  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
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
