'use client';

import React from 'react';
import { Clock, Play, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { SimulationEvent } from '@/lib/simulation/types';
import { getStatusColor } from '@/lib/utils';

interface EventTimelineProps {
  events: SimulationEvent[];
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export function EventTimeline({ events, currentStep, onSelectStep }: EventTimelineProps) {
  return (
    <div className="w-full rounded-2xl bg-navy-900 border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          <h3 className="font-bold text-white text-sm">Deterministic Event Timeline</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Step {Math.min(currentStep + 1, events.length)} of {events.length}
        </span>
      </div>

      <div className="mt-3 space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[440px]">
        {events.map((evt, idx) => {
          const isCurrent = idx === currentStep;
          const isPast = idx < currentStep;
          const status = getStatusColor(evt.status);

          return (
            <div
              key={evt.eventId}
              onClick={() => onSelectStep(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isCurrent
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                  : isPast
                  ? 'border-slate-800 bg-navy-950/40 opacity-75 hover:opacity-100 hover:border-slate-700'
                  : 'border-slate-800/60 bg-navy-950/20 opacity-40 hover:opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{evt.eventId}
                  </span>
                  <span className="text-xs font-mono text-slate-400">+{evt.timestamp}ms</span>
                  <span className="text-xs font-bold text-slate-200">{evt.protocol}</span>
                </div>

                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                  {status.label}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {evt.explanation}
              </p>

              {evt.technicalDetails && isCurrent && (
                <div className="mt-2 p-2 rounded-lg bg-navy-900 border border-slate-800 font-mono text-[11px] text-cyan-300/90 leading-tight">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">TECHNICAL DETAILS</span>
                  {evt.technicalDetails}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
