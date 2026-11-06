'use client';

import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  FastForward, 
  Bookmark, 
  Layers, 
  Zap,
  SlidersHorizontal 
} from 'lucide-react';
import { SIMULATION_SCENARIOS } from '@/lib/simulation/engine';

interface SimulationControlsProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onOpenSettings?: () => void;
}

export function SimulationControls({
  isRunning,
  onTogglePlay,
  onStepForward,
  onReset,
  speed,
  onChangeSpeed,
  selectedScenarioId,
  onSelectScenario,
  onOpenSettings,
}: SimulationControlsProps) {
  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="w-full rounded-2xl bg-navy-900 border border-slate-800 p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
      {/* Scenario Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Scenario:</span>
        <select
          value={selectedScenarioId}
          onChange={(e) => onSelectScenario(e.target.value)}
          className="bg-navy-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-cyan-400"
        >
          {Object.values(SIMULATION_SCENARIOS).map((sc) => (
            <option key={sc.id} value={sc.id}>
              {sc.name} ({sc.protocol})
            </option>
          ))}
        </select>
      </div>

      {/* Main Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          title="Reset Simulation"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={onTogglePlay}
          className={`flex h-10 px-5 items-center gap-2 rounded-xl font-semibold text-xs shadow-lg transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
          }`}
        >
          {isRunning ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          <span>{isRunning ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={onStepForward}
          title="Step to Next Event"
          className="flex h-10 px-3 items-center gap-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors"
        >
          <SkipForward className="h-4 w-4" />
          <span className="hidden sm:inline">Step</span>
        </button>
      </div>

      {/* Speed & Tuning */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400">Speed:</span>
        <div className="flex rounded-xl bg-navy-950 p-1 border border-slate-800">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                speed === s
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
