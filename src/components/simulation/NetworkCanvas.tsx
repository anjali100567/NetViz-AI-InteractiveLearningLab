'use client';

import React from 'react';
import { 
  Laptop, 
  Server as ServerIcon, 
  Router, 
  Layers, 
  Cloud, 
  Shield, 
  Radio, 
  Database,
  AlertCircle
} from 'lucide-react';
import { SimulationEvent, SimulationPacket } from '@/lib/simulation/types';
import { getStatusColor } from '@/lib/utils';

export interface TopologyNode {
  id: string;
  name: string;
  type: 'client' | 'switch' | 'router' | 'cloud' | 'server' | 'dns' | 'firewall';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  ip: string;
  mac: string;
  role: string;
}

const DEFAULT_NODES: TopologyNode[] = [
  { id: 'client', name: 'Client Laptop', type: 'client', x: 10, y: 50, ip: '192.168.1.10', mac: 'AA:BB:CC:DD:EE:01', role: 'Browser & App Sender' },
  { id: 'switch', name: 'LAN Switch', type: 'switch', x: 30, y: 50, ip: '192.168.1.2', mac: '00:11:22:33:44:01', role: 'Layer 2 MAC Forwarding' },
  { id: 'router', name: 'Gateway Router', type: 'router', x: 50, y: 50, ip: '192.168.1.1 / WAN', mac: '00:1A:2B:3C:4D:5E', role: 'TTL Decrement & Routing' },
  { id: 'cloud', name: 'WAN / Internet', type: 'cloud', x: 70, y: 50, ip: 'Global Mesh', mac: 'N/A', role: 'Latency & Buffer Bottleneck' },
  { id: 'server', name: 'Web Server', type: 'server', x: 90, y: 50, ip: '93.184.216.34', mac: '5E:50:AA:12:34:56', role: 'HTTP & TCP Listener :80' },
];

interface NetworkCanvasProps {
  currentEvent: SimulationEvent | null;
  packets?: SimulationPacket[];
  selectedPacket: SimulationPacket | null;
  onSelectPacket?: (packet: SimulationPacket) => void;
  onSelectNode?: (node: TopologyNode) => void;
  selectedNodeId?: string | null;
}

