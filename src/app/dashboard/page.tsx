'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Award, 
  Play, 
  Clock, 
  Sparkles,
  TrendingUp,
  RotateCcw,
  Eye,
  Route,
  GraduationCap
} from 'lucide-react';
import { useUserProgress } from '@/lib/store/userProgressStore';
import { BADGES_DATA } from '@/lib/content/badgesData';
import { UNIVERSITY_LABS } from '@/lib/content/universityLabsData';
import { TOPICS_DATA } from '@/lib/content/topicsData';

export default function DashboardPage() {
  const { progress, getLayerMastery } = useUserProgress();
  const layers = ['Application', 'Transport', 'Network', 'Data Link', 'Physical'] as const;

  const recommendedLab = UNIVERSITY_LABS['exp-crc'] || Object.values(UNIVERSITY_LABS)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans">
      {/* Top Greeting & Streak Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Student Learning Dashboard
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Active Semester Lab
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose between Layer-wise Visualizer, Overall Network Journey, and Practical University Guided Labs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-navy-900 border border-slate-800">
            <Flame className="h-5 w-5 text-amber-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">DAILY STREAK</span>
              <span className="text-sm font-extrabold text-white">{progress.practiceStats.streakDays} Days Active</span>
            </div>
          </div>

          <Link
            href="/layer-visualizer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Eye className="h-4 w-4" />
            <span>Open Layer Visualizer</span>
          </Link>
        </div>
      </div>

      {/* 4 Separate Progress Trackers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
            VISUAL LEARNING PROGRESS
          </span>
          <span className="text-2xl font-black text-cyan-400">68%</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Across 5 OSI Layers</span>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
            SIMULATION PROGRESS
          </span>
          <span className="text-2xl font-black text-blue-400">18 / 30</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Protocols Observed</span>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
            LABORATORY PROGRESS
          </span>
          <span className="text-2xl font-black text-emerald-400">
            {Object.keys(progress.completedLabs).length} / {Object.keys(UNIVERSITY_LABS).length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Experiments Submitted</span>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
            PRACTICE ACCURACY
          </span>
          <span className="text-2xl font-black text-amber-400">
            {progress.practiceStats.totalAnswered > 0
              ? Math.round((progress.practiceStats.totalCorrect / progress.practiceStats.totalAnswered) * 100)
              : 0}%
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">{progress.practiceStats.totalCorrect} Correct Answers</span>
        </div>
      </div>

      {/* 3 Main Entry Modes (Prominent Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <Link
          href="/layer-visualizer"
          className="group rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-cyan-500/40 hover:border-cyan-400 p-5 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">MODE 1</span>
            <Eye className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            Layer-Wise Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Study individual layers in isolation. Deep dive into TCP vs UDP, Header construction, Port Multiplexing, and Demultiplexing.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
            <span>Explore layers</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/network-journey"
          className="group rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-blue-500/40 hover:border-blue-400 p-5 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold text-blue-400 uppercase">MODE 2</span>
            <Route className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
            Overall Network Journey
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Follow end-to-end packets moving through Client $\rightarrow$ Switch $\rightarrow$ Router $\rightarrow$ Cloud $\rightarrow$ Server. Click devices to see de-encapsulation!
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-400">
            <span>Follow packet journey</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/labs"
          className="group rounded-2xl bg-gradient-to-br from-navy-900 to-navy-850 border border-emerald-500/40 hover:border-emerald-400 p-5 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">MODE 3</span>
            <GraduationCap className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            University Guided Labs
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Practical university-syllabus experiments: CRC, Bit Stuffing, Go-Back-N, Dijkstra Routing, Subnetting, and Sockets.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <span>Open lab experiments</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Detailed Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Next Guided Lab */}
          <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-cyan-500/30 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 font-mono">
                RECOMMENDED UNIVERSITY LAB EXPERIMENT
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Difficulty: {recommendedLab.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              Experiment #{recommendedLab.expNumber < 10 ? `0${recommendedLab.expNumber}` : recommendedLab.expNumber}: {recommendedLab.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {recommendedLab.aim}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  {recommendedLab.durationMinutes} mins
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  {recommendedLab.layer} Layer
                </span>
              </div>

              <Link
                href={`/labs/${recommendedLab.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <span>Perform Experiment</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Layer Mastery Progress */}
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-3 border-b border-slate-800">
              <Layers className="h-4 w-4 text-cyan-400" />
              OSI / TCP-IP Layer Mastery
            </h3>

            <div className="mt-4 space-y-3">
              {layers.map((layer) => {
                const mastery = getLayerMastery(layer);
                return (
                  <div key={layer}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-300">{layer} Layer</span>
                      <span className="font-mono text-cyan-300 font-semibold">{mastery}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Weak Topics */}
        <div className="space-y-6">
          {/* Completed Badges */}
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Earned Badges ({progress.unlockedBadges.length}/{BADGES_DATA.length})
              </h3>
              <Link href="/progress" className="text-xs text-cyan-400 font-semibold hover:underline">
                All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {BADGES_DATA.slice(0, 4).map((badge) => {
                const isUnlocked = progress.unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isUnlocked
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-navy-950/40 text-slate-400 opacity-60'
                    }`}
                  >
                    <Award className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                    <span className="text-xs font-bold block truncate">{badge.name}</span>
                    <span className="text-[9px] font-mono block mt-0.5">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weak Topics */}
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
              Topics Requiring Revision
            </h3>
            <div className="space-y-2">
              {progress.weakTopics.map((topicId) => {
                const topic = TOPICS_DATA[topicId] || { name: topicId };
                return (
                  <Link
                    key={topicId}
                    href={`/topics/${topicId}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 hover:bg-slate-800 border border-rose-500/20 text-xs transition-colors"
                  >
                    <span className="font-semibold text-slate-200">{topic.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
