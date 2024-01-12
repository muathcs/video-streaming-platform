import { useEffect, useState } from "react";

function getSavedValue(key: any, initialValue: any) {
  const savedValue = localStorage.getItem(key);

  // If savedValue is null, return the initial value
  if (savedValue) return JSON.parse(savedValue);

  if (initialValue instanceof Function) return initialValue();

  return initialValue;
}
export function useLocalStorage(key: any, initialValue?: any) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
