'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Layers, 
  Eye, 
  Route, 
  GraduationCap, 
  Sparkles, 
  Search, 
  Bot, 
  Activity, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';
import { WhatIfPromptBar } from '@/components/ai/WhatIfPromptBar';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden font-sans">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Computer Networks Learning Lab</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Learn Computer Networks by{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Watching Packets Move.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Master networking through two distinct visual learning modes plus syllabus-oriented university experiments: inspect individual layers in isolation, follow end-to-end packet journeys across routers, or perform guided laboratory practicals.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/layer-visualizer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <Eye className="h-4 w-4" />
            <span>Open Layer Visualizer</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/network-journey"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all hover:scale-105"
          >
            <Route className="h-4 w-4 text-cyan-400" />
            <span>Start Network Journey</span>
          </Link>

          <Link
            href="/labs"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-900 hover:bg-slate-800 text-slate-300 font-medium text-sm border border-slate-800 transition-all"
          >
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            <span>University Guided Labs</span>
          </Link>
        </div>

        {/* What-If Interactive Prompt Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <WhatIfPromptBar
            onApplyScenario={(res) => {
              router.push(`/network-journey?scenario=${res.scenarioId || 'packet-encapsulation'}`);
            }}
          />
        </div>
      </section>

      {/* 3 Dedicated Core Learning Paths */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Layer Visualizer */}
          <Link
            href="/layer-visualizer"
            className="group relative rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-cyan-500/40 hover:border-cyan-400 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 group-hover:scale-110 transition-transform">
              <Eye className="h-6 w-6" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">MODE 1</span>
            <h3 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
              Layer-Wise Visualizer
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Study individual layers in isolation. Deep dive into TCP and UDP, animated header field construction, port multiplexing, and demultiplexing.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <span>Inspect isolated layers</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Network Journey */}
          <Link
            href="/network-journey"
            className="group relative rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-blue-500/40 hover:border-blue-400 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
              <Route className="h-6 w-6" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-bold">MODE 2</span>
            <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">
              Overall Network Journey
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Follow end-to-end packets through Client, Switch, Router, Cloud, and Server. Click any router to see internal de-encapsulation and MAC rewriting!
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <span>Follow end-to-end flow</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: University Guided Labs */}
          <Link
            href="/labs"
            className="group relative rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-emerald-500/40 hover:border-emerald-400 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">SYLLABUS LABS</span>
            <h3 className="text-xl font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
              University Guided Labs
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Practical syllabus experiments: CRC error detection, Bit stuffing, Sliding window, Go-Back-N, Dijkstra routing, Subnetting, and Socket programming.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span>Perform practicals</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Designed for Real Computer Networks Mastery
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Learn → Observe → Predict → Configure → Run → Analyze → Practice → Reflect
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
            <Cpu className="h-6 w-6 text-cyan-400 mb-2" />
            <h4 className="font-bold text-white text-sm">Deterministic Engine</h4>
            <p className="text-xs text-slate-400 mt-1">
              Zero AI hallucinations on packet sequences. Timers, sequence numbers, and CWND are mathematically accurate.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
            <Search className="h-6 w-6 text-blue-400 mb-2" />
            <h4 className="font-bold text-white text-sm">Wireshark Analyzer</h4>
            <p className="text-xs text-slate-400 mt-1">
              Inspect real packet capture traces, filter with tcp.flags.syn==1, and decode hex dumps field-by-field.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
            <Bot className="h-6 w-6 text-amber-400 mb-2" />
            <h4 className="font-bold text-white text-sm">State-Aware AI Tutor</h4>
            <p className="text-xs text-slate-400 mt-1">
              Provides hints, answers what-if questions, and references specific packet IDs from current simulation state.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 mb-2" />
            <h4 className="font-bold text-white text-sm">Viva Exam Prep</h4>
            <p className="text-xs text-slate-400 mt-1">
              Oral exam questions with immediate answers, observation tables, and submission checklists.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
