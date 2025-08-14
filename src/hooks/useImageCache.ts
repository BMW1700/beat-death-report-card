import { useState, useCallback } from 'react';

interface CacheEntry {
  imageHash: string;
  results: any;
  timestamp: number;
}

interface ImageCache {
  [key: string]: CacheEntry;
}

// Cache results for 1 hour
const CACHE_DURATION = 60 * 60 * 1000;
const MAX_CACHE_SIZE = 50;

export const useImageCache = () => {
  const [cache, setCache] = useState<ImageCache>(() => {
    try {
      const stored = localStorage.getItem('death-scanner-cache');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const generateImageHash = useCallback(async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  const getCachedResult = useCallback(async (file: File): Promise<any | null> => {
    try {
      const hash = await generateImageHash(file);
      const entry = cache[hash];
      
      if (entry && (Date.now() - entry.timestamp) < CACHE_DURATION) {
        return entry.results;
      }
      return null;
    } catch {
      return null;
    }
  }, [cache, generateImageHash]);

  const setCachedResult = useCallback(async (file: File, results: any) => {
    try {
      const hash = await generateImageHash(file);
      const newEntry: CacheEntry = {
        imageHash: hash,
        results,
        timestamp: Date.now()
      };

      setCache(prevCache => {
        const entries = Object.entries(prevCache);
        
        // Remove expired entries and limit cache size
        const validEntries = entries
          .filter(([, entry]) => (Date.now() - entry.timestamp) < CACHE_DURATION)
          .slice(-MAX_CACHE_SIZE + 1);

        const newCache = Object.fromEntries(validEntries);
        newCache[hash] = newEntry;

        // Persist to localStorage
        try {
          localStorage.setItem('death-scanner-cache', JSON.stringify(newCache));
        } catch {
          // Handle localStorage quota exceeded
        }

        return newCache;
      });
    } catch {
      // Handle errors silently
    }
  }, [generateImageHash]);

  const clearCache = useCallback(() => {
    setCache({});
    localStorage.removeItem('death-scanner-cache');
  }, []);

  return {
    getCachedResult,
    setCachedResult,
    clearCache
  };
};