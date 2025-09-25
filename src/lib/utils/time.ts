export const timeDiff = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const [startHour = 0, startMin = 0] = startTime.split(':').map(Number);
  const [endHour = 0, endMin = 0] = endTime.split(':').map(Number);

  if (
    Number.isNaN(startHour) || Number.isNaN(startMin) ||
    Number.isNaN(endHour) || Number.isNaN(endMin)
  ) {
    return 0;
  }

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  return (endMinutes - startMinutes) / 60;
};