export type LayerType = 'Application' | 'Transport' | 'Network' | 'Data Link' | 'Physical';

export type ProtocolType = 
  | 'HTTP' 
  | 'HTTPS' 
  | 'DNS' 
  | 'DHCP' 
  | 'TCP' 
  | 'UDP' 
  | 'IPv4' 
  | 'IPv6' 
  | 'ICMP' 
  | 'ARP' 
  | 'Ethernet';

export type DeviceType = 
  | 'client' 
  | 'server' 
  | 'switch' 
  | 'router' 
  | 'dns_server' 
  | 'dhcp_server' 
  | 'firewall' 
  | 'wireless_ap';

export interface NetworkDevice {
  id: string;
  name: string;
  type: DeviceType;
  x: number;
  y: number;
  ip: string;
  mac: string;
  subnetMask?: string;
  gateway?: string;
  status?: 'active' | 'busy' | 'offline';
  routes?: RoutingTableEntry[];
  macTable?: Record<string, string>; // MAC -> port/device
  arpCache?: Record<string, string>; // IP -> MAC
}

export interface RoutingTableEntry {
  destination: string;
  mask: string;
  nextHop: string;
  interface: string;
  metric: number;
}

export type PacketStatus = 
  | 'waiting' 
  | 'in_flight' 
  | 'delivered' 
  | 'lost' 
  | 'delayed' 
  | 'retransmitted' 
  | 'duplicate_ack';

export interface PacketHeader {
  layer: LayerType;
  name: string;
  fields: Record<string, string | number | boolean>;
}

export interface SimulationPacket {
  id: string;
  protocol: ProtocolType;
  sourceId: string;
  destinationId: string;
  sourceIp: string;
  destinationIp: string;
  sourceMac: string;
  destinationMac: string;
  sourcePort?: number;
  destinationPort?: number;
  sequenceNumber?: number;
  ackNumber?: number;
  windowSize?: number;
  flags?: {
    syn?: boolean;
    ack?: boolean;
    fin?: boolean;
    rst?: boolean;
    psh?: boolean;
    urg?: boolean;
  };
  payload: string;
  ttl?: number;
  fcs?: string;
  status: PacketStatus;
  progress: number; // 0 to 1 along current hop
  currentHop: {
    from: string;
    to: string;
  };
  headers: PacketHeader[];
  color?: string;
  label?: string;
}

export type SimulationEventType =
  | 'application_data_created'
  | 'header_added'
  | 'header_removed'
  | 'frame_created'
  | 'packet_sent'
  | 'packet_received'
  | 'packet_lost'
  | 'packet_delayed'
  | 'ack_sent'
  | 'ack_received'
  | 'ack_lost'
  | 'timeout_started'
  | 'timeout_expired'
  | 'retransmission'
  | 'duplicate_ack'
  | 'connection_established'
  | 'connection_closed'
  | 'route_selected'
  | 'arp_request'
  | 'arp_reply'
  | 'dns_query'
  | 'dns_response'
  | 'queue_overflow'
  | 'packet_dropped';

export interface SimulationEvent {
  eventId: number;
  timestamp: number;
  type: SimulationEventType;
  protocol: ProtocolType;
  source: string;
  destination: string;
  packetId?: string;
  sequenceNumber?: number;
  ackNumber?: number;
  windowSize?: number;
  status: PacketStatus;
  explanation: string;
  technicalDetails?: string;
  layer?: LayerType;
}

export interface SimulationConfig {
  protocol: ProtocolType;
  windowSize: number;
  segmentSize: number;
  receiverBuffer: number;
  cwnd: number;
  ssthresh: number;
  rtt: number;
  bandwidthMbps: number;
  packetLossProbability: number;
  ackLossProbability: number;
  delayMs: number;
  routerQueueSize: number;
  senderRate: number;
  segmentCount: number;
  targetedLostPackets?: number[]; // specific packet sequence numbers to drop
  targetedLostAcks?: number[];
  targetedDelayedPackets?: number[];
  clientIp?: string;
  serverIp?: string;
}

export interface SimulationState {
  step: number;
  isRunning: boolean;
  isPaused: boolean;
  speed: number; // 0.5x, 1x, 2x, 4x
  currentTime: number;
  config: SimulationConfig;
  devices: NetworkDevice[];
  packets: SimulationPacket[];
  events: SimulationEvent[];
  selectedPacket: SimulationPacket | null;
  currentEvent: SimulationEvent | null;
  cwndHistory: { time: number; cwnd: number; ssthresh: number }[];
  metrics: {
    packetsSent: number;
    packetsDelivered: number;
    packetsLost: number;
    retransmissions: number;
    duplicateAcks: number;
    throughputBps: number;
    averageRttMs: number;
  };
}

export interface PredictionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PredictionPrompt {
  id: string;
  question: string;
  options: PredictionOption[];
  atStep: number;
  conceptTested: string;
}
