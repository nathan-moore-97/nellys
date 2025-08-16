// useValidatedSessionStorage.ts
import { useState } from 'react';

export function useValidatedSessionStorage<T>(
    key: string,
    initialValue: T,
    validator: (data: unknown) => data is T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    // State initialization with validation
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            if (!item) return initialValue;
            
            const parsed = JSON.parse(item);
            return validator(parsed) ? parsed : initialValue;
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Setter function with validation
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            if (!validator(valueToStore)) {
                throw new Error(`Invalid data format for key "${key}"`);
            }

            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting sessionStorage key "${key}":`, error);
        }
    };

    const clearValue = () => {
        try {
            window.sessionStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing the session storage data")
        }
    };

    return [storedValue, setValue, clearValue];
}