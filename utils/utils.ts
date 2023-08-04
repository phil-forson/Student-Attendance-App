import { Timestamp } from "firebase/firestore";
import uuid from "react-native-uuid";
import { GroupedClasses, IClass } from "../types";
import * as SecureStore from "expo-secure-store";

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
  const stringWithoutSpaces = inputString.replace(/\s/g, "");

  // Capitalize all letters
  const stringWithCapitalLetters = stringWithoutSpaces.toUpperCase();

  // Separate letters and numbers by space
  const formattedString = stringWithCapitalLetters.replace(
    /([A-Z]+)(\d+)/g,
    "$1 $2"
  );

  return formattedString;
}
export const generateUid = () => {
  return uuid.v4(); // Generate a 6-character unique code using nanoid library
};

export const calculateDuration = (startDate: Timestamp, endDate: Timestamp) => {
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
};

export function groupAndSortClasses(classes: IClass[]): {
  upcoming: IClass[];
  ongoing: IClass[];
  past: IClass[];
} {
  const now = new Date();
  const upcoming: IClass[] = [];
  const ongoing: IClass[] = [];
  const past: IClass[] = [];

  console.log("classes ", classes);

  classes.forEach((classItem: IClass) => {
    console.log(classItem);
    const classStartTime = new Date(classItem?.classStartTime.toDate());
    const classEndTime = new Date(classItem?.classEndTime.toDate());

    console.log("class start time ", classStartTime);

    if (classStartTime > now) {
      upcoming.push(classItem);
      console.log("upcoming ", classItem);
    } else if (classStartTime <= now && classEndTime >= now) {
      ongoing.push(classItem);
      console.log("ongoing ", classItem);
    } else {
      past.push(classItem);
      console.log("past ", classItem);
    }
  });

  // Sort the arrays by classStartTime in ascending order
  upcoming.sort(
    (a, b) =>
      new Date(a.classStartTime.toDate()).getTime() -
      new Date(b.classStartTime.toDate()).getTime()
  );
  ongoing.sort(
    (a, b) =>
      new Date(a.classStartTime.toDate()).getTime() -
      new Date(b.classStartTime.toDate()).getTime()
  );
  past.sort(
    (a, b) =>
      new Date(a.classStartTime.toDate()).getTime() -
      new Date(b.classStartTime.toDate()).getTime()
  );

  return { upcoming, ongoing, past };
}

export function isStartTimeGreater(startTime: Date, endTime: Date) {
  const startHours = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHours = endTime.getHours();
  const endMinutes = endTime.getMinutes();

  if (
    startHours > endHours ||
    (startHours === endHours && startMinutes > endMinutes)
  ) {
    return true; // Start time is greater than end time
  } else {
    return false; // Start time is not greater than end time
  }
}

export function add30MinutesToTime(originalTime: Date) {
  const updatedTime = new Date(originalTime);
  const currentMinutes = updatedTime.getMinutes();
  updatedTime.setMinutes(currentMinutes + 30);
  return updatedTime;
}

export function subtract30MinutesFromTime(originalTime: Date) {
  const updatedTime = new Date(originalTime);
  const currentMinutes = updatedTime.getMinutes();
  updatedTime.setMinutes(currentMinutes - 30);
  return updatedTime;
}

export const getClassesTodayAndFuture = (classes: IClass[]): IClass[] => {
  const now = new Date().getTime(); // Get the current time in milliseconds
  const today = new Date(); // Get the start of today in milliseconds

  const filteredClasses = classes.filter((classItem) => {
    const classStartTime = new Date(
      classItem?.classStartTime.toDate()
    ).toDateString();
    return classStartTime === today.toDateString();
  });

  console.log(
    "classes ",
    classes[0].classStartTime.toDate().toDateString() >= today.toDateString()
  );
  console.log("filtered classes ", filteredClasses);

  // Sort the filtered classes by their proximity to the current time
  filteredClasses.sort((a, b) => {
    const timeDifferenceA = Math.abs(
      new Date(a.classStartTime.toDate()).getTime() - now
    );
    const timeDifferenceB = Math.abs(
      new Date(b.classStartTime.toDate()).getTime() - now
    );
    return timeDifferenceA - timeDifferenceB;
  });

  return filteredClasses;
};

export function calculateDurationInSeconds(startDate: Date, endDate: Date) {
  // Calculate the difference in milliseconds between the two dates
  const durationInMilliseconds = endDate.getTime() - startDate.getTime();

  // Convert the milliseconds to seconds
  const durationInSeconds = Math.floor(durationInMilliseconds / 1000);

  return durationInSeconds;
}

export const isClassOngoing = (classItem: IClass): boolean => {
  const now = new Date();
  const classStartTime = new Date(classItem.classStartTime.toDate());
  const classEndTime = new Date(classItem.classEndTime.toDate());

  return now >= classStartTime && now <= classEndTime;
};

export async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function deleteValueFor(key: string) {
  let result = await SecureStore.deleteItemAsync(key);
  return result;
}

export function getCurrentLocaleDateString() {
  const currentDate = new Date();

  // Specify the options for formatting the date and time
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  // Convert the date to a locale string
  const localeDateString = currentDate.toLocaleString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  return localeDateString;
}

export function isTimePast(time: Date) {
  const currentTime = new Date();
  return time.getTime() < currentTime.getTime();
}