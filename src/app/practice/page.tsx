'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award, 
  Layers, 
  HelpCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { PRACTICE_QUESTIONS } from '@/lib/content/practiceQuestions';
import { useUserProgress } from '@/lib/store/userProgressStore';

export default function PracticeCatalogPage() {
  const { progress } = useUserProgress();

  const practiceCategories = [
    { id: 'tcp-handshake', name: 'TCP Protocols & Handshakes', count: 10, layer: 'Transport', desc: 'Predict SYN/ACK flags, sequence math, and duplicate detection.' },
    { id: 'http-https', name: 'UDP vs TCP & Web Protocols', count: 10, layer: 'Transport', desc: 'Header sizes, latency comparisons, and socket multiplexing.' },
    { id: 'subnetting-routing', name: 'IP Subnetting & Addressing', count: 10, layer: 'Network', desc: 'CIDR masks, network/broadcast calculations, and host ranges.' },
    { id: 'tcp-congestion-control', name: 'TCP Congestion Control & AIMD', count: 10, layer: 'Transport', desc: 'Slow start exponential growth, SSTHRESH, and Tahoe vs Reno.' },
    { id: 'arp-protocol', name: 'OSI & TCP-IP 5-Layer Stack', count: 10, layer: 'Data Link', desc: 'PDU names, header encapsulation, MAC tables, and TTL hops.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>PRACTICE ROUND SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Semester & Viva Exam Practice Challenges
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Test your conceptual clarity with realistic packet questions, routing table matches, subnetting math, and viva troubleshooting scenarios.
          </p>
        </div>

        {/* Global Practice Stats Banner */}
        <div className="flex items-center gap-3 bg-navy-900 border border-slate-800 p-3 rounded-2xl">
          <div className="text-center px-3">
            <span className="text-xl font-black text-emerald-400">
              {progress.practiceStats.totalAnswered > 0
                ? Math.round((progress.practiceStats.totalCorrect / progress.practiceStats.totalAnswered) * 100)
                : 0}%
            </span>
            <span className="text-[10px] text-slate-400 block font-mono uppercase">Accuracy</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="text-center px-3">
            <span className="text-xl font-black text-cyan-400">
              {progress.practiceStats.totalAnswered}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono uppercase">Completed</span>
          </div>
        </div>
      </div>

      {/* Rounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {practiceCategories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl bg-navy-900 border border-slate-800 hover:border-emerald-500/40 p-5 shadow-xl flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {cat.layer} Layer
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {cat.count} Questions
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {cat.desc}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Untimed / Adaptive
              </span>

              <Link
                href={`/practice/${cat.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                <span>Start Practice</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
