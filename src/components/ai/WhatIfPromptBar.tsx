'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X, Sliders } from 'lucide-react';
import { parseWhatIfQuestion, WhatIfParseResult } from '@/lib/ai/whatIfParser';

interface WhatIfPromptBarProps {
  onApplyScenario: (result: WhatIfParseResult) => void;
}

export function WhatIfPromptBar({ onApplyScenario }: WhatIfPromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [proposal, setProposal] = useState<WhatIfParseResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const result = parseWhatIfQuestion(prompt);
    setProposal(result);
  };

  const handleConfirm = () => {
    if (proposal) {
      onApplyScenario(proposal);
      setProposal(null);
      setPrompt('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 text-cyan-400 pointer-events-none">
          <Sparkles className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Ask a what-if question: e.g. "Show what happens if window size is 2 and packet 3 is lost"'
          className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 text-xs sm:text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-lg font-sans"
        />
        <button
          type="submit"
          className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1"
        >
          <span>Simulate</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </form>

      {/* Confirmation Modal / Bar */}
      {proposal && (
        <div className="mt-3 p-4 rounded-xl bg-navy-950 border border-cyan-500/40 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 font-mono">
                AI SCENARIO GENERATOR
              </span>
              <p className="text-sm text-slate-200 font-medium mt-0.5">
                {proposal.confirmationMessage}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-cyan-300">Generated Config:</span>
                <span>{JSON.stringify(proposal.proposedConfig)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Confirm
              </button>
              <button
                onClick={() => setProposal(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