export function NetworkCanvas({
  currentEvent,
  selectedPacket,
  onSelectPacket,
  onSelectNode,
  selectedNodeId,
}: NetworkCanvasProps) {
  const nodes = DEFAULT_NODES;

  // Derive active packet position along the network from currentEvent
  const eventStatus = currentEvent?.status || 'in_flight';
  const statusColors = getStatusColor(eventStatus);

  // Determine packet coordinates based on source and destination or current event
  let packetX = 10;
  let packetY = 50;
  let isPacketVisible = false;

  if (currentEvent) {
    isPacketVisible = true;
    const isReverse = currentEvent.source.includes('server') || currentEvent.type.includes('ack');
    
    // Position packet smoothly between client and server based on event type
    switch (currentEvent.type) {
      case 'application_data_created':
      case 'header_added':
        packetX = 10;
        break;
      case 'packet_sent':
        packetX = isReverse ? 70 : 30;
        break;
      case 'route_selected':
        packetX = 50;
        break;
      case 'packet_lost':
      case 'ack_lost':
      case 'timeout_expired':
        packetX = isReverse ? 60 : 40;
        break;
      case 'duplicate_ack':
      case 'retransmission':
        packetX = isReverse ? 40 : 60;
        break;
      case 'packet_received':
      case 'header_removed':
      case 'connection_established':
        packetX = isReverse ? 10 : 90;
        break;
      default:
        packetX = 50;
    }
  }

  const getNodeIcon = (type: TopologyNode['type']) => {
    switch (type) {
      case 'client': return Laptop;
      case 'switch': return Layers;
      case 'router': return Router;
      case 'cloud': return Cloud;
      case 'server': return ServerIcon;
      case 'dns': return Database;
      case 'firewall': return Shield;
      default: return Radio;
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-gradient-to-b from-navy-900 via-navy-850 to-navy-950 border border-slate-800 p-4 overflow-hidden shadow-2xl">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Status banner on top */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-navy-950/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-white">Topology Canvas:</span>
          <span className="text-slate-400 font-mono text-[11px]">End-to-End Hop Flow</span>
        </div>

        {currentEvent && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-1 text-xs border backdrop-blur-md ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
            <span className="font-semibold uppercase tracking-wider text-[10px]">{statusColors.label}</span>
            <span className="text-white font-mono text-[11px]">
              {currentEvent.protocol} {currentEvent.sequenceNumber ? `Seq:${currentEvent.sequenceNumber}` : ''} {currentEvent.ackNumber ? `Ack:${currentEvent.ackNumber}` : ''}
            </span>
          </div>
        )}
      </div>

      {/* SVG Link Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Draw lines between nodes */}
        {nodes.map((node, i) => {
          if (i === nodes.length - 1) return null;
          const next = nodes[i + 1];
          return (
            <g key={`link-${node.id}-${next.id}`}>
              {/* Underlying glow */}
              <line
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Active data channel */}
              <line
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
            </g>
          );
        })}
      </svg>

      {/* Animated Packet Representation */}
      {isPacketVisible && (
        <div
          className="absolute z-20 transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: `${packetX}%`, top: `${packetY}%` }}
          onClick={() => {
            if (onSelectPacket && currentEvent) {
              onSelectPacket({
                id: `pkt-${currentEvent.eventId}`,
                protocol: currentEvent.protocol,
                sourceId: currentEvent.source,
                destinationId: currentEvent.destination,
                sourceIp: '192.168.1.10',
                destinationIp: '93.184.216.34',
                sourceMac: 'AA:BB:CC:DD:EE:01',
                destinationMac: '00:1A:2B:3C:4D:5E',
                sequenceNumber: currentEvent.sequenceNumber,
                ackNumber: currentEvent.ackNumber,
                windowSize: currentEvent.windowSize,
                payload: 'GET /index.html HTTP/1.1',
                status: currentEvent.status,
                progress: 0.5,
                currentHop: { from: currentEvent.source, to: currentEvent.destination },
                headers: [],
              });
            }
          }}
        >
          {/* Packet pulse ring */}
          <div 
            className="absolute -inset-3 rounded-xl opacity-75 blur-sm animate-ping"
            style={{ backgroundColor: statusColors.hex }}
          />

          {/* Packet Box */}
          <div 
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xl backdrop-blur-md transition-transform group-hover:scale-110 ${statusColors.bg} ${statusColors.border}`}
            style={{ borderColor: statusColors.hex }}
          >
            <div 
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: statusColors.hex }}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white font-mono flex items-center gap-1">
                {currentEvent?.protocol}
                {currentEvent?.status === 'lost' && (
                  <span className="text-rose-400 text-xs">✕ DROPPED</span>
                )}
                {currentEvent?.status === 'duplicate_ack' && (
                  <span className="text-purple-400 text-[10px]">DUP ACK</span>
                )}
              </span>
              <span className="text-[9px] text-slate-300 font-mono">
                {currentEvent?.sequenceNumber ? `Seq ${currentEvent.sequenceNumber}` : ''}
                {currentEvent?.ackNumber ? ` Ack ${currentEvent.ackNumber}` : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Topology Nodes */}
      {nodes.map((node) => {
        const Icon = getNodeIcon(node.type);
        const isSelected = selectedNodeId === node.id;
        const isSource = currentEvent?.source.toLowerCase().includes(node.id);
        const isDest = currentEvent?.destination.toLowerCase().includes(node.id);

        return (
          <div
            key={node.id}
            onClick={() => onSelectNode?.(node)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center group"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {/* Device Icon Circle */}
            <div
              className={`relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/30 scale-110'
                  : isSource || isDest
                  ? 'border-blue-400 bg-blue-600/20 shadow-md shadow-blue-500/20 scale-105'
                  : 'border-slate-700/80 bg-navy-850 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <Icon className={`h-7 w-7 transition-colors ${
                isSelected ? 'text-cyan-300' : isSource || isDest ? 'text-blue-300' : 'text-slate-400 group-hover:text-white'
              }`} />

              {/* Activity indicator */}
              {(isSource || isDest) && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
                </span>
              )}
            </div>

            {/* Labels under device */}
            <div className="mt-2 text-center pointer-events-none">
              <span className="text-xs font-semibold text-slate-200 block group-hover:text-cyan-300 transition-colors">
                {node.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {node.ip}
              </span>
              <span className="text-[9px] text-slate-400 font-mono hidden sm:block">
                {node.mac}
              </span>
            </div>
          </div>
        );
      })}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
        <span>Click any device or packet to inspect headers & state</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> In Flight</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Delivered</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Lost</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Dup ACK</span>
        </div>
      </div>
    </div>
  );
}
