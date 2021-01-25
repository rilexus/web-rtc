import { useState } from "react";

type RemoveItemFunction = (key: string) => void

function useLocalStorage<StateType = any>(
  key: string,
  initialValue: StateType
): [StateType, (state: StateType | ((state: StateType) => StateType)) => void, RemoveItemFunction] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<StateType>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: any) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore: StateType =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  const removeItem = (key: string) => {
    setValue(() => {
      window.localStorage.removeItem(key);
      return null;
    });
  };

  return [storedValue, setValue, removeItem];
}
export { useLocalStorage };
