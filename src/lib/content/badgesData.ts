export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'Explorer' | 'Master' | 'Troubleshooter';
  unlockedByDefault?: boolean;
}

export const BADGES_DATA: BadgeItem[] = [
  {
    id: 'packet-pathfinder',
    name: 'Packet Pathfinder',
    description: 'Completed your first full-stack packet encapsulation and decapsulation simulation journey.',
    iconName: 'Navigation',
    category: 'Explorer',
    unlockedByDefault: true,
  },
  {
    id: 'tcp-troubleshooter',
    name: 'TCP Troubleshooter',
    description: 'Mastered SYN-ACK drops, ACK loss duplicate detection, and Fast Retransmit recovery.',
    iconName: 'ShieldAlert',
    category: 'Troubleshooter',
  },
  {
    id: 'routing-ranger',
    name: 'Routing Ranger',
    description: 'Correctly identified longest-prefix match routes and resolved default gateway forwarding.',
    iconName: 'Compass',
    category: 'Master',
  },
  {
    id: 'congestion-controller',
    name: 'Congestion Controller',
    description: 'Analyzed live CWND sawtooth graphs, Slow Start exponential growth, and AIMD recovery.',
    iconName: 'Activity',
    category: 'Master',
  },
  {
    id: 'dns-detective',
    name: 'DNS Detective',
    description: 'Traced recursive domain queries from client resolver to Root, TLD, and Authoritative servers.',
    iconName: 'Search',
    category: 'Explorer',
  },
  {
    id: 'arp-explorer',
    name: 'ARP Explorer',
    description: 'Observed switch source MAC learning tables and local broadcast domain ARP resolution.',
    iconName: 'Cpu',
    category: 'Explorer',
  },
  {
    id: 'subnet-solver',
    name: 'Subnet Solver',
    description: 'Scored 100% on CIDR prefix math, broadcast address calculations, and usable host ranges.',
    iconName: 'Binary',
    category: 'Master',
  },
  {
    id: 'network-debugger',
    name: 'Network Debugger',
    description: 'Successfully diagnosed and repaired a broken network topology scenario using simulated terminal tools.',
    iconName: 'Terminal',
    category: 'Troubleshooter',
  },
  {
    id: 'protocol-master',
    name: 'Protocol Master',
    description: 'Completed practice rounds across all 5 layers with greater than 85% accuracy.',
    iconName: 'Award',
    category: 'Master',
  },
  {
    id: 'layer-by-layer-learner',
    name: 'Layer-by-Layer Learner',
    description: 'Finished both Top-Down and Bottom-Up full guided courses on NetViz AI.',
    iconName: 'Layers',
    category: 'Explorer',
  },
];
