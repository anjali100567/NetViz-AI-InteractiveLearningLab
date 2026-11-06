'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  ArrowRight, 
  PlayCircle, 
  Cpu, 
  CheckCircle2, 
  Bot, 
  AlertTriangle, 
  Lightbulb, 
  Network,
  HelpCircle
} from 'lucide-react';
import { LayerType } from '@/lib/simulation/types';

interface LayerDetail {
  layer: LayerType;
  number: number;
  pdu: string;
  addressing: string;
  devices: string[];
  protocols: string[];
  purpose: string;
  commonProblems: string[];
  realWorldAnalogy: string;
  visualizeHref: string;
  labHref: string;
  practiceHref: string;
  colorClass: string;
}

const LAYER_DETAILS: Record<LayerType, LayerDetail> = {
  'Application': {
    layer: 'Application',
    number: 5,
    pdu: 'Message / Data Payload',
    addressing: 'URL / URI, Hostname, Email address',
    devices: ['Web Client / Browser', 'Web Server', 'Email Server', 'DNS Resolver'],
    protocols: ['HTTP', 'HTTPS', 'DNS', 'DHCP', 'FTP', 'SMTP', 'SSH'],
    purpose: 'Provides network services directly to end-user applications and manages presentation and session semantics.',
    commonProblems: [
      'DNS resolution timeout / failure',
      'HTTP 502/504 Bad Gateway & Gateway Timeout',
      'TLS / SSL certificate expiration or cipher mismatch',
      'DHCP scope exhaustion',
    ],
    realWorldAnalogy: 'Writing an official letter with requests or greetings before putting it into an envelope.',
    visualizeHref: '/simulator?scenario=packet-encapsulation',
    labHref: '/labs/lab-encapsulation',
    practiceHref: '/practice/http-https',
    colorClass: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400',
  },
  'Transport': {
    layer: 'Transport',
    number: 4,
    pdu: 'Segment (TCP) / Datagram (UDP)',
    addressing: 'Port Numbers (0 - 65,535)',
    devices: ['Host OS Network Stack', 'Stateful Firewalls', 'Load Balancers'],
    protocols: ['TCP', 'UDP', 'QUIC', 'SCTP'],
    purpose: 'Guarantees end-to-end process-to-process communication, connection state tracking, flow control, and congestion avoidance.',
    commonProblems: [
      'Port closed (TCP RST returned)',
      'SYN flood denial of service',
      'Retransmission timeout from packet loss',
      'Zero Window buffer overrun',
      'Head-of-Line blocking',
    ],
    realWorldAnalogy: 'A registered courier service providing tracking numbers, signature receipts, and resending lost parcels.',
    visualizeHref: '/simulator?scenario=tcp-sliding-window',
    labHref: '/labs/lab-tcp-handshake',
    practiceHref: '/practice/tcp-handshake',
    colorClass: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
  },
  'Network': {
    layer: 'Network',
    number: 3,
    pdu: 'Packet',
    addressing: 'IP Addresses (IPv4 32-bit / IPv6 128-bit)',
    devices: ['Routers', 'Layer 3 Switches', 'NAT Gateways'],
    protocols: ['IPv4', 'IPv6', 'ICMP', 'OSPF', 'BGP', 'NAT'],
    purpose: 'Logical addressing, packet encapsulation, and best-effort routing across multiple interconnected networks via longest-prefix matching.',
    commonProblems: [
      'Incorrect default gateway configuration',
      'Routing loops and TTL expired in transit (ICMP Type 11)',
      'MTU mismatch causing IP fragmentation drops',
      'Subnet mask miscalculations',
    ],
    realWorldAnalogy: 'The global postal logistics sorting hubs reading postal codes and dispatching transport trucks.',
    visualizeHref: '/simulator?scenario=routing-longest-prefix',
    labHref: '/labs/lab-subnetting',
    practiceHref: '/practice/subnetting-routing',
    colorClass: 'from-blue-500/20 to-sky-500/10 border-blue-500/40 text-blue-400',
  },
  'Data Link': {
    layer: 'Data Link',
    number: 2,
    pdu: 'Frame',
    addressing: 'MAC Addresses (48-bit hex hardware address)',
    devices: ['Layer 2 Switches', 'Network Interface Cards (NICs)', 'Wireless Access Points'],
    protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'ARP', 'VLAN (802.1Q)', 'PPP'],
    purpose: 'Physical link hop-by-hop framing, hardware MAC address resolution, media access control, and error detection via CRC-32 trailer.',
    commonProblems: [
      'Broadcast storms from switching loops without Spanning Tree (STP)',
      'MAC address table exhaustion / flooding',
      'CRC frame check errors from physical cable noise',
      'ARP cache poisoning / conflicts',
    ],
    realWorldAnalogy: 'The local delivery van taking parcels from the neighborhood distribution center to the exact house mailbox.',
    visualizeHref: '/simulator?scenario=arp-switch-learning',
    labHref: '/labs/lab-arp',
    practiceHref: '/practice/arp-protocol',
    colorClass: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
  },
  'Physical': {
    layer: 'Physical',
    number: 1,
    pdu: 'Bits & Electromagnetic Pulses',
    addressing: 'None (Physical Signaling & Pins)',
    devices: ['Cat6 Twisted Pair Cables', 'Fiber Optics', 'Radio Antennas', 'Repeaters', 'Hubs'],
    protocols: ['1000BASE-T', '10GBASE-SR', 'NRZ', 'Manchester Encoding', 'PAM4'],
    purpose: 'Converts digital byte streams into physical voltage signals, optical laser pulses, or radio frequencies across physical media.',
    commonProblems: [
      'Cable attenuation and signal degradation over long distances',
      'Electromagnetic interference (EMI) from power lines',
      'Duplex mismatch (Half vs Full duplex collisions)',
      'Bent or fractured fiber optic cores',
    ],
    realWorldAnalogy: 'The physical asphalt roads, copper wires, and radio waves through the air.',
    visualizeHref: '/simulator?scenario=packet-encapsulation',
    labHref: '/labs/lab-encapsulation',
    practiceHref: '/practice/http-https',
    colorClass: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
  },
};

