'use client';

import { useState, useEffect } from 'react';
import { LayerType } from '../simulation/types';

export interface UserProgressData {
  completedTopics: string[];
  completedLabs: Record<string, { score: number; completedAt: string }>;
  practiceStats: {
    totalAnswered: number;
    totalCorrect: number;
    streakDays: number;
    lastPracticeDate: string;
  };
  weakTopics: string[];
  unlockedBadges: string[];
  savedScenarios: Array<{
    id: string;
    name: string;
    config: Record<string, unknown>;
    createdAt: string;
  }>;
}

const DEFAULT_PROGRESS: UserProgressData = {
  completedTopics: ['http-https', 'tcp-handshake'],
  completedLabs: {
    'lab-encapsulation': { score: 95, completedAt: new Date().toISOString() },
  },
  practiceStats: {
    totalAnswered: 24,
    totalCorrect: 21,
    streakDays: 3,
    lastPracticeDate: new Date().toISOString().split('T')[0],
  },
  weakTopics: ['tcp-ack-loss', 'subnetting-routing'],
  unlockedBadges: ['packet-pathfinder', 'layer-by-layer-learner'],
  savedScenarios: [],
};

const STORAGE_KEY = 'netviz_ai_user_progress_v1';

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgressData>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // Use fallback
    }
    setIsLoaded(true);
  }, []);

  const saveProgress = (newData: UserProgressData) => {
    setProgress(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // ignore
    }
  };

  const completeTopic = (topicId: string) => {
    if (!progress.completedTopics.includes(topicId)) {
      const updated = {
        ...progress,
        completedTopics: [...progress.completedTopics, topicId],
      };
      saveProgress(updated);
    }
  };

  const completeLab = (labId: string, score: number) => {
    const updated = {
      ...progress,
      completedLabs: {
        ...progress.completedLabs,
        [labId]: { score, completedAt: new Date().toISOString() },
      },
    };
    saveProgress(updated);
  };

  const recordPracticeResult = (isCorrect: boolean, topicId: string) => {
    const totalAnswered = progress.practiceStats.totalAnswered + 1;
    const totalCorrect = progress.practiceStats.totalCorrect + (isCorrect ? 1 : 0);
    
    // Update weak topics
    let weakTopics = [...progress.weakTopics];
    if (!isCorrect && !weakTopics.includes(topicId)) {
      weakTopics.push(topicId);
    } else if (isCorrect && weakTopics.includes(topicId)) {
      weakTopics = weakTopics.filter(t => t !== topicId);
    }

    const updated: UserProgressData = {
      ...progress,
      practiceStats: {
        ...progress.practiceStats,
        totalAnswered,
        totalCorrect,
      },
      weakTopics,
    };
    saveProgress(updated);
  };

  const unlockBadge = (badgeId: string) => {
    if (!progress.unlockedBadges.includes(badgeId)) {
      const updated = {
        ...progress,
        unlockedBadges: [...progress.unlockedBadges, badgeId],
      };
      saveProgress(updated);
    }
  };

  const getLayerMastery = (layer: LayerType): number => {
    const layerTopicWeights: Record<LayerType, number> = {
      'Application': 80,
      'Transport': 65,
      'Network': 50,
      'Data Link': 70,
      'Physical': 45,
    };
    return layerTopicWeights[layer] || 50;
  };

  return {
    progress,
    isLoaded,
    completeTopic,
    completeLab,
    recordPracticeResult,
    unlockBadge,
    getLayerMastery,
  };
}
