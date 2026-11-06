'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Filter,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { UNIVERSITY_LABS } from '@/lib/content/universityLabsData';
import { useUserProgress } from '@/lib/store/userProgressStore';

export default function UniversityLabsCatalogPage() {
  const { progress } = useUserProgress();
  const [filterLayer, setFilterLayer] = useState<string>('all');

  const labs = Object.values(UNIVERSITY_LABS);

  const filteredLabs = labs.filter((lab) => {
    return filterLayer === 'all' || lab.layer.toLowerCase() === filterLayer.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold mb-2">
            <GraduationCap className="h-4 w-4" />
            <span>UNIVERSITY COMPUTER NETWORKS LABORATORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Practical Guided Laboratory Experiments
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Syllabus-oriented experiments designed for Computer Science Engineering. Each lab features an <strong className="text-cyan-300">Aim, Theory, Procedure, Interactive Workspace, Observation Table, Viva Questions, and Submission Checklist</strong>.
          </p>
        </div>

        {/* Layer Filter Pills */}
        <div className="flex items-center gap-1 bg-navy-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {['all', 'Physical', 'Data Link', 'Network', 'Transport', 'Application'].map((l) => (
            <button
              key={l}
              onClick={() => setFilterLayer(l)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterLayer === l
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {l === 'all' ? 'All Experiments' : l}
            </button>
          ))}
        </div>
      </div>

      {/* Difference Banner between Simulation and Guided Lab */}
      <div className="my-6 p-4 rounded-2xl bg-navy-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-white block">University Lab vs Visual Simulation</span>
            <span className="text-slate-400">
              Visual simulations explain <em>concepts</em>. Guided labs require you to <em>configure parameters, calculate checksums, examine logic, and verify output against syllabus benchmarks</em>.
            </span>
          </div>
        </div>

        <Link
          href="/layer-visualizer"
          className="flex-shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-1"
        >
          <span>Open Layer Visualizer instead</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* University Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => {
          const attempt = progress.completedLabs[lab.id];
          const isCompleted = Boolean(attempt);

          return (
            <div
              key={lab.id}
              className={`rounded-2xl border p-5 shadow-xl flex flex-col justify-between transition-all group ${
                isCompleted
                  ? 'bg-gradient-to-b from-navy-900 to-navy-950 border-emerald-500/40'
                  : 'bg-navy-900 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    EXP #{lab.expNumber < 10 ? `0${lab.expNumber}` : lab.expNumber} • {lab.layer}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      lab.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                      lab.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {lab.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        {attempt.score}%
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {lab.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {lab.aim}
                </p>

                {/* Requirements Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {lab.requirements.map((r, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-navy-950 text-slate-400 border border-slate-800 font-mono">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {lab.durationMinutes} mins
                </span>

                <Link
                  href={`/labs/${lab.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
                >
                  <span>{isCompleted ? 'Repeat Experiment' : 'Start Experiment'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
