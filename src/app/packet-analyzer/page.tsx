'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Bot, 
  Sparkles, 
  Binary, 
  ChevronRight, 
  ChevronDown, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_PACKET_TRACES, AnalyzedPacket } from '@/lib/content/packetTraces';

export default function PacketAnalyzerPage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPacketNo, setSelectedPacketNo] = useState<number>(1);
  const [expandedSection, setExpandedSection] = useState<string>('tcp');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const selectedPacket = SAMPLE_PACKET_TRACES.find(p => p.no === selectedPacketNo) || SAMPLE_PACKET_TRACES[0];

  // Simple filter evaluator
  const filteredPackets = SAMPLE_PACKET_TRACES.filter((pkt) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    if (q === 'tcp') return pkt.protocol === 'TCP' || pkt.protocol === 'HTTP';
    if (q === 'http') return pkt.protocol === 'HTTP';
    if (q.includes('syn')) return pkt.isSyn;
    if (q.includes('retransmission')) return pkt.isRetransmission;
    if (q.includes('80')) return pkt.tcp?.destinationPort === 80 || pkt.tcp?.sourcePort === 80;
    return pkt.info.toLowerCase().includes(q) || pkt.source.includes(q) || pkt.destination.includes(q);
  });

  const handleExplainPacket = () => {
    setIsExplaining(true);
    setAiExplanation(null);

    setTimeout(() => {
      let explanation = '';
      if (selectedPacket.isRetransmission) {
        explanation = `⚠️ [PACKET #${selectedPacket.no}] TCP RETRANSMISSION:
• Layer: Transport Layer (TCP)
• Diagnosis: The sender previously transmitted this exact byte sequence (Seq 1, Len 74), but never received an acknowledgment before its Retransmission Timeout (RTO) expired.
• What happened before: Packet #4 was transmitted over the wire, but packet loss or router queue drop occurred.
• What happens next: Receiver will acknowledge receipt (Packet #6: 200 OK), advancing the sender window.`;
      } else if (selectedPacket.isSyn && !selectedPacket.isAck) {
        explanation = `🤝 [PACKET #${selectedPacket.no}] TCP THREE-WAY HANDSHAKE (SYN):
• Layer: Transport Layer (TCP)
• Role: Initiates bidirectional connection establishment from client (Port 54321) to web server (Port 80).
• Key Fields: SYN=1, ACK=0. Initial Sequence Number (ISN) randomized to prevent sequence prediction attacks.
• Next expected packet: Server will return SYN-ACK (Packet #2).`;
      } else if (selectedPacket.isSyn && selectedPacket.isAck) {
        explanation = `🤝 [PACKET #${selectedPacket.no}] TCP THREE-WAY HANDSHAKE (SYN-ACK):
• Layer: Transport Layer (TCP)
• Role: Server accepts connection, acknowledges client sequence number (Ack=1), and presents its own server sequence number.
• Next expected packet: Client will return final ACK (Packet #3).`;
      } else if (selectedPacket.protocol === 'HTTP') {
        explanation = `🌐 [PACKET #${selectedPacket.no}] APPLICATION LAYER (HTTP):
• Layer: Application Layer encapsulated inside TCP Segment.
• Details: ${selectedPacket.info}. Carries user HTTP request payload after successful 3-way handshake.`;
      } else {
        explanation = `✅ [PACKET #${selectedPacket.no}] NORMAL PROTOCOL TRAFFIC (${selectedPacket.protocol}):
• Transport verification successful with valid checksum. Normal data exchange.`;
      }

      setAiExplanation(explanation);
      setIsExplaining(false);
    }, 400);
  };

  const getRowColor = (pkt: AnalyzedPacket) => {
    if (pkt.isRetransmission) return 'bg-rose-950/30 text-rose-300 hover:bg-rose-900/40';
    if (pkt.protocol === 'HTTP') return 'bg-purple-950/20 text-purple-200 hover:bg-purple-900/30';
    if (pkt.isSyn) return 'bg-blue-950/25 text-blue-200 hover:bg-blue-900/35';
    return 'hover:bg-slate-800/50 text-slate-300';
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold mb-2">
            <Search className="h-3.5 w-3.5" />
            <span>WIRESHARK-STYLE PACKET ANALYZER</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Packet Trace Capture & Inspection Lab
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyze deterministic packet captures. Filter by protocol, inspect frame tree headers, and ask AI to diagnose packets.
          </p>
        </div>

        {/* Capture vs Display Filter Info Pill */}
        <div className="flex items-center gap-2 text-xs font-mono bg-navy-900 border border-slate-800 p-2.5 rounded-xl">
          <Info className="h-4 w-4 text-cyan-400" />
          <span className="text-slate-400">Display Filter:</span>
          <span className="text-slate-200 font-semibold">Applied post-recording</span>
        </div>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="my-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder='Apply a display filter: e.g. "tcp", "http", "syn", "retransmission", "80"'
            className="w-full pl-9 pr-24 py-2 rounded-xl bg-navy-900 border border-slate-700 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Preset filter buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          {['tcp', 'http', 'syn', 'retransmission'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterQuery(f)}
              className="px-2.5 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* PACKET LIST TABLE (Top Half) */}
      <div className="rounded-2xl bg-navy-900 border border-slate-800 overflow-hidden shadow-2xl mb-6">
        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-navy-950 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0 border-b border-slate-800 z-10">
              <tr>
                <th className="py-2.5 px-3 w-14">No.</th>
                <th className="py-2.5 px-3 w-24">Time</th>
                <th className="py-2.5 px-3 w-36">Source</th>
                <th className="py-2.5 px-3 w-36">Destination</th>
                <th className="py-2.5 px-3 w-20">Protocol</th>
                <th className="py-2.5 px-3 w-16">Length</th>
                <th className="py-2.5 px-3">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPackets.map((pkt) => {
                const isSelected = pkt.no === selectedPacketNo;
                return (
                  <tr
                    key={pkt.no}
                    onClick={() => {
                      setSelectedPacketNo(pkt.no);
                      setAiExplanation(null);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/60 text-cyan-200 font-bold border-l-4 border-cyan-400'
                        : getRowColor(pkt)
                    }`}
                  >
                    <td className="py-2 px-3">{pkt.no}</td>
                    <td className="py-2 px-3 text-slate-400">{pkt.time.toFixed(6)}</td>
                    <td className="py-2 px-3 truncate max-w-[140px]">{pkt.source}</td>
                    <td className="py-2 px-3 truncate max-w-[140px]">{pkt.destination}</td>
                    <td className="py-2 px-3 font-bold text-cyan-400">{pkt.protocol}</td>
                    <td className="py-2 px-3 text-slate-400">{pkt.length}</td>
                    <td className="py-2 px-3 font-medium truncate">{pkt.info}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PACKET DETAILS TREE & AI EXPLANATION (Bottom Half) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Packet Header Tree Breakdown (7 Columns) */}
        <div className="lg:col-span-7 rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Packet #{selectedPacket.no} Protocol Tree Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {selectedPacket.protocol} • {selectedPacket.length} bytes on wire
            </span>
          </div>

          <div className="mt-3 space-y-2 font-mono text-xs overflow-y-auto max-h-[380px] pr-1">
            {/* Frame Layer */}
            <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">
                ▸ Frame {selectedPacket.frame.frameNumber}: {selectedPacket.frame.frameLength} bytes on wire ({selectedPacket.frame.protocolsInFrame})
              </span>
            </div>

            {/* Ethernet II */}
            <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">
                ▸ Ethernet II, Src: {selectedPacket.ethernet.sourceMac}, Dst: {selectedPacket.ethernet.destinationMac}
              </span>
              <div className="pl-4 text-slate-400 text-[11px] space-y-0.5 mt-1">
                <div>Destination: {selectedPacket.ethernet.destinationMac}</div>
                <div>Source: {selectedPacket.ethernet.sourceMac}</div>
                <div>Type: {selectedPacket.ethernet.type}</div>
              </div>
            </div>

            {/* IPv4 */}
            {selectedPacket.ip && (
              <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800">
                <span className="text-blue-400 font-bold block mb-1">
                  ▸ Internet Protocol Version 4, Src: {selectedPacket.ip.sourceIp}, Dst: {selectedPacket.ip.destinationIp}
                </span>
                <div className="pl-4 text-slate-400 text-[11px] space-y-0.5 mt-1">
                  <div>Header Length: {selectedPacket.ip.headerLength} bytes</div>
                  <div>Time to Live: {selectedPacket.ip.ttl}</div>
                  <div>Protocol: {selectedPacket.ip.protocol}</div>
                  <div>Header Checksum: {selectedPacket.ip.checksum}</div>
                </div>
              </div>
            )}

            {/* TCP */}
            {selectedPacket.tcp && (
              <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">
                  ▸ Transmission Control Protocol, Src Port: {selectedPacket.tcp.sourcePort}, Dst Port: {selectedPacket.tcp.destinationPort}
                </span>
                <div className="pl-4 text-slate-400 text-[11px] space-y-0.5 mt-1">
                  <div>Sequence Number: {selectedPacket.tcp.sequenceNumber} (raw: {selectedPacket.tcp.rawSequenceNumber})</div>
                  <div>Acknowledgment Number: {selectedPacket.tcp.acknowledgmentNumber}</div>
                  <div>Flags: {selectedPacket.tcp.flags.raw}</div>
                  <div>Window Size Value: {selectedPacket.tcp.windowSize}</div>
                  <div>Checksum: {selectedPacket.tcp.checksum}</div>
                </div>
              </div>
            )}

            {/* Application Data */}
            {selectedPacket.applicationData && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
                <span className="text-purple-300 font-bold block mb-1">
                  ▸ {selectedPacket.applicationData.protocol}
                </span>
                <div className="pl-4 text-slate-300 text-[11px] space-y-0.5 mt-1 font-sans">
                  {selectedPacket.applicationData.lines.map((l, idx) => (
                    <div key={idx}>{l}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Packet Diagnosis & Hex Dump (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Packet Explainer Card */}
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Bot className="h-4 w-4 text-cyan-400" />
                AI Packet Diagnosis
              </h3>
              <button
                onClick={handleExplainPacket}
                disabled={isExplaining}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explain This Packet</span>
              </button>
            </div>

            <div className="mt-4">
              {isExplaining ? (
                <div className="p-4 rounded-xl bg-navy-950 text-xs text-slate-400 flex items-center gap-2">
                  <Bot className="h-4 w-4 animate-bounce text-cyan-400" />
                  <span>Decoding packet flags and protocol sequence...</span>
                </div>
              ) : aiExplanation ? (
                <div className="p-4 rounded-xl bg-navy-950 border border-cyan-500/30 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {aiExplanation}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  Click <strong>&quot;Explain This Packet&quot;</strong> to receive an instant breakdown of packet #{selectedPacket.no}&apos;s role, flags, preceding events, and anomaly detection.
                </div>
              )}
            </div>
          </div>

          {/* Raw Hex Dump View */}
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Binary className="h-4 w-4 text-amber-400" />
                Raw Hex Byte Stream
              </h4>
              <span className="text-[10px] font-mono text-slate-500">Offset 0000 - 003F</span>
            </div>
            <pre className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-400/90 leading-relaxed overflow-x-auto">
              {selectedPacket.hexDump}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
