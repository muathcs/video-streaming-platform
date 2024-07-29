import { useEffect, useState } from "react";

// Function to get the saved value from local storage
function getSavedValue(key: string, initialValue: any) {
  const savedValue = localStorage.getItem(key);

  if (savedValue === null) return initialValue;

  try {
    return JSON.parse(savedValue);
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    return initialValue;
  }
}
// Custom hook to use local storage
export function useLocalStorage<T>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T>(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue] as const;
}
