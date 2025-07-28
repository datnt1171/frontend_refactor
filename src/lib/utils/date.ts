export function formatDateToUTC7(dateString: string): string {
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
  // const second = parts.find(p => p.type === "second")?.value;

  return `${year}-${month}-${day}, ${hour}:${minute}`;
}
