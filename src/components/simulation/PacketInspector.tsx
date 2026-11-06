'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  ShieldCheck, 
  Binary, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check 
} from 'lucide-react';
import { SimulationPacket, SimulationEvent } from '@/lib/simulation/types';
import { createEncapsulationHeaders } from '@/lib/simulation/engine';

interface PacketInspectorProps {
  packet?: SimulationPacket | null;
  currentEvent?: SimulationEvent | null;
}

export function PacketInspector({ packet, currentEvent }: PacketInspectorProps) {
  const [expandedLayer, setExpandedLayer] = useState<string | null>('Transport');
  const [copied, setCopied] = useState(false);

  // Generate headers from current event or packet
  const seq = currentEvent?.sequenceNumber || packet?.sequenceNumber || 1000;
  const ack = currentEvent?.ackNumber || packet?.ackNumber || 0;
  const payload = packet?.payload || 'GET /index.html HTTP/1.1\r\nHost: api.netviz.internal';
  const headers = createEncapsulationHeaders(payload, seq, ack);

  const toggleLayer = (layerName: string) => {
    setExpandedLayer(expandedLayer === layerName ? null : layerName);
  };

  const copyAsJson = () => {
    const data = {
      event: currentEvent?.explanation,
      protocol: currentEvent?.protocol,
      seq,
      ack,
      headers: headers.map(h => ({ layer: h.layer, fields: h.fields })),
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'Application': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'Transport': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'Network': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'Data Link': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Physical': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default: return 'text-slate-400 border-slate-700 bg-slate-800/20';
    }
  };

  return (
    <div className="w-full rounded-2xl bg-navy-900 border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          <h3 className="font-bold text-white text-sm">Packet Header Inspector</h3>
        </div>
        <button
          onClick={copyAsJson}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>

      {/* Overview Tag Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-[11px] font-mono">
        <div className="bg-navy-950/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px]">PROTOCOL</span>
          <span className="text-cyan-400 font-bold">{currentEvent?.protocol || 'TCP'}</span>
        </div>
        <div className="bg-navy-950/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px]">SEQUENCE NO.</span>
          <span className="text-blue-300 font-bold">{seq}</span>
        </div>
        <div className="bg-navy-950/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px]">ACK NO.</span>
          <span className="text-emerald-400 font-bold">{ack > 0 ? ack : 'None'}</span>
        </div>
        <div className="bg-navy-950/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px]">TOTAL SIZE</span>
          <span className="text-amber-300 font-bold">114 Bytes</span>
        </div>
      </div>

      {/* Layer Stacks */}
      <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[480px]">
        {headers.map((hdr) => {
          const isExpanded = expandedLayer === hdr.layer;
          const colorClass = getLayerColor(hdr.layer);

          return (
            <div
              key={hdr.layer}
              className="rounded-xl border border-slate-800 bg-navy-950/60 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleLayer(hdr.layer)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-800/40 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${colorClass}`}>
                    {hdr.layer}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{hdr.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 bg-navy-900/40 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {Object.entries(hdr.fields).map(([key, val]) => (
                      <div key={key} className="flex flex-col bg-slate-900/80 p-2 rounded-md border border-slate-800/60">
                        <span className="text-[10px] uppercase text-slate-400">{key}</span>
                        <span className="text-slate-200 text-xs font-semibold mt-0.5 break-all">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
