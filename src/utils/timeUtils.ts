export interface ApiTimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export const convertTimeToApiFormat = (timeString: string): ApiTimeObject => {
  const [hourStr, minuteStr] = timeString.split(":");
  const hour = parseInt(hourStr, 10) || 0;
  const minute = parseInt(minuteStr, 10) || 0;
  return {
    hour,
    minute,
    second: 0,
    nano: 0,
  };
};

export const formatTimeToHHmmss = (timeString: string): string => {
  const [hourStr, minuteStr] = timeString.split(":");
  const hour = parseInt(hourStr, 10) || 0;
  const minute = parseInt(minuteStr, 10) || 0;
  const paddedHour = hour.toString().padStart(2, "0");
  const paddedMinute = minute.toString().padStart(2, "0");
  return `${paddedHour}:${paddedMinute}:00`;
};
