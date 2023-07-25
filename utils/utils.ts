export const convertToDayString = (date: Date) => {
  return new Date(date).toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const convertToHHMM = (date: Date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const truncateTextWithEllipsis = (
  text: string,
  limit: number
): string => {
  if (text.length <= limit) {
    return text;
  }

  const truncatedText = text.slice(0, limit).trim();
  return truncatedText + "...";
};
