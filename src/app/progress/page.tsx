'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Award, 
  Flame, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useUserProgress } from '@/lib/store/userProgressStore';
import { BADGES_DATA } from '@/lib/content/badgesData';
import { GUIDED_LABS } from '@/lib/content/labsData';
import { TOPICS_DATA } from '@/lib/content/topicsData';

export default function ProgressDashboardPage() {
  const { progress, getLayerMastery } = useUserProgress();
  const layers = ['Application', 'Transport', 'Network', 'Data Link', 'Physical'] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold mb-2">
            <Award className="h-3.5 w-3.5" />
            <span>STUDENT MASTERY RECORD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Learning Progress & Badges
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Track your semester networking laboratory mastery, exam readiness, lab completions, and earned badges.
          </p>
        </div>

        {/* Learning Streak Banner */}
        <div className="flex items-center gap-3 bg-navy-900 border border-slate-800 p-3 rounded-2xl">
          <Flame className="h-6 w-6 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">DAILY STREAK</span>
            <span className="text-sm font-extrabold text-white">{progress.practiceStats.streakDays} Consecutive Days</span>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-1">PRACTICE ACCURACY</span>
          <span className="text-3xl font-black text-emerald-400">
            {progress.practiceStats.totalAnswered > 0
              ? Math.round((progress.practiceStats.totalCorrect / progress.practiceStats.totalAnswered) * 100)
              : 0}%
          </span>
          <span className="text-xs text-slate-500 block mt-1">{progress.practiceStats.totalCorrect} of {progress.practiceStats.totalAnswered} Correct</span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-1">COMPLETED LABS</span>
          <span className="text-3xl font-black text-cyan-400">
            {Object.keys(progress.completedLabs).length}
          </span>
          <span className="text-xs text-slate-500 block mt-1">Average Score: 95%</span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-1">TOPICS MASTERED</span>
          <span className="text-3xl font-black text-blue-400">
            {progress.completedTopics.length}
          </span>
          <span className="text-xs text-slate-500 block mt-1">Across 5 Layers</span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-1">EARNED BADGES</span>
          <span className="text-3xl font-black text-amber-400">
            {progress.unlockedBadges.length} / {BADGES_DATA.length}
          </span>
          <span className="text-xs text-slate-500 block mt-1">Achievements Unlocked</span>
        </div>
      </div>

      {/* Layer Mastery Progress Bars */}
      <div className="mt-8 rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl">
        <h3 className="font-bold text-white text-base flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-cyan-400" />
          OSI / TCP-IP Layer Mastery Distribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {layers.map((layer) => {
            const mastery = getLayerMastery(layer);
            return (
              <div key={layer} className="p-4 rounded-xl bg-navy-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-200 block mb-1">{layer}</span>
                <span className="text-2xl font-black text-cyan-400 font-mono block mb-2">{mastery}%</span>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            Official Networking Badges & Certificates
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {progress.unlockedBadges.length} of {BADGES_DATA.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-navy-900 shadow-lg'
                    : 'border-slate-800 bg-navy-950/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl border ${
                    isUnlocked
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-600 border-slate-700'
                  }`}>
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{badge.name}</h4>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isUnlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isUnlocked ? 'EARNED' : 'LOCKED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Labs List */}
      <div className="mt-8 rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl">
        <h3 className="font-bold text-white text-base flex items-center gap-2 mb-4">
          <Cpu className="h-5 w-5 text-cyan-400" />
          Completed Guided Labs Log
        </h3>

        <div className="divide-y divide-slate-800/80">
          {Object.entries(progress.completedLabs).map(([labId, data]) => {
            const lab = GUIDED_LABS[labId] || { title: labId, layer: 'Transport' };
            return (
              <div key={labId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{lab.title}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{lab.layer} Layer</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
                    Score: {data.score}%
                  </span>
                  <Link href={`/labs/${labId}`} className="text-cyan-400 hover:underline font-medium">
                    Review →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
