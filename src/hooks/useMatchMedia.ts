import { useState, useEffect } from 'react';

export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) {
      // Fallback for environments without matchMedia support
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

// Common breakpoint hooks
export const useIsMobile = () => useMatchMedia('(max-width: 768px)');
export const useIsTablet = () => useMatchMedia('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMatchMedia('(min-width: 1025px)');
export const useIsDarkMode = () => useMatchMedia('(prefers-color-scheme: dark)');
export const useIsReducedMotion = () => useMatchMedia('(prefers-reduced-motion: reduce)');
