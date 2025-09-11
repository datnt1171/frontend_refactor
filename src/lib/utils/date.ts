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