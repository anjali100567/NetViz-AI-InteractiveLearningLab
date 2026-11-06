'use client';

import React, { useState } from 'react';
import { 
  X, 
  Router, 
  Layers, 
  Laptop, 
  Server, 
  ArrowRight, 
  ArrowDown, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Play, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { TopologyNode } from './NetworkCanvas';

interface DeviceInspectionModalProps {
  node: TopologyNode | null;
  onClose: () => void;
  onContinue: () => void;
}

export function DeviceInspectionModal({ node, onClose, onContinue }: DeviceInspectionModalProps) {
  const [activeRouterTab, setActiveRouterTab] = useState<'pipeline' | 'fields' | 'macTable'>('pipeline');
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number>(0);
  const [explanationMode, setExplanationMode] = useState<'easy' | 'technical'>('easy');

  if (!node) return null;

  const isRouter = node.type === 'router';
  const isSwitch = node.type === 'switch';
  const isServer = node.type === 'server';
  const isClient = node.type === 'client';

  const routerPipelineSteps = [
    {
      title: '1. Incoming Ethernet Frame Received',
      sub: 'Data Link Layer checks destination MAC',
      descEasy: 'The router listens on its network card and verifies the frame is addressed to its physical MAC address.',
      descTech: 'Ingress interface verifies MAC matches interface unicast address (or broadcast). Frame Check Sequence (CRC-32) trailer validated.',
      tag: 'Data Link (Layer 2)',
    },
    {
      title: '2. Strip Old Layer 2 Wrapper',
      sub: 'Ethernet header and trailer removed',
      descEasy: 'The router strips off the old local delivery envelope. The inner IP packet is exposed.',
      descTech: 'Header de-encapsulation: 14-byte Ethernet header and 4-byte FCS trailer removed. EtherType 0x0800 demuxes to IPv4 protocol engine.',
      tag: 'De-encapsulation',
    },
    {
      title: '3. Read Destination IP & Routing Table Lookup',
      sub: 'Longest-prefix match algorithm applied',
      descEasy: 'The router reads where this packet is ultimately going (Destination IP) and looks at its road map (Routing Table) to find the best exit road.',
      descTech: 'FIB lookup: Longest Prefix Match (LPM) on Destination IP 93.184.216.34 against routing table prefixes. Next-hop IP 10.0.1.2 determined via interface eth1.',
      tag: 'Network (Layer 3)',
    },
    {
      title: '4. Decrement TTL & Update Checksum',
      sub: 'Loop prevention mechanism (TTL 64 -> 63)',
      descEasy: 'The router reduces the packet life counter by 1. If this ever hits 0, the packet dies to prevent circling the internet forever!',
      descTech: 'IPv4 header Time-To-Live decremented by 1. Checksum recalculated via 16-bit one\'s complement sum. If TTL == 0, ICMP Time Exceeded (Type 11) generated.',
      tag: 'TTL Processing',
    },
    {
      title: '5. Construct Brand New Ethernet Frame',
      sub: 'Source MAC becomes Router eth1, Dst MAC becomes Next Hop',
      descEasy: 'The router wraps the unchanged IP packet in a brand new local delivery envelope made specifically for the next wire!',
      descTech: 'Re-encapsulation: New Ethernet II header attached. Src MAC: Router Outbound MAC, Dst MAC: Next-hop Gateway MAC (resolved via ARP cache). New CRC-32 appended.',
      tag: 'Encapsulation & Egress',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-navy-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-navy-950">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {isRouter && <Router className="h-6 w-6" />}
              {isSwitch && <Layers className="h-6 w-6" />}
              {isClient && <Laptop className="h-6 w-6" />}
              {isServer && <Server className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{node.name} Deep Inspection</h2>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {node.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                IP: {node.ip} • MAC: {node.mac}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Easy vs Technical Explanation Toggle */}
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setExplanationMode('easy')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  explanationMode === 'easy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Easy Mode
              </button>
              <button
                onClick={() => setExplanationMode('technical')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  explanationMode === 'technical' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Technical Mode
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* ROUTER SPECIFIC VIEW */}
          {isRouter && (
            <div>
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs leading-relaxed mb-6">
                <div className="font-bold text-cyan-300 text-sm mb-1 flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  Key Rule: Routers Switch MACs, Not IPs
                </div>
                {explanationMode === 'easy' ? (
                  <p className="text-slate-300">
                    The router does <strong>not</strong> forward the old Ethernet frame as it is! First, it strips off the local network wrapper. Then it inspects the destination IP, decreases TTL by 1, and wraps the IP packet into a <strong>brand new Ethernet frame</strong> for the next link.
                  </p>
                ) : (
                  <p className="text-slate-300 font-mono">
                    Hop-by-Hop L2 Re-framing: IP addresses remain end-to-end between client and server (unless NAT is active). However, Source MAC and Destination MAC are stripped and completely rebuilt on every routed hop!
                  </p>
                )}
              </div>

              {/* 5-Step Pipeline Horizontal / Vertical Breakdown */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-xs font-mono uppercase text-slate-400">
                  INSIDE THE ROUTER: 5-STAGE FORWARDING PIPELINE
                </h3>

                <div className="space-y-2.5">
                  {routerPipelineSteps.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPipelineStep(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedPipelineStep === idx
                          ? 'border-cyan-400 bg-cyan-950/50 shadow-lg shadow-cyan-500/10'
                          : 'border-slate-800 bg-navy-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-xs">{s.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                          {s.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans">
                        {explanationMode === 'easy' ? s.descEasy : s.descTech}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before and After Table */}
              <div className="mt-6 p-4 rounded-2xl bg-navy-950 border border-slate-800">
                <h4 className="font-bold text-white text-xs font-mono uppercase text-slate-400 mb-3">
                  HEADER FIELD COMPARISON (BEFORE VS AFTER ROUTER)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 pb-2">
                        <th className="py-2">Field</th>
                        <th className="py-2">Incoming to Router</th>
                        <th className="py-2">Outgoing from Router</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      <tr>
                        <td className="py-2 text-slate-300 font-bold">Source IP</td>
                        <td className="py-2 text-slate-400">192.168.1.10</td>
                        <td className="py-2 text-slate-200">192.168.1.10</td>
                        <td className="py-2 text-emerald-400 font-semibold">Unchanged</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300 font-bold">Destination IP</td>
                        <td className="py-2 text-slate-400">93.184.216.34</td>
                        <td className="py-2 text-slate-200">93.184.216.34</td>
                        <td className="py-2 text-emerald-400 font-semibold">Unchanged</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300 font-bold">TTL (Time to Live)</td>
                        <td className="py-2 text-amber-300">64</td>
                        <td className="py-2 text-amber-400 font-bold">63 (-1)</td>
                        <td className="py-2 text-amber-400 font-semibold">Decreased</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300 font-bold">Source MAC</td>
                        <td className="py-2 text-rose-300">AA:BB:CC:DD:EE:01</td>
                        <td className="py-2 text-cyan-300 font-bold">00:1A:2B:3C:4D:5E (eth1)</td>
                        <td className="py-2 text-orange-400 font-semibold">Changed</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300 font-bold">Destination MAC</td>
                        <td className="py-2 text-rose-300">00:1A:2B:3C:4D:5E (eth0)</td>
                        <td className="py-2 text-cyan-300 font-bold">5E:50:AA:12:34:56 (Next Hop)</td>
                        <td className="py-2 text-orange-400 font-semibold">Changed</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-300 font-bold">Ethernet Frame</td>
                        <td className="py-2 text-slate-400">Old LAN Frame</td>
                        <td className="py-2 text-cyan-300">Brand New Frame + CRC</td>
                        <td className="py-2 text-blue-400 font-semibold">Rebuilt</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SWITCH SPECIFIC VIEW */}
          {isSwitch && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs leading-relaxed">
                <div className="font-bold text-cyan-300 text-sm mb-1">
                  How a Layer 2 Switch Learns and Forwards
                </div>
                <p className="text-slate-300">
                  A switch learns by reading the <strong>Source MAC address</strong> of every frame that arrives on its ports. It stores this in its MAC Address Table. It then inspects the <strong>Destination MAC address</strong> to forward directly to one port (unicast) or flood to all other ports if unknown.
                </p>
              </div>

              {/* MAC Table Visualizer */}
              <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800">
                <h4 className="font-bold text-white text-xs font-mono uppercase text-slate-400 mb-2">
                  SWITCH MAC ADDRESS TABLE (CAM TABLE)
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">PORT 1</span>
                    <span className="text-cyan-300 font-bold">AA:BB:CC:DD:EE:01</span>
                    <span className="text-slate-400 block text-[9px]">Client Laptop</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">PORT 2</span>
                    <span className="text-slate-400">Empty / Listening</span>
                    <span className="text-slate-400 block text-[9px]">No frame yet</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">PORT 3</span>
                    <span className="text-cyan-300 font-bold">00:1A:2B:3C:4D:5E</span>
                    <span className="text-slate-400 block text-[9px]">Gateway Router</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SERVER SPECIFIC VIEW */}
          {isServer && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs leading-relaxed">
                <div className="font-bold text-purple-300 text-sm mb-1">
                  Server Decapsulation & Socket Demultiplexing
                </div>
                <p className="text-slate-300">
                  The web server receives raw bits from the wire, verifies the frame CRC, removes the Ethernet header, validates Destination IP matches its host IP, removes the IP header, demultiplexes Port 80 to Nginx socket, and finally processes GET /index.html HTTP request.
                </p>
              </div>
            </div>
          )}

          {/* CLIENT SPECIFIC VIEW */}
          {isClient && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs leading-relaxed">
                <div className="font-bold text-blue-300 text-sm mb-1">
                  Client Request Encapsulation
                </div>
                <p className="text-slate-300">
                  Application generates HTTP data $\rightarrow$ Transport prepends TCP header with random client port (54321) $\rightarrow$ Network prepends IPv4 header $\rightarrow$ Data Link adds Ethernet header and CRC trailer $\rightarrow$ Physical sends digital bits.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-navy-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close Inspection
          </button>

          <button
            onClick={() => {
              onClose();
              onContinue();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            <span>Resume Network Journey</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
