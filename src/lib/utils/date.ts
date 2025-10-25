export type DateFormat = "full" | "date" | "year-month" | "year";

export function formatDateToUTC7(
  dateString: string, 
  format: DateFormat = "full"
): string {
  const date = new Date(dateString);

  // Get UTC+7 time parts
  const tz = "Asia/Ho_Chi_Minh";
  const options: Intl.DateTimeFormatOptions = {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  // Get parts explicitly
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

  const year = parts.find(p => p.type === "year")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const day = parts.find(p => p.type === "day")?.value;
  const hour = parts.find(p => p.type === "hour")?.value;
  const minute = parts.find(p => p.type === "minute")?.value;

  switch (format) {
    case "year":
      return year || "";
    case "year-month":
      return `${year}-${month}`;
    case "date":
      return `${year}-${month}-${day}`;
    case "full":
    default:
      return `${year}-${month}-${day}, ${hour}:${minute}`;
  }
}

export function formatDuration(durationSeconds: string | number): string {
  if (!durationSeconds) return '-'
  
  const totalSeconds = typeof durationSeconds === 'string' 
    ? parseFloat(durationSeconds) 
    : durationSeconds
  
  if (isNaN(totalSeconds) || totalSeconds < 0) return '-'
  
  const days = Math.floor(totalSeconds / 86400) // 24 * 60 * 60
  const hours = Math.floor((totalSeconds % 86400) / 3600) // 60 * 60
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  
  const parts: string[] = []
  
  if (days > 0) {
    parts.push(`${days}d`)
  }
  
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  
  // Show seconds if less than 1 hour total, or if it's the only unit
  if ((days === 0 && hours === 0) || (days === 0 && hours === 0 && minutes === 0)) {
    if (totalSeconds < 60) {
      // Show decimal for sub-minute durations
      parts.push(`${totalSeconds.toFixed(1)}s`)
    } else {
      parts.push(`${seconds}s`)
    }
  }
  
  return parts.length > 0 ? parts.join(' ') : '0s'
}

interface YearOption {
  value: string;
  label: string;
}

interface YearFilterOptions {
  yearsBack?: number;
  startYear?: number;
  ascending?: boolean;
}

export const generateYearOptions = (options: YearFilterOptions = {}): YearOption[] => {
  const {
    yearsBack = 4,
    startYear = new Date().getFullYear(),
    ascending = false
  } = options;

  const years = Array.from({ length: yearsBack + 1 }, (_, i) => {
    const year = startYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  return ascending ? years.reverse() : years;
};

export const getCurrentYear = (): string => {
  return new Date().getFullYear().toString();
};

export const getLastYear = (): string => {
  return (new Date().getFullYear() - 1).toString();
};

export const daysDiff = (fromDate: string, toDate: string): number => {
  const from = new Date(fromDate)
  const to = new Date(toDate)
  return Math.abs(to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
}

export const addDayToDate = (dateString: string, numDays: number): string => {
    const date = new Date(dateString)
    date.setDate(date.getDate() + numDays)
    return date.toISOString()
  }

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }