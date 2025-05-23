'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Helper function to get animation classes based on reduced motion preference
 * @param standardAnimation - The animation class to use when reduced motion is not preferred
 * @param reducedAnimation - The animation class to use when reduced motion is preferred
 * @param prefersReducedMotion - Boolean indicating if reduced motion is preferred
 * @returns The appropriate animation class
 */
export function getAnimationClasses(
  standardAnimation: string,
  reducedAnimation: string,
  prefersReducedMotion: boolean
): string {
  return prefersReducedMotion ? reducedAnimation : standardAnimation;
}
