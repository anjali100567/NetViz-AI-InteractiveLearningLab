'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Bot, 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Check, 
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState<'deterministic' | 'gemini' | 'openai'>('deterministic');
  const [defaultSpeed, setDefaultSpeed] = useState<number>(1);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('netviz_ai_provider', aiProvider);
    if (apiKey) localStorage.setItem('netviz_api_key', apiKey);
    localStorage.setItem('netviz_default_speed', String(defaultSpeed));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset your learning progress, completed labs, and badges?')) {
      localStorage.removeItem('netviz_ai_user_progress_v1');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Settings className="h-7 w-7 text-cyan-400" />
          Lab Settings & AI Configuration
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure your simulation engine defaults, optional LLM keys, and student profile preferences.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* AI Tutor Engine Configuration */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">NetViz AI Tutor Mode</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            By default, NetViz AI uses a built-in deterministic offline engine that strictly references actual simulation events and packets without hallucination. You can optionally connect an external LLM API key.
          </p>

          <div className="space-y-3 font-sans text-xs">
            <label className="block text-slate-300 font-semibold">Tutor AI Provider:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'deterministic', name: 'Built-in Engine', badge: 'Zero Cost / Offline' },
                { id: 'gemini', name: 'Google Gemini', badge: 'Gemini 1.5 Pro / Flash' },
                { id: 'openai', name: 'OpenAI GPT-4o', badge: 'GPT-4o Mini / Omni' },
              ].map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setAiProvider(provider.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    aiProvider === provider.id
                      ? 'border-cyan-400 bg-cyan-950/40 text-white font-bold'
                      : 'border-slate-800 bg-navy-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-xs text-slate-200">{provider.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">{provider.badge}</span>
                </button>
              ))}
            </div>

            {aiProvider !== 'deterministic' && (
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Enter {aiProvider === 'gemini' ? 'Google AI Studio' : 'OpenAI'} API Key:</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-... or AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-400 block">
                  Keys are stored locally in your browser and sent directly to the model endpoint.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Simulation Preferences */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="h-5 w-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Default Simulation Speed</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Choose the default packet movement speed for animation journeys and guided labs.
          </p>

          <div className="flex gap-2 font-mono text-xs">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setDefaultSpeed(s)}
                className={`flex-1 py-2 rounded-xl border font-bold transition-all ${
                  defaultSpeed === s
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s}x Speed
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            {saved ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            <span>{saved ? 'Preferences Saved!' : 'Save Settings'}</span>
          </button>

          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Learning Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
}