export default function LayerMapPage() {
  const [selectedLayer, setSelectedLayer] = useState<LayerType>('Transport');
  const details = LAYER_DETAILS[selectedLayer];

  const layerKeys: LayerType[] = ['Application', 'Transport', 'Network', 'Data Link', 'Physical'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Interactive OSI / TCP-IP 5-Layer Map
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Click any layer to explore its protocol stack, addressing, devices, common failures, labs, and interactive visualizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/learn/top-down"
            className="px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
          >
            Top-Down Flow ↓
          </Link>
          <Link
            href="/learn/bottom-up"
            className="px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
          >
            Bottom-Up Flow ↑
          </Link>
        </div>
      </div>

      {/* Main Grid: Interactive Layer Stack on Left, Deep Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Layer Selector Stack (5 Columns/Bars) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
            SELECT A LAYER TO INSPECT:
          </span>

          {layerKeys.map((layer) => {
            const item = LAYER_DETAILS[layer];
            const isSelected = selectedLayer === layer;

            return (
              <div
                key={layer}
                onClick={() => setSelectedLayer(layer)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${item.colorClass} shadow-xl scale-[1.02]`
                    : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 hover:bg-navy-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-navy-950 flex items-center justify-center font-mono font-bold text-xs text-white border border-slate-700">
                      L{item.number}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm">{item.layer} Layer</h3>
                      <span className="text-[11px] font-mono text-slate-400">PDU: {item.pdu}</span>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-slate-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Layer Card */}
        <div className="lg:col-span-7 rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Top Badge & Title */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  LAYER {details.number} SPECIFICATION
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5">{details.layer} Layer</h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                PDU: {details.pdu}
              </span>
            </div>

            {/* Purpose */}
            <div className="mt-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                PRIMARY PURPOSE
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {details.purpose}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono">
                  ADDRESSING TYPE
                </span>
                <span className="text-cyan-300 font-medium">{details.addressing}</span>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-mono">
                  DEVICES INVOLVED
                </span>
                <span className="text-blue-300 font-medium">{details.devices.join(', ')}</span>
              </div>
            </div>

            {/* Protocols Tags */}
            <div className="mt-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
                KEY PROTOCOLS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {details.protocols.map((proto) => (
                  <span
                    key={proto}
                    className="px-2.5 py-1 rounded-lg bg-navy-950 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {proto}
                  </span>
                ))}
              </div>
            </div>

            {/* Real World Analogy */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <Lightbulb className="h-4 w-4" />
                <span>Real-World Analogy</span>
              </div>
              <p className="text-slate-300">{details.realWorldAnalogy}</p>
            </div>

            {/* Common Problems */}
            <div className="mt-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1.5 flex items-center gap-1 text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                COMMON PROBLEMS & ATTACKS
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                {details.commonProblems.map((prob, i) => (
                  <li key={i}>{prob}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons Strip */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2.5">
            <Link
              href={details.visualizeHref}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Visualize {details.layer}</span>
            </Link>

            <Link
              href={details.labHref}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Start Guided Lab</span>
            </Link>

            <Link
              href={details.practiceHref}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Practice Questions</span>
            </Link>

            <Link
              href="/simulator"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs transition-colors"
            >
              <Bot className="h-4 w-4 text-purple-400" />
              <span>Ask AI About This Layer</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
