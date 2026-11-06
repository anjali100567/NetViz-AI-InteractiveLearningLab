'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUp, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Terminal 
} from 'lucide-react';
import { PacketInspector } from '@/components/simulation/PacketInspector';

interface BottomUpStep {
  layer: 'Physical' | 'Data Link' | 'Network' | 'Transport' | 'Application';
  stageNumber: number;
  pdu: string;
  action: string;
  explanation: string;
  removedHeader: string;
  fieldsInspected: Record<string, string>;
}

const BOTTOM_UP_STEPS: BottomUpStep[] = [
  {
    layer: 'Physical',
    stageNumber: 1,
    pdu: 'Bits & Signals',
    action: 'Receiver NIC detects voltage pulses on the wire',
    explanation: 'The physical network card converts incoming electrical and optical signals into raw digital byte buffers, synchronizing on the Ethernet preamble.',
    removedHeader: 'Preamble & SFD (Start Frame Delimiter)',
    fieldsInspected: {
      'Signal Quality': '1000 Mbps Full-Duplex',
      'Clock Sync': 'Locked on 10101011 SFD',
      'Raw Bytes Decoded': '114 Bytes Buffered',
    },
  },
  {
    layer: 'Data Link',
    stageNumber: 2,
    pdu: 'Ethernet Frame',
    action: 'Checks CRC-32 Trailer & Strips Ethernet Header',
    explanation: 'The NIC computes the CRC-32 checksum across the frame. If valid, it confirms Destination MAC matches the local interface (or broadcast) and strips the 14-byte Ethernet header and 4-byte FCS trailer.',
    removedHeader: 'Ethernet Header (14B) & CRC-32 Trailer (4B)',
    fieldsInspected: {
      'Destination MAC': '00:1A:2B:3C:4D:5E (Matches Interface)',
      'Source MAC': 'AA:BB:CC:DD:EE:01',
      'EtherType': '0x0800 -> Demux to IPv4',
      'CRC-32 Check': '0x4E9A21B0 [VALID - No bit flips]',
    },
  },
  {
    layer: 'Network',
    stageNumber: 3,
    pdu: 'IP Packet',
    action: 'Validates IP Checksum & Matches Host IP',
    explanation: 'The IP stack validates the IPv4 header checksum, verifies that Destination IP matches the host (93.184.216.34), inspects the Protocol field (6 = TCP), and strips the 20-byte IP header.',
    removedHeader: 'IPv4 Header (20 Bytes)',
    fieldsInspected: {
      'Destination IP': '93.184.216.34 (Host Matched)',
      'TTL Remaining': '54 Hops',
      'Protocol Number': '6 -> Demux to TCP handler',
      'Checksum': '0x8B31 [VALID]',
    },
  },
  {
    layer: 'Transport',
    stageNumber: 4,
    pdu: 'TCP Segment',
    action: 'Verifies TCP Checksum, Sequence Order, and Updates Sockets',
    explanation: 'TCP checks socket binding for Destination Port 80. It verifies sequence number continuity, delivers payload to the socket buffer, advances the receive window, and sends an ACK back to the client.',
    removedHeader: 'TCP Header (20 Bytes)',
    fieldsInspected: {
      'Destination Port': '80 (Bound to Nginx Process)',
      'Sequence Number': '1001 (Expected contiguous byte)',
      'Flags': 'PSH, ACK',
      'Receive Window': '65535 bytes remaining in buffer',
    },
  },
  {
    layer: 'Application',
    stageNumber: 5,
    pdu: 'Application Payload (HTTP)',
    action: 'Web Server Process Parses Pure Application Request',
    explanation: 'The web server daemon reads pure, unencapsulated HTTP data from the kernel socket queue and parses GET /index.html HTTP/1.1 to render the web page response!',
    removedHeader: 'None (Final Data Consumed by Application)',
    fieldsInspected: {
      'Request': 'GET /index.html HTTP/1.1',
      'Host': 'netviz.internal',
      'Application Handler': 'Nginx Event Loop Worker :80',
      'Status': 'Processing 200 OK Response',
    },
  },
];

export default function BottomUpLearnPage() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const step = BOTTOM_UP_STEPS[currentStepIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold mb-2">
          <Layers className="h-3.5 w-3.5" />
          <span>BOTTOM-UP LEARNING JOURNEY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Physical → Application: How Systems Decapsulate Data
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Observe the receiving machine process raw physical bits, validate checksums, demultiplex headers, and deliver clean application data to user programs.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-6">
        {BOTTOM_UP_STEPS.map((s, idx) => {
          const isActive = idx === currentStepIdx;
          const isDone = idx < currentStepIdx;
          return (
            <button
              key={s.layer}
              onClick={() => setCurrentStepIdx(idx)}
              className={`flex-1 min-w-[160px] p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-blue-400 bg-blue-950/40 shadow-lg shadow-blue-500/10'
                  : isDone
                  ? 'border-slate-700 bg-navy-900 text-slate-300'
                  : 'border-slate-800/80 bg-navy-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-blue-400">Step {idx + 1}</span>
                {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <span className="font-bold text-white text-xs block">{s.layer} Layer</span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{s.pdu}</span>
            </button>
          );
        })}
      </div>

      {/* Main Step Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        <div className="lg:col-span-7 rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                  Decapsulation Stage {currentStepIdx + 1} of 5
                </span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{step.layer} Layer: {step.action}</h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                PDU: {step.pdu}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed font-sans">
              {step.explanation}
            </p>

            <div className="mt-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
              <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5 font-mono">
                HEADER STRIPPED AT THIS STEP:
              </span>
              <span className="text-slate-200 font-mono">{step.removedHeader}</span>
            </div>

            {/* Fields Checked Table */}
            <div className="mt-6">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                FIELDS VALIDATED & DEMULTIPLEXED:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(step.fieldsInspected).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-navy-950 border border-slate-800 font-mono text-xs">
                    <span className="text-[10px] text-slate-400 uppercase block">{k}</span>
                    <span className="text-blue-300 font-semibold mt-0.5 block">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}
              disabled={currentStepIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Previous Layer Down
            </button>

            <button
              onClick={() => setCurrentStepIdx(Math.min(BOTTOM_UP_STEPS.length - 1, currentStepIdx + 1))}
              disabled={currentStepIdx === BOTTOM_UP_STEPS.length - 1}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 disabled:opacity-40 text-white text-xs font-semibold hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>Next Layer Up</span>
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <PacketInspector />
        </div>
      </div>
    </div>
  );
}
