// utils/dateUtils.ts

export const formatToCambodiaTime12h = (utcDateString: string): string => {
  // Clean nanoseconds (if any)
  const cleanedDateString = utcDateString.split('.')[0] + 'Z';
  const date = new Date(cleanedDateString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: 'short',     // Show month as Jan, Feb, Mar...
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

  return `${formattedTime} `;
};
