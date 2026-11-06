'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { Activity } from 'lucide-react';

interface CongestionDataPoint {
  rtt: number;
  cwnd: number;
  ssthresh: number;
  event?: string;
}

const DEFAULT_CONGESTION_DATA: CongestionDataPoint[] = [
  { rtt: 1, cwnd: 1, ssthresh: 8, event: 'Slow Start (1 MSS)' },
  { rtt: 2, cwnd: 2, ssthresh: 8, event: 'Slow Start (2 MSS)' },
  { rtt: 3, cwnd: 4, ssthresh: 8, event: 'Slow Start (4 MSS)' },
  { rtt: 4, cwnd: 8, ssthresh: 8, event: 'Reached SSTHRESH (8 MSS)' },
  { rtt: 5, cwnd: 9, ssthresh: 8, event: 'Congestion Avoidance (+1)' },
  { rtt: 6, cwnd: 10, ssthresh: 8, event: 'Congestion Avoidance (+1)' },
  { rtt: 7, cwnd: 11, ssthresh: 8, event: 'Approaching Buffer Limit' },
  { rtt: 8, cwnd: 12, ssthresh: 8, event: 'Loss Event Detected (3 Dup ACKs)' },
  { rtt: 9, cwnd: 6, ssthresh: 6, event: 'Fast Recovery: ssthresh=6, cwnd=6' },
  { rtt: 10, cwnd: 7, ssthresh: 6, event: 'Linear Increase Resumed' },
  { rtt: 11, cwnd: 8, ssthresh: 6, event: 'Congestion Avoidance (+1)' },
];

interface CongestionGraphProps {
  currentRtt?: number;
  customData?: CongestionDataPoint[];
}

export function CongestionGraph({ currentRtt = 8, customData }: CongestionGraphProps) {
  const data = customData || DEFAULT_CONGESTION_DATA;

  return (
    <div className="w-full rounded-2xl bg-navy-900 border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-white text-sm">TCP Congestion Window (CWND) Dynamics</h3>
            <p className="text-[11px] text-slate-400">Additive Increase Multiplicative Decrease (AIMD) Sawtooth Trace</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">CWND (MSS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">SSTHRESH</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="rtt" 
              stroke="#64748b" 
              fontSize={11} 
              tickFormatter={(v) => `RTT ${v}`} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickFormatter={(v) => `${v} MSS`} 
              domain={[0, 14]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#070b14',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                fontSize: '11px',
                color: '#f8fafc',
              }}
            />
            <Line
              type="monotone"
              dataKey="cwnd"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 4 }}
              activeDot={{ r: 6 }}
              name="CWND"
            />
            <Line
              type="stepAfter"
              dataKey="ssthresh"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name="SSTHRESH"
            />
            <ReferenceLine x={8} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Queue Drop', fill: '#f87171', fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 p-3 rounded-xl bg-navy-950 border border-slate-800 text-xs text-slate-300 font-sans flex items-center justify-between">
        <span>Current State: <strong className="text-cyan-300">Fast Recovery (Reno)</strong></span>
        <span className="font-mono text-[11px] text-slate-400">MSS = 1460 bytes | RTT ~ 100ms</span>
      </div>
    </div>
  );
}
