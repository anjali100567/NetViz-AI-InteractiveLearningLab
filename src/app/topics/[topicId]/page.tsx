'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  PlayCircle, 
  Cpu, 
  CheckCircle2, 
  Lightbulb, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  BookOpen 
} from 'lucide-react';
import { TOPICS_DATA } from '@/lib/content/topicsData';
import { AiTutorPanel } from '@/components/ai/AiTutorPanel';

export default function TopicDetailPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = use(params);
  const topic = TOPICS_DATA[resolvedParams.topicId];

  if (!topic) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button & Layer pill */}
      <div className="flex items-center justify-between pb-4">
        <Link
          href="/topics"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Topics</span>
        </Link>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          {topic.layer} Layer
        </span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">{topic.name}</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {topic.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {topic.simulationId && (
            <Link
              href={`/simulator?scenario=${topic.simulationId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Run Simulation</span>
            </Link>
          )}
          {topic.labId && (
            <Link
              href={`/labs/${topic.labId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Launch Guided Lab</span>
            </Link>
          )}
          <Link
            href={`/practice/${topic.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Practice ({topic.practiceCount} Qs)</span>
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left Column: Explanations & Misconceptions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prerequisites */}
          <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 block mb-2">
              PREREQUISITES:
            </span>
            <div className="flex flex-wrap gap-2">
              {topic.prerequisites.map((prereq) => (
                <span
                  key={prereq}
                  className="px-3 py-1 rounded-lg bg-navy-950 border border-slate-800 text-xs font-mono text-cyan-300"
                >
                  ✓ {prereq}
                </span>
              ))}
            </div>
          </div>

          {/* Beginner Explanation */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              Beginner Explanation
            </h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed font-sans">
              {topic.beginnerExplanation}
            </p>
          </div>

          {/* Technical Deep Dive */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-400" />
              Technical Protocol Specification
            </h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed font-sans">
              {topic.technicalExplanation}
            </p>
          </div>

          {/* Real World Analogy */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1.5">
              <Lightbulb className="h-4 w-4" />
              <span>Real-World Analogy</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{topic.realWorldAnalogy}</p>
          </div>

          {/* Common Misconceptions */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5" />
              Common Student Misconceptions (Exam & Viva Prep)
            </h3>
            <div className="space-y-2.5">
              {topic.commonMisconceptions.map((misc, i) => (
                <div key={i} className="p-3 rounded-xl bg-navy-950 border border-rose-500/20 text-xs text-slate-300 leading-relaxed">
                  {misc}
                </div>
              ))}
            </div>
          </div>

          {/* What-If Scenarios */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5" />
              What-If Scenarios
            </h3>
            <div className="space-y-3">
              {topic.whatIfScenarios.map((whatif, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 text-xs">
                  <span className="font-bold text-cyan-300 block mb-1">Q: {whatif.question}</span>
                  <p className="text-slate-300 leading-relaxed">{whatif.expectedOutcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Tutor Panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <AiTutorPanel topicId={topic.id} labId={topic.labId} />
          </div>
        </div>
      </div>
    </div>
  );
}
