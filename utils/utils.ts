import { Timestamp } from "firebase/firestore";
import uuid from "react-native-uuid";
import { GroupedClasses, IClass } from "../types";

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

export function formatStringToCourseCode(inputString: string): string {
  // Remove all spaces
  const stringWithoutSpaces = inputString.replace(/\s/g, '');

  // Capitalize all letters
  const stringWithCapitalLetters = stringWithoutSpaces.toUpperCase();

  // Separate letters and numbers by space
  const formattedString = stringWithCapitalLetters.replace(/([A-Z]+)(\d+)/g, '$1 $2');

  return formattedString;
}
export const generateUid = () => {
  return uuid.v4(); // Generate a 6-character unique code using nanoid library
};

export const calculateDuration = (startDate: Timestamp, endDate: Timestamp) =>  {
  const diffInMs = endDate.toDate().getTime() - startDate.toDate().getTime();
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  let durationString = "";
  if (hours > 0) {
    durationString += hours + " hr";
    if (hours > 1) {
      durationString += "s";
    }
  }
  
  if (minutes > 0) {
    if (hours > 0) {
      durationString += " ";
    }
    durationString += minutes + " min";
    if (minutes > 1) {
      durationString += "s";
    }
  }
  
  return durationString;
}

export const groupAndSortClasses = (classes: IClass[]): GroupedClasses => {
  const now = new Date();
  const upcomingClasses: IClass[] = [];
  const pastClasses: IClass[] = [];

  classes.forEach((classItem) => {
    const classStartTime = new Date(classItem?.classStartTime.toDate());
    if (classStartTime > now) {
      upcomingClasses.push(classItem);
    } else {
      pastClasses.push(classItem);
    }
  });

  upcomingClasses.sort((classA, classB) => {
    const dateA = new Date(classA?.classStartTime.toDate());
    const dateB = new Date(classB?.classStartTime.toDate());
    return Math.abs(dateA.getTime() - now.getTime()) - Math.abs(dateB.getTime() - now.getTime());
  });

  return {
    upcomingClasses,
    pastClasses,
  };
};