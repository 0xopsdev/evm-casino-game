'use client'
import { useState, useEffect } from 'react';

// Define the type for the hook's return value
const useIsMobile = (breakpoint: number = 768): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Define a media query based on the breakpoint
            const mediaQuery: MediaQueryList = window.matchMedia(`(max-width: ${breakpoint}px)`);

            // Event listener callback to update state
            const handleChange = (e: MediaQueryListEvent): void => {
                setIsMobile(e.matches);
            };

            // Add the event listener
            mediaQuery.addEventListener('change', handleChange);

            // Set the initial state
            setIsMobile(mediaQuery.matches);

            // Cleanup function to remove the event listener on unmount
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;