import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set a timer to update the debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup on value change or unmount
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
