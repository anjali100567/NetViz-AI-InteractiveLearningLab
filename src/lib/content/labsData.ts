import { LayerType } from '../simulation/types';

export interface LabStep {
  stepNumber: number;
  title: string;
  stage: 'Learn' | 'Observe' | 'Predict' | 'Configure' | 'Run' | 'Analyze' | 'Practice' | 'Reflect';
  instruction: string;
  predictionQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  expectedAction?: string;
  aiHintLevel1: string;
  aiHintLevel2: string;
  walkthrough: string;
}

export interface GuidedLab {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  layer: LayerType;
  learningObjective: string;
  prerequisites: string[];
  conceptsUsed: string[];
  topology: string[];
  defaultSimulationId: string;
  steps: LabStep[];
  troubleshootingScenario?: {
    symptom: string;
    faultyNode: string;
    diagnosticCommand: string;
    solution: string;
  };
}

export const GUIDED_LABS: Record<string, GuidedLab> = {
  'lab-encapsulation': {
    id: 'lab-encapsulation',
    title: 'Lab 1: Packet Encapsulation & Decapsulation',
    difficulty: 'Beginner',
    durationMinutes: 15,
    layer: 'Application',
    learningObjective: 'Follow how application data is transformed across all 5 OSI/TCP-IP layers with specific headers and trailers.',
    prerequisites: ['Basic Layer Knowledge'],
    conceptsUsed: ['Protocol Data Units (PDU)', 'Headers', 'Trailers', 'MAC vs IP Addressing'],
    topology: ['Client Laptop', 'Switch', 'Router', 'Web Server'],
    defaultSimulationId: 'packet-encapsulation',
    steps: [
      {
        stepNumber: 1,
        title: 'Understand the Application Data',
        stage: 'Learn',
        instruction: 'A user types https://example.com/index.html in their browser. Observe the generated HTTP GET request message.',
        aiHintLevel1: 'Notice what data is in the application payload before headers are added.',
        aiHintLevel2: 'The application layer generates raw payload text without any routing or transport information.',
        walkthrough: 'The browser initiates an HTTP request. At this initial layer, only the requested path and HTTP headers exist. No IP or port is yet attached.',
      },
      {
        stepNumber: 2,
        title: 'Predict Transport Layer Attachment',
        stage: 'Predict',
        instruction: 'When this HTTP data moves down to the Transport Layer (TCP), which addressing fields will be prepended?',
        predictionQuestion: {
          question: 'What addressing information does TCP add during encapsulation?',
          options: [
            'IP Addresses (Source and Destination)',
            'Port Numbers (Source and Destination)',
            'MAC Addresses (Physical Hardware)',
            'URL Domain Name'
          ],
          correctIndex: 1,
          explanation: 'TCP operates at the Transport layer and attaches Source and Destination Port numbers (e.g. ephemeral port 54321 and destination port 80/443).',
        },
        aiHintLevel1: 'Think about what identifies individual programs or sockets on a single computer.',
        aiHintLevel2: 'IP identifies the host; ports identify the specific process.',
        walkthrough: 'TCP encapsulates the HTTP payload into a Segment by prepending a 20-byte TCP header with Source Port, Destination Port, Sequence Number, and ACK Number.',
      },
      {
        stepNumber: 3,
        title: 'Configure and Observe Hop-by-Hop MAC Rewriting',
        stage: 'Observe',
        instruction: 'Step through the simulation and watch what happens when the packet crosses the intermediate router.',
        aiHintLevel1: 'Check if the IP addresses changed, or if the MAC addresses changed.',
        aiHintLevel2: 'Routers operate at Layer 3; they strip old Layer 2 frames and build new ones.',
        walkthrough: 'At the router, the old Ethernet frame is stripped. The IP header remains unchanged (Source and Destination IP stay end-to-end), but a brand new Ethernet frame with new source and destination MAC is generated for the next link!',
      },
      {
        stepNumber: 4,
        title: 'Analyze Server Decapsulation',
        stage: 'Analyze',
        instruction: 'Observe the destination server stripping headers in reverse order (Data Link -> Network -> Transport -> Application).',
        aiHintLevel1: 'Each layer processes and removes its corresponding header before handing payload upward.',
        aiHintLevel2: 'Decapsulation is the exact inverse of encapsulation.',
        walkthrough: 'The server NIC strips the Ethernet header after verifying the CRC checksum, the IP layer strips the IP header, the TCP stack strips the TCP header, and passes clean HTTP data to the web server process.',
      },
      {
        stepNumber: 5,
        title: 'Reflect and Summary Quiz',
        stage: 'Reflect',
        instruction: 'Review your encapsulation trace and note key differences between end-to-end addressing (IP) and hop-by-hop addressing (MAC).',
        aiHintLevel1: 'Consider why both IP and MAC addresses are required.',
        aiHintLevel2: 'MAC delivers frames across local links; IP routes packets across the global internet.',
        walkthrough: 'You have mastered how application data becomes bits and traverses physical media through proper encapsulation.',
      },
    ],
  },

  'lab-tcp-handshake': {
    id: 'lab-tcp-handshake',
    title: 'Lab 2: TCP Three-Way Handshake & Connection States',
    difficulty: 'Beginner',
    durationMinutes: 15,
    layer: 'Transport',
    learningObjective: 'Master SYN, SYN-ACK, and ACK packet exchanges, sequence number synchronization, and kernel socket states.',
    prerequisites: ['TCP Basics', 'Port Numbers'],
    conceptsUsed: ['SYN', 'ACK', 'ISN (Initial Sequence Number)', 'State Machine (SYN_SENT, ESTABLISHED)'],
    topology: ['Client Host', 'Firewall / Router', 'Web Server'],
    defaultSimulationId: 'tcp-handshake',
    steps: [
      {
        stepNumber: 1,
        title: 'Initiate SYN from Client',
        stage: 'Learn',
        instruction: 'Observe the client selecting a randomized Initial Sequence Number (ISN = 1000) and setting SYN flag = 1.',
        aiHintLevel1: 'Look at the flags field in the packet inspector.',
        aiHintLevel2: 'The SYN flag tells the receiver: "I want to synchronize sequence numbers".',
        walkthrough: 'The client initiates the handshake by sending a TCP segment with SYN=1, ACK=0, and Seq=1000. Client transitions from CLOSED to SYN_SENT state.',
      },
      {
        stepNumber: 2,
        title: 'Predict Server Response',
        stage: 'Predict',
        instruction: 'What will the server set for the ACK number when replying to a SYN with Seq=1000?',
        predictionQuestion: {
          question: 'If Client sends SYN with Seq=1000, what will be the Server ACK number?',
          options: [
            'Ack = 1000',
            'Ack = 1001',
            'Ack = 0',
            'Ack = 5000'
          ],
          correctIndex: 1,
          explanation: 'A SYN segment consumes 1 virtual byte in sequence space. Therefore, the server acknowledges it with Ack = Seq + 1 = 1001.',
        },
        aiHintLevel1: 'Remember the rule: SYN and FIN segments consume 1 sequence number byte.',
        aiHintLevel2: 'The receiver acknowledges the next expected sequence number.',
        walkthrough: 'Server acknowledges client ISN with Ack=1001 and generates its own ISN (Seq=5000), transmitting a SYN-ACK segment.',
      },
      {
        stepNumber: 3,
        title: 'Run Final Handshake Step',
        stage: 'Run',
        instruction: 'Advance the simulation to see the client return the final ACK (Seq=1001, Ack=5001).',
        aiHintLevel1: 'Both sockets are now in ESTABLISHED state.',
        aiHintLevel2: 'Data transmission can now begin immediately.',
        walkthrough: 'Connection is established. Both client and server have verified that bidirectional data transfer is working and know each other sequence numbers.',
      },
    ],
  },

  'lab-ack-loss': {
    id: 'lab-ack-loss',
    title: 'Lab 3: ACK Loss, Timeout, and Duplicate Detection',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Transport',
    learningObjective: 'Diagnose what happens when an acknowledgment is lost and how TCP prevents application data duplication.',
    prerequisites: ['TCP Handshake', 'Sequence & ACK Numbers'],
    conceptsUsed: ['Retransmission Timeout (RTO)', 'Duplicate Segment Detection', 'Karn’s Algorithm'],
    topology: ['Client Sender', 'Bottleneck Switch', 'Server Receiver'],
    defaultSimulationId: 'tcp-ack-loss',
    steps: [
      {
        stepNumber: 1,
        title: 'Observe Data Delivery',
        stage: 'Learn',
        instruction: 'Client transmits Data Segment #1 (Seq 2000). The segment safely reaches the server buffer.',
        aiHintLevel1: 'Notice that the data itself arrived without any loss.',
        aiHintLevel2: 'The server prepares the return ACK.',
        walkthrough: 'Server writes payload to buffer and creates ACK 2100.',
      },
      {
        stepNumber: 2,
        title: 'Predict Sender Reaction to Lost ACK',
        stage: 'Predict',
        instruction: 'The ACK packet is lost on the return path. How will the sender react?',
        predictionQuestion: {
          question: 'What occurs at the sender when the ACK is dropped?',
          options: [
            'Sender immediately sends an RST packet to abort.',
            'Sender waits until its RTO timer expires, then retransmits Segment #1.',
            'Sender assumes delivery succeeded and sends Segment #2.',
            'Receiver sends an ICMP error to the sender.'
          ],
          correctIndex: 1,
          explanation: 'Because TCP is a positive acknowledgment protocol, sender must receive an ACK. If the RTO timer expires without ACK, sender retransmits.',
        },
        aiHintLevel1: 'The sender has a timer running for every unacknowledged segment.',
        aiHintLevel2: 'Without an ACK, sender cannot know if the data arrived.',
        walkthrough: 'The sender RTO timer expires. It retransmits Segment #1 with identical sequence number 2000.',
      },
      {
        stepNumber: 3,
        title: 'Analyze Receiver Duplicate Handling',
        stage: 'Analyze',
        instruction: 'Observe the server when the retransmitted segment arrives with Seq=2000.',
        aiHintLevel1: 'Compare the received Seq against the receiver expected sequence number.',
        aiHintLevel2: 'The receiver already has Seq 2000-2099; it must not append it twice.',
        walkthrough: 'Receiver detects that Seq 2000 is lower than expected sequence 2100. It discards the redundant payload bytes and re-sends ACK 2100 to clear the sender queue.',
      },
    ],
  },

  'lab-congestion-control': {
    id: 'lab-congestion-control',
    title: 'Lab 4: TCP Congestion Control (Slow Start & AIMD)',
    difficulty: 'Advanced',
    durationMinutes: 25,
    layer: 'Transport',
    learningObjective: 'Analyze Congestion Window (CWND) dynamics, exponential Slow Start, linear Congestion Avoidance, and Fast Recovery.',
    prerequisites: ['TCP Sliding Window', 'RTT & Bottleneck Bandwidth'],
    conceptsUsed: ['CWND', 'SSTHRESH', 'Additive Increase Multiplicative Decrease (AIMD)', 'Fast Retransmit'],
    topology: ['Sender Host', 'Congested Router', 'Receiver Host'],
    defaultSimulationId: 'tcp-congestion-control',
    steps: [
      {
        stepNumber: 1,
        title: 'Slow Start Phase',
        stage: 'Learn',
        instruction: 'Watch the CWND graph start at 1 MSS and double every round-trip time (1 -> 2 -> 4 -> 8 MSS).',
        aiHintLevel1: 'Slow start increases exponentially, doubling each RTT.',
        aiHintLevel2: 'Exponential growth allows the connection to rapidly probe available bandwidth.',
        walkthrough: 'For each ACK received during Slow Start, CWND increases by 1 MSS, resulting in a doubling of window size every RTT.',
      },
      {
        stepNumber: 2,
        title: 'Predict Transition to Congestion Avoidance',
        stage: 'Predict',
        instruction: 'When CWND reaches SSTHRESH (8 MSS), how will the growth behavior change?',
        predictionQuestion: {
          question: 'What is the CWND increase rule in Congestion Avoidance?',
          options: [
            'CWND continues doubling every RTT.',
            'CWND increases linearly by approximately +1 MSS per RTT.',
            'CWND stops growing completely.',
            'CWND is immediately halved.'
          ],
          correctIndex: 1,
          explanation: 'In Congestion Avoidance, TCP uses Additive Increase: CWND grows by ~1 MSS per RTT to cautiously approach bottleneck capacity.',
        },
        aiHintLevel1: 'Additive increase means adding a constant amount rather than multiplying.',
        aiHintLevel2: 'Linear growth prevents sudden buffer overflow.',
        walkthrough: 'CWND transitions from exponential to linear growth (+1 MSS per RTT), visible as a gentle slope on the live graph.',
      },
      {
        stepNumber: 3,
        title: 'Observe Packet Loss & Multiplicative Decrease',
        stage: 'Analyze',
        instruction: 'A queue drop occurs at CWND = 12. Observe SSTHRESH cut in half (12 / 2 = 6 MSS) and recovery dynamics.',
        aiHintLevel1: 'Multiplicative decrease cuts the sending rate aggressively to relieve network congestion.',
        aiHintLevel2: 'Notice the sawtooth pattern on the congestion graph.',
        walkthrough: 'The router drops a packet. TCP Reno cuts SSTHRESH to 6 and enters Fast Recovery, retransmitting the lost segment without dropping to CWND=1.',
      },
    ],
  },

  'lab-dns': {
    id: 'lab-dns',
    title: 'Lab 5: Recursive & Iterative DNS Resolution',
    difficulty: 'Beginner',
    durationMinutes: 15,
    layer: 'Application',
    learningObjective: 'Inspect hierarchical DNS name resolution from client resolver through Root, TLD, and Authoritative servers.',
    prerequisites: ['IP Addressing Basics', 'Client-Server Architecture'],
    conceptsUsed: ['A Records', 'Root (.), TLD (.com)', 'Authoritative Servers', 'TTL Caching'],
    topology: ['Client PC', 'Local DNS Resolver', 'Root DNS (.)', 'TLD DNS (.com)', 'Authoritative DNS'],
    defaultSimulationId: 'dns-resolution',
    steps: [
      {
        stepNumber: 1,
        title: 'Observe Recursive Query',
        stage: 'Learn',
        instruction: 'Client queries its configured recursive resolver (8.8.8.8) for www.example.com.',
        aiHintLevel1: 'In recursive queries, the client delegates the resolution task completely to the resolver.',
        aiHintLevel2: 'The client expects a final answer or error.',
        walkthrough: 'Client transmits a UDP datagram to Port 53 of the resolver with the Recursion Desired (RD) bit set.',
      },
      {
        stepNumber: 2,
        title: 'Predict Root DNS Referral',
        stage: 'Predict',
        instruction: 'Does the Root DNS server return the final IP address of www.example.com?',
        predictionQuestion: {
          question: 'What does a Root DNS server return for a www.example.com query?',
          options: [
            'The exact IP address 93.184.216.34',
            'Referral to the .com TLD nameservers with glue records',
            'An HTTP redirect code 301',
            'An ICMP host unreachable error'
          ],
          correctIndex: 1,
          explanation: 'Root servers do not store end-host records; they only maintain delegations to Top-Level Domain (TLD) servers like .com, .org, .edu.',
        },
        aiHintLevel1: 'Think about DNS as an inverted tree starting at the root dot.',
        aiHintLevel2: 'Root knows where .com is; .com knows where example.com is.',
        walkthrough: 'Root server returns referral to .com nameservers. Resolver then queries .com TLD server, receives delegation to ns1.example.com, and finally obtains the A record.',
      },
    ],
  },

  'lab-arp': {
    id: 'lab-arp',
    title: 'Lab 6: ARP Resolution & Switch MAC Learning',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Data Link',
    learningObjective: 'Understand how Layer 2 switches learn MAC addresses and how hosts map IP to MAC using ARP broadcast and unicast.',
    prerequisites: ['MAC Addresses', 'Broadcast Domains'],
    conceptsUsed: ['ARP Cache', 'Switch MAC Table', 'Broadcast vs Unicast', 'Flooding'],
    topology: ['Host A', 'Host B', 'Host C', 'Layer 2 Switch', 'Host D'],
    defaultSimulationId: 'arp-switch-learning',
    steps: [
      {
        stepNumber: 1,
        title: 'ARP Request Broadcast & Switch Learning',
        stage: 'Observe',
        instruction: 'Host A sends an ARP Request. Watch the switch inspect the source MAC and update its table, then flood the frame.',
        aiHintLevel1: 'Switches learn from the SOURCE MAC address of incoming frames.',
        aiHintLevel2: 'Broadcast frames (FF:FF:FF:FF:FF:FF) are forwarded out all ports except the ingress port.',
        walkthrough: 'Switch learns Host A MAC on Port 1. Because destination is broadcast, it floods out Ports 2, 3, and 4.',
      },
      {
        stepNumber: 2,
        title: 'Predict Target Host Reaction',
        stage: 'Predict',
        instruction: 'Hosts B, C, and D receive the broadcast. Which host will respond with an ARP reply?',
        predictionQuestion: {
          question: 'Which host answers the ARP Request for 192.168.1.50?',
          options: [
            'Every host replies with its own MAC address.',
            'Only the host whose configured IP matches 192.168.1.50 (Host D).',
            'The switch replies on behalf of all hosts.',
            'The default gateway router replies.'
          ],
          correctIndex: 1,
          explanation: 'Only the host matching the target IP processes the payload and responds. Other hosts inspect the target IP and silently drop the frame.',
        },
        aiHintLevel1: 'Hosts check the target IP field inside the ARP payload.',
        aiHintLevel2: 'If target IP != local IP, drop the packet.',
        walkthrough: 'Only Host D replies. Crucially, the reply is UNICAST directly to Host A MAC, so the switch forwards it only to Port 1 without flooding!',
      },
    ],
  },

  'lab-subnetting': {
    id: 'lab-subnetting',
    title: 'Lab 7: IP Subnetting & CIDR Calculations',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Network',
    learningObjective: 'Calculate network address, broadcast address, and usable host range from an IP and prefix, determining whether destinations are local or remote.',
    prerequisites: ['Binary Basics', 'IPv4 Addressing'],
    conceptsUsed: ['CIDR /26', 'Network Address', 'Broadcast Address', 'Default Gateway Decision'],
    topology: ['Host 192.168.10.45/26', 'Switch', 'Router Gateway 192.168.10.1'],
    defaultSimulationId: 'routing-longest-prefix',
    steps: [
      {
        stepNumber: 1,
        title: 'Calculate Network Address for 192.168.10.45/26',
        stage: 'Predict',
        instruction: 'Given host IP 192.168.10.45 and CIDR mask /26 (255.255.255.192), calculate the Network Address.',
        predictionQuestion: {
          question: 'What is the network address for 192.168.10.45/26?',
          options: [
            '192.168.10.0',
            '192.168.10.32',
            '192.168.10.63',
            '192.168.10.64'
          ],
          correctIndex: 0,
          explanation: 'A /26 subnet has block size 256 - 192 = 64. Subnet blocks start at .0, .64, .128, .192. Host .45 falls in the 192.168.10.0 block (usable hosts .1 to .62, broadcast .63).',
        },
        aiHintLevel1: 'In /26, 6 host bits remain: 2^6 = 64 addresses per block.',
        aiHintLevel2: 'Block range: 192.168.10.0 to 192.168.10.63.',
        walkthrough: 'Bitwise AND of 192.168.10.45 and 255.255.255.192 yields 192.168.10.0. Broadcast address is 192.168.10.63.',
      },
    ],
  },

  'lab-nat': {
    id: 'lab-nat',
    title: 'Lab 8: Network Address Translation (NAT/PAT)',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Network',
    learningObjective: 'Inspect translation of RFC 1918 private source IP and port to public WAN IP and tracking inside the NAT translation table.',
    prerequisites: ['IPv4 Addressing', 'Port Multiplexing'],
    conceptsUsed: ['PAT / NAPT', 'Inside Local / Global', 'Outside Global', 'State Table'],
    topology: ['LAN Host (192.168.1.15)', 'NAT Router (Public: 203.0.113.8)', 'Public Web Server (93.184.216.34)'],
    defaultSimulationId: 'nat-translation',
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Outbound Packet Translation',
        stage: 'Observe',
        instruction: 'Private host 192.168.1.15:49152 sends an HTTP request to 93.184.216.34:80. Observe the NAT table entry.',
        aiHintLevel1: 'The router rewrites the source IP and source port.',
        aiHintLevel2: 'The destination IP remains the public web server.',
        walkthrough: 'NAT router replaces 192.168.1.15:49152 with 203.0.113.8:61001, saving this session tuple in its active state table.',
      },
    ],
  },
};
