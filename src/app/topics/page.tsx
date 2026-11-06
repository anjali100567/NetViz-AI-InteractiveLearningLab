'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Layers, 
  ArrowRight, 
  Cpu, 
  PlayCircle, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { TOPICS_DATA } from '@/lib/content/topicsData';
import { LayerType } from '@/lib/simulation/types';

export default function TopicsExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<string>('all');

  const topics = Object.values(TOPICS_DATA);

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.layer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLayer = selectedLayer === 'all' || t.layer === selectedLayer;
    return matchesSearch && matchesLayer;
  });

  const layers: (LayerType | 'all')[] = ['all', 'Application', 'Transport', 'Network', 'Data Link'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Networking Topics Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Jump directly into any concept without following a fixed path. Each topic features visual simulations, guided labs, and practice questions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search TCP, ARP, Subnetting..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Layer Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
        <Filter className="h-4 w-4 text-slate-500 mr-1 flex-shrink-0" />
        {layers.map((l) => (
          <button
            key={l}
            onClick={() => setSelectedLayer(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedLayer === l
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {l === 'all' ? 'All Layers' : `${l} Layer`}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="rounded-2xl bg-navy-900 border border-slate-800 hover:border-slate-700 p-5 shadow-lg flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {topic.layer}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  PDU: {topic.pdu.split(' ')[0]}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {topic.name}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {topic.summary}
              </p>

              {/* Addressing info */}
              <div className="mt-4 p-2 rounded-lg bg-navy-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Addressing:</span>
                <span className="text-slate-200 font-semibold truncate max-w-[150px]">{topic.addressing}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                href={`/topics/${topic.id}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>Deep Dive & Lab</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2">
                {topic.simulationId && (
                  <Link
                    href={`/simulator?scenario=${topic.simulationId}`}
                    title="Run Simulation"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <PlayCircle className="h-4 w-4" />
                  </Link>
                )}
                {topic.labId && (
                  <Link
                    href={`/labs/${topic.labId}`}
                    title="Guided Lab"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Cpu className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
