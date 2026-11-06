'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowDown, 
  ArrowRight, 
  Layers, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { createEncapsulationHeaders } from '@/lib/simulation/engine';
import { PacketInspector } from '@/components/simulation/PacketInspector';

interface TopDownStep {
  layer: 'Application' | 'Transport' | 'Network' | 'Data Link' | 'Physical';
  pdu: string;
  headerAdded: string;
  explanation: string;
  headerFields: Record<string, string>;
  rawOutput: string;
}

const TOP_DOWN_STEPS: TopDownStep[] = [
  {
    layer: 'Application',
    pdu: 'HTTP Data Payload',
    headerAdded: 'HTTP/1.1 Request Header',
    explanation: 'User enters URL https://netviz.internal/index.html. The browser generates an HTTP GET request message containing resource path and host headers.',
    headerFields: {
      'Method': 'GET',
      'URI': '/index.html',
      'Host': 'netviz.internal',
      'User-Agent': 'NetViz-AI/1.0',
    },
    rawOutput: 'GET /index.html HTTP/1.1\\r\\nHost: netviz.internal\\r\\n\\r\\n',
  },
  {
    layer: 'Transport',
    pdu: 'TCP Segment',
    headerAdded: 'TCP Header (20 Bytes)',
    explanation: 'TCP encapsulates the HTTP payload. It assigns an ephemeral Source Port (54321), Destination Port (80), Sequence Number, and checksum for reliable end-to-end delivery.',
    headerFields: {
      'Source Port': '54321 (Ephemeral Client Socket)',
      'Destination Port': '80 (Web Server Process)',
      'Sequence Number': '1001',
      'Acknowledgment Number': '501',
      'Flags': 'ACK, PSH (0x018)',
      'Window Size': '64240 bytes',
    },
    rawOutput: '[TCP: 54321 -> 80, Seq: 1001, Ack: 501, Win: 64240] + HTTP Data',
  },
  {
    layer: 'Network',
    pdu: 'IP Packet',
    headerAdded: 'IPv4 Header (20 Bytes)',
    explanation: 'IP encapsulates the TCP segment into a packet. It adds Source IP (192.168.1.10) and Destination IP (93.184.216.34) so intermediate routers can route it globally.',
    headerFields: {
      'Version': '4',
      'Source IP': '192.168.1.10 (Local LAN Host)',
      'Destination IP': '93.184.216.34 (Public Web Server)',
      'Protocol': '6 (TCP)',
      'TTL (Time to Live)': '64 hops',
    },
    rawOutput: '[IPv4: 192.168.1.10 -> 93.184.216.34, Proto: 6, TTL: 64] + TCP + HTTP',
  },
  {
    layer: 'Data Link',
    pdu: 'Ethernet Frame',
    headerAdded: 'Ethernet Header & CRC-32 Trailer (18 Bytes)',
    explanation: 'Ethernet encapsulates the IP packet into a frame for delivery over the local physical cable. Destination MAC is set to the Default Gateway router, not the final server!',
    headerFields: {
      'Source MAC': 'AA:BB:CC:DD:EE:01 (Client NIC)',
      'Destination MAC': '00:1A:2B:3C:4D:5E (Default Gateway)',
      'EtherType': '0x0800 (IPv4)',
      'FCS / CRC-32 Trailer': '0x4E9A21B0 (Integrity Check)',
    },
    rawOutput: '[Ethernet: AA:01 -> 00:5E, Type: 0x0800] + IP + TCP + HTTP + [CRC-32]',
  },
  {
    layer: 'Physical',
    pdu: 'Physical Bits & Electromagnetic Pulses',
    headerAdded: 'Preamble & Physical Encoding',
    explanation: 'The Network Interface Card (NIC) serializes the complete Ethernet frame bytes into Manchester / NRZ optical or electrical pulses transmitted along the copper cable.',
    headerFields: {
      'Signaling': '1000BASE-T Gigabit Ethernet',
      'Voltage Levels': 'Differential signaling ±1.0V',
      'Bitstream Preview': '01010101 11010010 01101000 01110100...',
    },
    rawOutput: 'Physical pulses traveling across media at ~200,000 km/s',
  },
];

export default function TopDownLearnPage() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const step = TOP_DOWN_STEPS[currentStepIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold mb-2">
          <Layers className="h-3.5 w-3.5" />
          <span>TOP-DOWN LEARNING JOURNEY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Application → Physical: How Data is Encapsulated
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Follow a browser request step-by-step as each protocol layer prepends its essential control headers before physical transmission.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-6">
        {TOP_DOWN_STEPS.map((s, idx) => {
          const isActive = idx === currentStepIdx;
          const isDone = idx < currentStepIdx;
          return (
            <button
              key={s.layer}
              onClick={() => setCurrentStepIdx(idx)}
              className={`flex-1 min-w-[160px] p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
                  : isDone
                  ? 'border-slate-700 bg-navy-900 text-slate-300'
                  : 'border-slate-800/80 bg-navy-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-cyan-400">Step {idx + 1}</span>
                {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <span className="font-bold text-white text-xs block">{s.layer} Layer</span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{s.pdu}</span>
            </button>
          );
        })}
      </div>

      {/* Active Layer Walkthrough Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        <div className="lg:col-span-7 rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  Encapsulation Stage {currentStepIdx + 1} of 5
                </span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{step.layer} Layer: {step.headerAdded}</h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                PDU: {step.pdu}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed font-sans">
              {step.explanation}
            </p>

            {/* Header Fields Table */}
            <div className="mt-6">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                ATTACHED HEADER FIELDS & VALUES:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(step.headerFields).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-navy-950 border border-slate-800 font-mono text-xs">
                    <span className="text-[10px] text-slate-400 uppercase block">{k}</span>
                    <span className="text-cyan-300 font-semibold mt-0.5 block">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wire Representation Preview */}
            <div className="mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                CUMULATIVE PACKET PAYLOAD IN BUFFER:
              </span>
              <span className="text-amber-300">{step.rawOutput}</span>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}
              disabled={currentStepIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Previous Layer
            </button>

            <button
              onClick={() => setCurrentStepIdx(Math.min(TOP_DOWN_STEPS.length - 1, currentStepIdx + 1))}
              disabled={currentStepIdx === TOP_DOWN_STEPS.length - 1}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-40 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all"
            >
              <span>Next Layer Down</span>
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Packet Header Inspector on Right */}
        <div className="lg:col-span-5">
          <PacketInspector />
        </div>
      </div>
    </div>
  );
}
