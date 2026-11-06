'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Lightbulb, 
  AlertTriangle, 
  Bot, 
  Sparkles, 
  Check, 
  Network, 
  Cpu, 
  HelpCircle,
  Columns,
  Radio,
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { LayerType } from '@/lib/simulation/types';
import { AiTutorPanel } from '@/components/ai/AiTutorPanel';

export default function LayerVisualizerPage() {
  const [selectedLayer, setSelectedLayer] = useState<LayerType>('Transport');
  const [transportMode, setTransportMode] = useState<'tcp' | 'udp' | 'compare' | 'mux' | 'demux'>('tcp');
  const [activeTopic, setActiveTopic] = useState<string>('tcp-handshake');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [explanationMode, setExplanationMode] = useState<'easy' | 'technical'>('easy');

  // Animation step inside active visualizer
  const [animStep, setAnimStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHeaderField, setSelectedHeaderField] = useState<string | null>('seq');

  const layersList: { id: LayerType; name: string; number: number; desc: string; iconColor: string }[] = [
    { id: 'Application', name: 'Application Layer', number: 5, desc: 'HTTP, DNS, DHCP, Web Sockets & User Apps', iconColor: 'from-purple-500 to-indigo-600' },
    { id: 'Transport', name: 'Transport Layer', number: 4, desc: 'TCP, UDP, Ports, Sockets, Multiplexing & Flow Control', iconColor: 'from-cyan-500 to-blue-600' },
    { id: 'Network', name: 'Network Layer', number: 3, desc: 'IP Routing, Subnetting, Gateway, TTL & ICMP', iconColor: 'from-blue-500 to-sky-600' },
    { id: 'Data Link', name: 'Data Link Layer', number: 2, desc: 'Ethernet, MAC Addresses, Switch Learning & CRC', iconColor: 'from-emerald-500 to-teal-600' },
    { id: 'Physical', name: 'Physical Layer', number: 1, desc: 'Bits, Signals, Cables, Wireless Waves & Modulation', iconColor: 'from-amber-500 to-orange-600' },
  ];

  const tcpTopics = [
    { id: 'tcp-handshake', title: 'TCP Three-Way Handshake', stepCount: 4 },
    { id: 'tcp-header-anim', title: 'TCP Header Construction', stepCount: 7 },
    { id: 'tcp-sliding-window', title: 'Sliding Window & Flow Control', stepCount: 5 },
    { id: 'tcp-ack-loss', title: 'ACK Loss & Duplicate Detection', stepCount: 6 },
    { id: 'tcp-fast-retransmit', title: 'Fast Retransmit (3 Dup ACKs)', stepCount: 5 },
    { id: 'tcp-termination', title: 'Connection Termination (FIN-ACK)', stepCount: 4 },
  ];

  const headerFieldExplanations: Record<string, { easy: string; needed: string; example: string }> = {
    'srcPort': {
      easy: 'The identification number for the specific program on the sender computer.',
      needed: 'Allows the receiver to reply back to the exact program that asked.',
      example: 'Client assigns ephemeral port 54321 to Chrome tab.',
    },
    'dstPort': {
      easy: 'The door number of the destination service.',
      needed: 'Tells the receiving operating system which server process should receive the data.',
      example: 'Port 80 for HTTP, Port 443 for HTTPS, Port 22 for SSH.',
    },
    'seq': {
      easy: 'This number identifies the position of the byte stream.',
      needed: 'The receiver uses sequence numbers to put packets in the correct order and detect missing bytes.',
      example: 'If packet has Seq=1000 and carries 500 bytes, the next expected sequence is 1500.',
    },
    'ack': {
      easy: 'The confirmation receipt sent back to the sender.',
      needed: 'Informs the sender which byte sequence number the receiver is waiting for next.',
      example: 'Ack=1501 confirms all bytes up to 1500 were safely received.',
    },
    'flags': {
      easy: 'One-bit switches that signal special control instructions.',
      needed: 'Tells the receiver if this packet is starting a connection (SYN), acknowledging (ACK), or closing (FIN).',
      example: 'SYN=1 (let’s connect), ACK=1 (I heard you), FIN=1 (goodbye), RST=1 (abort).',
    },
    'window': {
      easy: 'How much empty space is left in the receiver storage box.',
      needed: 'Flow Control: Stops a fast sender from flooding and crashing a slow receiver.',
      example: 'Window=64240 bytes allows sender to transmit up to 64KB without pausing.',
    },
    'checksum': {
      easy: 'A mathematical fingerprint used to spot accidental damage or static noise.',
      needed: 'Integrity: If even 1 bit flipped in transit, the receiver drops the corrupted packet immediately.',
      example: 'Calculated 16-bit one’s complement sum.',
    },
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 5 Large Layer Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
        {layersList.map((layer) => {
          const isSelected = selectedLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => {
                setSelectedLayer(layer.id);
                setAnimStep(0);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-cyan-400 bg-gradient-to-br from-navy-900 to-navy-850 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                  : 'border-slate-800 bg-navy-950 hover:bg-navy-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`h-7 w-7 rounded-lg bg-gradient-to-br ${layer.iconColor} flex items-center justify-center text-xs font-bold font-mono text-white`}>
                  L{layer.number}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {isSelected ? 'ACTIVE' : 'SELECT'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white block">{layer.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{layer.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Protocol Mode Switch for Transport Layer */}
      {selectedLayer === 'Transport' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-navy-900 border border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 font-mono">Transport Protocols:</span>
            <div className="flex rounded-xl bg-navy-950 p-1 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setTransportMode('tcp')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  transportMode === 'tcp' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                TCP Protocol
              </button>
              <button
                onClick={() => setTransportMode('udp')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  transportMode === 'udp' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                UDP Protocol
              </button>
              <button
                onClick={() => setTransportMode('compare')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  transportMode === 'compare' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                TCP vs UDP Comparison
              </button>
              <button
                onClick={() => setTransportMode('mux')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  transportMode === 'mux' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Port Multiplexing
              </button>
              <button
                onClick={() => setTransportMode('demux')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  transportMode === 'demux' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Port Demultiplexing
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-navy-950 p-1 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setExplanationMode('easy')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  explanationMode === 'easy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Easy Wording
              </button>
              <button
                onClick={() => setExplanationMode('technical')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  explanationMode === 'technical' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Technical Spec
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Panel Layer Visualizer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Topic Navigation (3 Columns) */}
        <div className="lg:col-span-3 rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between h-[640px] overflow-y-auto">
          <div>
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono block">LAYER TOPIC SUITE</span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedLayer} Layer</h2>
            </div>

            <div className="mt-4 space-y-2">
              {selectedLayer === 'Transport' && tcpTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopic(topic.id);
                    setAnimStep(0);
                  }}
                  className={`w-full p-3 rounded-xl text-left border text-xs font-medium transition-all ${
                    activeTopic === topic.id
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold'
                      : 'border-slate-800 bg-navy-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>{topic.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{topic.stepCount} Steps</span>
                  </div>
                </button>
              ))}

              {selectedLayer !== 'Transport' && (
                <div className="space-y-2">
                  {['Overview & Role', 'Header Structure', 'Core Protocol Operations', 'Error Handling & Traps'].map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-navy-950/60 border border-slate-800 text-xs font-medium text-slate-300">
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            <span>PDU: {selectedLayer === 'Transport' ? 'Segment / Datagram' : selectedLayer === 'Network' ? 'Packet' : selectedLayer === 'Data Link' ? 'Frame' : selectedLayer === 'Physical' ? 'Bits' : 'Data'}</span>
          </div>
        </div>

        {/* CENTER PANEL: Interactive Animation Canvas (6 Columns) */}
        <div className="lg:col-span-6 rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between h-[640px] overflow-hidden">
          {/* Canvas Top Status */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-white font-mono uppercase">
                {selectedLayer} Animation Canvas: {transportMode.toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Step {animStep + 1}</span>
          </div>

          {/* MAIN VISUAL WORKSPACE */}
          <div className="flex-1 flex flex-col justify-center items-center py-4 overflow-y-auto">
            {/* TCP MULTIPLEXING VISUALIZATION */}
            {selectedLayer === 'Transport' && transportMode === 'mux' && (
              <div className="w-full space-y-6">
                <h4 className="text-center text-sm font-bold text-emerald-400">
                  Multiplexing: Multiple Apps Sharing One Network Link
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono">
                    <span className="text-purple-300 font-bold block">Chrome Browser</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Source Port: 49152</span>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono">
                    <span className="text-cyan-300 font-bold block">Discord Chat</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Source Port: 49153</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-mono">
                    <span className="text-amber-300 font-bold block">Zoom Video</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Source Port: 49154</span>
                  </div>
                </div>

                <div className="flex justify-center text-slate-500">
                  <ArrowRight className="h-6 w-6 rotate-90" />
                </div>

                <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 text-center">
                  <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">
                    TRANSPORT LAYER MULTIPLEXER
                  </span>
                  <p className="text-xs text-slate-300 font-sans">
                    Combines segments from ports 49152, 49153, 49154 onto a single physical network card.
                  </p>
                </div>
              </div>
            )}

            {/* TCP DEMULTIPLEXING VISUALIZATION */}
            {selectedLayer === 'Transport' && transportMode === 'demux' && (
              <div className="w-full space-y-6">
                <h4 className="text-center text-sm font-bold text-amber-400">
                  Demultiplexing: Routing Segments to Correct Socket Sinks
                </h4>
                <div className="p-3 rounded-2xl bg-navy-950 border border-slate-800 text-center text-xs font-mono">
                  <span className="text-slate-400 block mb-1">Incoming Transport Segment Stream</span>
                  <span className="text-cyan-300 font-bold">Dst Port: 443 | Dst Port: 5222 | Dst Port: 9999 (Closed!)</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono">
                    <span className="text-purple-300 font-bold block">Web Server :443</span>
                    <span className="text-emerald-400 text-[10px] block mt-1">✓ Delivered</span>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono">
                    <span className="text-cyan-300 font-bold block">Chat Daemon :5222</span>
                    <span className="text-emerald-400 text-[10px] block mt-1">✓ Delivered</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs font-mono">
                    <span className="text-rose-300 font-bold block">Closed Port :9999</span>
                    <span className="text-rose-400 text-[10px] block mt-1">✕ TCP RST Returned!</span>
                  </div>
                </div>
              </div>
            )}

            {/* TCP VS UDP SIDE BY SIDE COMPARISON */}
            {selectedLayer === 'Transport' && transportMode === 'compare' && (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-navy-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Feature</th>
                      <th className="py-2.5 px-3 text-cyan-400">TCP (Transmission Control)</th>
                      <th className="py-2.5 px-3 text-blue-400">UDP (User Datagram)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-2 px-3 text-slate-300 font-bold">Handshake</td>
                      <td className="py-2 px-3 text-cyan-300">Yes (SYN $\rightarrow$ SYN-ACK $\rightarrow$ ACK)</td>
                      <td className="py-2 px-3 text-slate-400">No (Connectionless)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300 font-bold">Acknowledgments</td>
                      <td className="py-2 px-3 text-cyan-300">Yes (Positive Cumulative ACK)</td>
                      <td className="py-2 px-3 text-slate-400">None</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300 font-bold">Retransmission</td>
                      <td className="py-2 px-3 text-cyan-300">Automatic on timeout or 3 Dup ACKs</td>
                      <td className="py-2 px-3 text-slate-400">None (Corrupted packets dropped)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300 font-bold">Ordering Guarantee</td>
                      <td className="py-2 px-3 text-cyan-300">Guaranteed in-order reassembly</td>
                      <td className="py-2 px-3 text-slate-400">Not guaranteed (Arrives out of order)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300 font-bold">Header Size</td>
                      <td className="py-2 px-3 text-amber-300">20 Bytes (up to 60 with options)</td>
                      <td className="py-2 px-3 text-emerald-400">8 Bytes fixed</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-300 font-bold">Primary Use Cases</td>
                      <td className="py-2 px-3 text-slate-300">Web (HTTP), Email, File Download</td>
                      <td className="py-2 px-3 text-slate-300">DNS, Video Calls, Gaming, DHCP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* DEFAULT TCP HEADER CONSTRUCTION CANVAS */}
            {selectedLayer === 'Transport' && transportMode === 'tcp' && (
              <div className="w-full space-y-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase text-center block">
                  INTERACTIVE TCP HEADER BUILDER (CLICK ANY FIELD TO INSPECT)
                </span>

                {/* TCP Header Box Layout */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    onClick={() => setSelectedHeaderField('srcPort')}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      selectedHeaderField === 'srcPort' ? 'border-cyan-400 bg-cyan-950/60 font-bold' : 'border-slate-800 bg-navy-950/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 uppercase block">SOURCE PORT (16 BITS)</span>
                    <span className="text-cyan-300 font-bold text-sm">54321</span>
                  </button>

                  <button
                    onClick={() => setSelectedHeaderField('dstPort')}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      selectedHeaderField === 'dstPort' ? 'border-cyan-400 bg-cyan-950/60 font-bold' : 'border-slate-800 bg-navy-950/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 uppercase block">DESTINATION PORT (16 BITS)</span>
                    <span className="text-cyan-300 font-bold text-sm">443 (HTTPS)</span>
                  </button>

                  <button
                    onClick={() => setSelectedHeaderField('seq')}
                    className={`col-span-2 p-3 rounded-xl border transition-all text-left ${
                      selectedHeaderField === 'seq' ? 'border-cyan-400 bg-cyan-950/60 font-bold' : 'border-slate-800 bg-navy-950/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 uppercase block">SEQUENCE NUMBER (32 BITS)</span>
                    <span className="text-blue-300 font-bold text-sm">1000</span>
                  </button>

                  <button
                    onClick={() => setSelectedHeaderField('ack')}
                    className={`col-span-2 p-3 rounded-xl border transition-all text-left ${
                      selectedHeaderField === 'ack' ? 'border-cyan-400 bg-cyan-950/60 font-bold' : 'border-slate-800 bg-navy-950/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 uppercase block">ACKNOWLEDGMENT NUMBER (32 BITS)</span>
                    <span className="text-emerald-400 font-bold text-sm">5001</span>
                  </button>

                  <button
                    onClick={() => setSelectedHeaderField('flags')}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      selectedHeaderField === 'flags' ? 'border-cyan-400 bg-cyan-950/60 font-bold' : 'border-slate-800 bg-navy-950/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 uppercase block">FLAGS (SYN, ACK, FIN)</span>
                    <span className="text-purple-300 font-bold text-sm">ACK, PSH (0x018)</span>
                  </button>

                  <button
                    onClick={() => setSelectedHeaderField('window')}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      selectedHeaderField === 'window' ? 'border-cyan-400 bg-cyan-950/60 font-bold' : 'border-slate-800 bg-navy-950/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 uppercase block">RECEIVE WINDOW</span>
                    <span className="text-amber-300 font-bold text-sm">64,240 Bytes</span>
                  </button>

                  <button
                    onClick={() => setSelectedHeaderField('checksum')}
                    className={`col-span-2 p-2.5 rounded-xl border transition-all text-left ${
                      selectedHeaderField === 'checksum' ? 'border-cyan-400 bg-cyan-950/60 font-bold' : 'border-slate-800 bg-navy-950/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 uppercase block">CHECKSUM & DATA OFFSET</span>
                    <span className="text-slate-200 font-bold text-sm">0x8A4B [VALID] • 20 Bytes Header</span>
                  </button>
                </div>
              </div>
            )}

            {/* UDP VIEW */}
            {selectedLayer === 'Transport' && transportMode === 'udp' && (
              <div className="w-full space-y-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase text-center block">
                  LIGHTWEIGHT UDP DATAGRAM HEADER (8 BYTES TOTAL)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-navy-950 border border-blue-500/30">
                    <span className="text-[10px] text-slate-400 uppercase block">SOURCE PORT</span>
                    <span className="text-blue-300 font-bold text-base">5353</span>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-950 border border-blue-500/30">
                    <span className="text-[10px] text-slate-400 uppercase block">DESTINATION PORT</span>
                    <span className="text-blue-300 font-bold text-base">53 (DNS)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-950 border border-blue-500/30">
                    <span className="text-[10px] text-slate-400 uppercase block">LENGTH</span>
                    <span className="text-cyan-300 font-bold text-base">42 Bytes</span>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-950 border border-blue-500/30">
                    <span className="text-[10px] text-slate-400 uppercase block">CHECKSUM</span>
                    <span className="text-emerald-400 font-bold text-base">0x2F1A</span>
                  </div>
                </div>
              </div>
            )}

            {/* OTHER LAYERS FALLBACK SUMMARY */}
            {selectedLayer !== 'Transport' && (
              <div className="p-6 rounded-2xl bg-navy-950 border border-slate-800 text-center max-w-md">
                <Layers className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">{selectedLayer} Layer Workspace</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Focuses on single-layer inspection: addressing, framing, and encapsulation logic.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Animation Controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setAnimStep(0)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAnimStep(Math.max(0, animStep - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Previous
              </button>
              <button
                onClick={() => setAnimStep(animStep + 1)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                <span>Step Forward</span>
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Explanations & Field Deep Dive (3 Columns) */}
        <div className="lg:col-span-3 rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between h-[640px] overflow-y-auto">
          <div>
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block">
                WHAT IS HAPPENING NOW?
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {selectedHeaderField ? `Inspecting Field: ${selectedHeaderField}` : 'Layer Operations'}
              </h3>
            </div>

            {selectedHeaderField && headerFieldExplanations[selectedHeaderField] ? (
              <div className="mt-4 space-y-4 text-xs font-sans">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                    EASY MEANING:
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {headerFieldExplanations[selectedHeaderField].easy}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
                    WHY IT IS NEEDED:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {headerFieldExplanations[selectedHeaderField].needed}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                    CONCRETE EXAMPLE:
                  </span>
                  <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                    {headerFieldExplanations[selectedHeaderField].example}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-navy-950 text-xs text-slate-400">
                Click any field in the center header builder to see its simple explanation and technical purpose.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => alert('AI Tutor is active for this layer!')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              <span>Ask AI About This Field</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
