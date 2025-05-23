'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for throttled localStorage operations
 * Reduces frequency of expensive localStorage writes during rapid state changes
 * 
 * @param key - The localStorage key to use
 * @param initialValue - The initial value to use if no value exists in localStorage
 * @param delay - The throttle delay in milliseconds (default: 1000ms)
 * @returns A tuple containing the current value and a setter function
 */
export function useThrottledStorage<T>(
  key: string,
  initialValue: T,
  delay = 1000
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to hold the current value
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Ref to track the timeout ID for throttling
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to track the latest value (to avoid closure issues with the timeout)
  const latestValueRef = useRef<T>(value);
  
  // Update the latest value ref when value changes
  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  // Save to localStorage with throttling
  const saveToStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const valueToStore = latestValueRef.current;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch a storage event so other components can react to the change
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(valueToStore),
        storageArea: localStorage
      }));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
      
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn("LocalStorage quota exceeded. Consider implementing data cleanup.");
      }
    }
  }, [key]);

  // Set up the effect to save to localStorage when value changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to save the value after the delay
    timeoutRef.current = setTimeout(saveToStorage, delay);
    
    // Clean up the timeout when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        
        // Save any pending changes when unmounting
        saveToStorage();
      }
    };
  }, [value, delay, saveToStorage]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setValue(newValue);
        } catch (error) {
          console.error(`Error parsing storage event value for key "${key}":`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [value, setValue];
}
