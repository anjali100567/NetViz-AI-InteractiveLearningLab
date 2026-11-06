import { SimulationConfig } from '../simulation/types';

export interface WhatIfParseResult {
  hasMatch: boolean;
  proposedConfig: Partial<SimulationConfig>;
  confirmationMessage: string;
  scenarioId?: string;
  summary: string;
}

export function parseWhatIfQuestion(input: string): WhatIfParseResult {
  const query = input.toLowerCase().trim();

  // Pattern 1: Window size and packet loss: "window size 2 and packet 3 is lost"
  const winMatch = query.match(/window\s*(?:size)?\s*(?:is|=|of)?\s*(\d+)/i);
  const packetLossMatch = query.match(/packet\s*(?:#|number)?\s*(\d+)\s*(?:is)?\s*lost/i);
  const ackLossMatch = query.match(/ack\s*(?:#|number)?\s*(?:is)?\s*lost/i);

  if (winMatch || packetLossMatch || ackLossMatch) {
    const winSize = winMatch ? parseInt(winMatch[1], 10) : 4;
    const lostPacket = packetLossMatch ? parseInt(packetLossMatch[1], 10) : undefined;
    const isAckLost = Boolean(ackLossMatch);

    const lostPackets = lostPacket ? [lostPacket] : [];
    const lostAcks = isAckLost ? [1] : [];

    let summary = `TCP simulation with Window Size = ${winSize}`;
    if (lostPacket) summary += `, Packet #${lostPacket} lost`;
    if (isAckLost) summary += `, ACK lost`;

    return {
      hasMatch: true,
      proposedConfig: {
        protocol: 'TCP',
        windowSize: winSize,
        targetedLostPackets: lostPackets,
        targetedLostAcks: lostAcks,
        packetLossProbability: lostPacket ? 1 : 0,
        ackLossProbability: isAckLost ? 1 : 0,
      },
      scenarioId: isAckLost ? 'tcp-ack-loss' : 'tcp-sliding-window',
      confirmationMessage: `I will configure a ${summary}. Would you like to load this into the visualizer?`,
      summary,
    };
  }

  // Pattern 2: Fast retransmit / 3 dup ACKs
  if (query.includes('duplicate ack') || query.includes('fast retransmit') || query.includes('out of order')) {
    return {
      hasMatch: true,
      proposedConfig: {
        protocol: 'TCP',
        windowSize: 5,
        targetedLostPackets: [2],
      },
      scenarioId: 'tcp-fast-retransmit',
      confirmationMessage: 'I will configure a TCP Fast Retransmit scenario with Segment #2 dropped, triggering 3 Duplicate ACKs. Start simulation?',
      summary: 'TCP Fast Retransmit with 3 Duplicate ACKs',
    };
  }

  // Pattern 3: Handshake or lost SYN
  if (query.includes('syn lost') || query.includes('lost syn') || (query.includes('handshake') && query.includes('loss'))) {
    return {
      hasMatch: true,
      proposedConfig: {
        protocol: 'TCP',
        targetedLostPackets: [1],
      },
      scenarioId: 'tcp-handshake',
      confirmationMessage: 'I will configure a TCP 3-Way Handshake with the initial SYN dropped to demonstrate RTO timeout and retransmission. Start simulation?',
      summary: 'TCP Handshake with SYN Drop & Backoff',
    };
  }

  // Pattern 4: Congestion control / slow start / AIMD
  if (query.includes('congestion') || query.includes('slow start') || query.includes('aimd') || query.includes('cwnd')) {
    return {
      hasMatch: true,
      proposedConfig: {
        protocol: 'TCP',
        cwnd: 1,
        ssthresh: 8,
      },
      scenarioId: 'tcp-congestion-control',
      confirmationMessage: 'I will configure a TCP Congestion Control simulation with Slow Start (1 MSS), SSTHRESH = 8 MSS, and Reno Fast Recovery. Start simulation?',
      summary: 'TCP Congestion Control (Tahoe vs Reno)',
    };
  }

  // Pattern 5: DNS resolution
  if (query.includes('dns') || query.includes('cache miss') || query.includes('resolver')) {
    return {
      hasMatch: true,
      proposedConfig: {
        protocol: 'DNS',
      },
      scenarioId: 'dns-resolution',
      confirmationMessage: 'I will configure a Recursive DNS Resolution simulation tracing Client -> Resolver -> Root -> TLD -> Authoritative server. Start simulation?',
      summary: 'Hierarchical DNS Name Resolution',
    };
  }

  // Pattern 6: ARP & Switch learning
  if (query.includes('arp') || query.includes('switch') || query.includes('flooding') || query.includes('mac table')) {
    return {
      hasMatch: true,
      proposedConfig: {
        protocol: 'ARP',
      },
      scenarioId: 'arp-switch-learning',
      confirmationMessage: 'I will configure an ARP & Switch Learning simulation with broadcast flooding, source MAC table learning, and unicast reply. Start simulation?',
      summary: 'ARP Resolution and Switch MAC Learning',
    };
  }

  // Generic fallback match
  return {
    hasMatch: false,
    proposedConfig: {
      protocol: 'TCP',
      windowSize: 4,
    },
    confirmationMessage: 'I can simulate that scenario. Would you like to load a custom TCP sliding-window simulation?',
    summary: 'Custom TCP Simulation',
  };
}
