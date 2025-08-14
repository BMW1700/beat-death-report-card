import { useState, useCallback } from 'react';

export interface CommunityCorrection {
  imageHash: string;
  originalDetection: string;
  correctedItem: string;
  category: string;
  confidence: number;
  timestamp: number;
  userCount: number; // How many users confirmed this correction
}

export interface CommunityLearningData {
  [imageHash: string]: CommunityCorrection;
}

// Community learning settings
const COMMUNITY_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_COMMUNITY_CACHE_SIZE = 200;
const MIN_USER_CONFIRMATIONS = 1; // Minimum confirmations needed to trust correction

export const useCommunityLearning = () => {
  const [communityData, setCommunityData] = useState<CommunityLearningData>(() => {
    try {
      const stored = localStorage.getItem('community-learning-cache');
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

  const getCommunityCorrection = useCallback(async (file: File): Promise<CommunityCorrection | null> => {
    try {
      const hash = await generateImageHash(file);
      const correction = communityData[hash];
      
      if (correction && 
          (Date.now() - correction.timestamp) < COMMUNITY_CACHE_DURATION &&
          correction.userCount >= MIN_USER_CONFIRMATIONS) {
        return correction;
      }
      return null;
    } catch {
      return null;
    }
  }, [communityData, generateImageHash]);

  const addCommunityCorrection = useCallback(async (
    file: File, 
    originalDetection: string, 
    correctedItem: string, 
    category: string
  ) => {
    try {
      const hash = await generateImageHash(file);
      const existingCorrection = communityData[hash];
      
      const newCorrection: CommunityCorrection = {
        imageHash: hash,
        originalDetection: originalDetection.toLowerCase(),
        correctedItem: correctedItem.toLowerCase(),
        category,
        confidence: 95, // High confidence for community-corrected items
        timestamp: Date.now(),
        userCount: existingCorrection ? existingCorrection.userCount + 1 : 1
      };

      setCommunityData(prevData => {
        const entries = Object.entries(prevData);
        
        // Remove expired entries and limit cache size
        const validEntries = entries
          .filter(([, correction]) => (Date.now() - correction.timestamp) < COMMUNITY_CACHE_DURATION)
          .slice(-MAX_COMMUNITY_CACHE_SIZE + 1);

        const newData = Object.fromEntries(validEntries);
        newData[hash] = newCorrection;

        // Persist to localStorage
        try {
          localStorage.setItem('community-learning-cache', JSON.stringify(newData));
        } catch {
          // Handle localStorage quota exceeded
        }

        return newData;
      });

      return newCorrection;
    } catch {
      return null;
    }
  }, [communityData, generateImageHash]);

  const searchSimilarCorrections = useCallback((detectedLabel: string): CommunityCorrection[] => {
    const normalizedLabel = detectedLabel.toLowerCase();
    
    return Object.values(communityData)
      .filter(correction => {
        // Check if the detected label is similar to any original detection
        const originalNormalized = correction.originalDetection.toLowerCase();
        return originalNormalized.includes(normalizedLabel) || 
               normalizedLabel.includes(originalNormalized) ||
               correction.correctedItem.includes(normalizedLabel);
      })
      .filter(correction => 
        (Date.now() - correction.timestamp) < COMMUNITY_CACHE_DURATION &&
        correction.userCount >= MIN_USER_CONFIRMATIONS
      )
      .sort((a, b) => b.userCount - a.userCount); // Sort by user confirmations
  }, [communityData]);

  const getCommunityStats = useCallback(() => {
    const validCorrections = Object.values(communityData)
      .filter(correction => (Date.now() - correction.timestamp) < COMMUNITY_CACHE_DURATION);
    
    return {
      totalCorrections: validCorrections.length,
      totalUserContributions: validCorrections.reduce((sum, c) => sum + c.userCount, 0),
      categories: [...new Set(validCorrections.map(c => c.category))],
      recentCorrections: validCorrections
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
    };
  }, [communityData]);

  const clearCommunityData = useCallback(() => {
    setCommunityData({});
    localStorage.removeItem('community-learning-cache');
  }, []);

  return {
    getCommunityCorrection,
    addCommunityCorrection,
    searchSimilarCorrections,
    getCommunityStats,
    clearCommunityData
  };
};