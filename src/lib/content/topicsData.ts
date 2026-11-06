import { LayerType } from '../simulation/types';

export interface TopicItem {
  id: string;
  name: string;
  layer: LayerType;
  pdu: string;
  addressing: string;
  devices: string[];
  summary: string;
  beginnerExplanation: string;
  technicalExplanation: string;
  realWorldAnalogy: string;
  commonMisconceptions: string[];
  prerequisites: string[];
  relatedTopics: string[];
  simulationId?: string;
  labId?: string;
  practiceCount: number;
  whatIfScenarios: {
    question: string;
    expectedOutcome: string;
    suggestedConfig?: Record<string, unknown>;
  }[];
}

export const TOPICS_DATA: Record<string, TopicItem> = {
  'http-https': {
    id: 'http-https',
    name: 'HTTP & HTTPS Web Protocols',
    layer: 'Application',
    pdu: 'Data / Message',
    addressing: 'URL / URI, Hostname',
    devices: ['Web Client', 'Reverse Proxy', 'Web Server'],
    summary: 'Stateless request-response protocol powering the World Wide Web, secured by TLS in HTTPS.',
    beginnerExplanation: 'Think of HTTP like sending a postcard with a request ("Please send me the front page"), and the server sends back a postcard with the requested page. HTTPS is sending that exact postcard locked inside a tamper-proof steel briefcase.',
    technicalExplanation: 'HTTP/1.1 uses persistent TCP connections with chunked transfer encoding. HTTPS wraps HTTP inside TLS (Transport Layer Security), which performs an asymmetric handshake (ECDHE/RSA) to establish symmetric session keys (AES-GCM), guaranteeing confidentiality, integrity, and server authentication.',
    realWorldAnalogy: 'Ordering food at a drive-thru window (Request) and having the bag handed back to you (Response).',
    commonMisconceptions: [
      'Myth: HTTPS hides the domain name from your ISP. Reality: SNI (Server Name Indication) in legacy TLS leaves the hostname visible in plaintext unless Encrypted Client Hello (ECH) is used.',
      'Myth: HTTP is stateful because websites remember you. Reality: HTTP is strictly stateless; cookies and JWT tokens simulate state.',
    ],
    prerequisites: ['tcp-basics', 'dns-resolution'],
    relatedTopics: ['dns-resolution', 'tcp-handshake', 'tcp-sliding-window'],
    simulationId: 'packet-encapsulation',
    labId: 'lab-encapsulation',
    practiceCount: 10,
    whatIfScenarios: [
      {
        question: 'What happens if a website does not use HTTPS?',
        expectedOutcome: 'Packets travel unencrypted through every router and Wi-Fi hotspot, making passwords and cookies trivially vulnerable to packet sniffing (Wireshark) and man-in-the-middle attacks.',
      },
      {
        question: 'What happens if HTTP Keep-Alive is disabled?',
        expectedOutcome: 'A new TCP 3-way handshake must be performed for every single image, CSS file, and script, drastically increasing page load latency due to multiple RTTs.',
      },
    ],
  },

  'tcp-handshake': {
    id: 'tcp-handshake',
    name: 'TCP Three-Way Handshake',
    layer: 'Transport',
    pdu: 'Segment',
    addressing: 'Port Numbers (0 - 65535)',
    devices: ['Client OS Kernel', 'Server OS Kernel', 'Firewall'],
    summary: 'Synchronizes initial sequence numbers (ISN) and confirms bidirectional communication before transmitting data.',
    beginnerExplanation: 'Before two people talk on walkie-talkies, they do a roll call: Person A: "Can you hear me?" (SYN). Person B: "Yes, I hear you! Can you hear me?" (SYN-ACK). Person A: "I hear you loud and clear!" (ACK). Now they can talk safely.',
    technicalExplanation: 'TCP connection establishment requires 3 segments: 1) Client sends SYN with random ISN_C. 2) Server replies with SYN-ACK, acknowledging ISN_C + 1 and presenting its own ISN_S. 3) Client returns ACK for ISN_S + 1. Sequence numbers prevent replay attacks and ensure in-order reassembly.',
    realWorldAnalogy: 'Making a phone call: Dialing -> Ringing & "Hello?" -> "Hi, it is Alice!" -> Conversation begins.',
    commonMisconceptions: [
      'Myth: The ACK packet can carry application data. Reality: In standard TCP, the 3rd packet (ACK) can piggyback application data, but the initial SYN cannot.',
      'Myth: Sequence numbers start at 0. Reality: ISNs are pseudo-randomized to prevent sequence number prediction attacks.',
    ],
    prerequisites: ['ports-sockets'],
    relatedTopics: ['tcp-sliding-window', 'tcp-ack-loss', 'tcp-congestion-control'],
    simulationId: 'tcp-handshake',
    labId: 'lab-tcp-handshake',
    practiceCount: 12,
    whatIfScenarios: [
      {
        question: 'What happens if the initial SYN packet is lost?',
        expectedOutcome: 'The client receives no response, its RTO timer expires, and it retransmits the SYN segment with an exponential backoff timer.',
      },
      {
        question: 'What happens if the server port is closed?',
        expectedOutcome: 'The server immediately responds with a TCP RST (Reset) packet, terminating the attempt without an error timeout.',
      },
    ],
  },

  'tcp-sliding-window': {
    id: 'tcp-sliding-window',
    name: 'TCP Sliding Window & Flow Control',
    layer: 'Transport',
    pdu: 'Segment',
    addressing: 'Port Numbers & Sequence Numbers',
    devices: ['Host Sockets', 'Network Buffers'],
    summary: 'Controls the volume of unacknowledged data in flight to match the receiving host buffer capacity.',
    beginnerExplanation: 'Imagine feeding pages of a book to a translator. If the translator reads fast, you can slide 5 pages across the table at once. If they get tired, they tell you "only 1 page at a time" so pages do not spill onto the floor.',
    technicalExplanation: 'The receiver advertises a Receive Window (rwnd) in every ACK header based on available socket buffer space. The sender cannot exceed min(rwnd, cwnd) bytes of unacknowledged data in flight. As cumulative ACKs arrive, the sending window slides to the right.',
    realWorldAnalogy: 'An assembly line conveyor belt that pauses when the packaging worker’s holding bin is full.',
    commonMisconceptions: [
      'Myth: Flow control prevents router congestion. Reality: Flow control protects the RECEIVER buffer; Congestion control protects the intermediate NETWORK routers.',
    ],
    prerequisites: ['tcp-handshake'],
    relatedTopics: ['tcp-congestion-control', 'tcp-ack-loss', 'stop-and-wait'],
    simulationId: 'tcp-sliding-window',
    labId: 'lab-tcp-sliding-window',
    practiceCount: 11,
    whatIfScenarios: [
      {
        question: 'What happens if the receiver window drops to zero (Zero Window)?',
        expectedOutcome: 'The sender pauses all data transmission and starts sending periodic 1-byte "Window Probe" packets to monitor when buffer space reopens.',
      },
    ],
  },

  'tcp-ack-loss': {
    id: 'tcp-ack-loss',
    name: 'ACK Loss & Duplicate Detection',
    layer: 'Transport',
    pdu: 'Segment',
    addressing: 'Sequence & ACK Numbers',
    devices: ['Host TCP Stacks'],
    summary: 'How TCP handles lost acknowledgment packets without corrupting or duplicating data at the application layer.',
    beginnerExplanation: 'You mail a birthday gift to your friend. They receive it and mail a thank-you note. The thank-you note gets lost in the rain. Since you never got the note, you assume the gift was lost and mail another one. Your friend receives the duplicate, realizes they already have it, puts it aside, and mails another thank-you note.',
    technicalExplanation: 'When an ACK is lost in flight, the sender RTO timer expires and triggers retransmission of the original segment. The receiver detects that the sequence number is lower than its expected sequence number (duplicate data), discards the duplicate bytes from the app queue, and immediately re-sends the cumulative ACK.',
    realWorldAnalogy: 'Resending a confirmation SMS when the first acknowledgment was not heard over a noisy line.',
    commonMisconceptions: [
      'Myth: If an ACK is lost, the data is also lost. Reality: The data was successfully delivered to the receiver; only the confirmation packet was lost.',
    ],
    prerequisites: ['tcp-handshake', 'tcp-sliding-window'],
    relatedTopics: ['tcp-fast-retransmit', 'tcp-congestion-control'],
    simulationId: 'tcp-ack-loss',
    labId: 'lab-ack-loss',
    practiceCount: 10,
    whatIfScenarios: [
      {
        question: 'Why does the receiver not deliver duplicate data to the application?',
        expectedOutcome: 'The receiver maintains state of the expected contiguous byte sequence number. Any segment with Seq < expected is recognized as already buffered and discarded.',
      },
    ],
  },

  'tcp-congestion-control': {
    id: 'tcp-congestion-control',
    name: 'TCP Congestion Control (AIMD)',
    layer: 'Transport',
    pdu: 'Segment',
    addressing: 'Congestion Window (cwnd)',
    devices: ['Intermediate Routers', 'Sender TCP Stack'],
    summary: 'Dynamic probing of network capacity via Slow Start, Congestion Avoidance, and Fast Recovery.',
    beginnerExplanation: 'Imagine driving on a highway in heavy fog. You slowly accelerate (doubling speed) until you reach cruising speed (additive increase). If you see brake lights or tap another car (packet drop), you instantly slam on the brakes and cut your speed in half to prevent a pileup.',
    technicalExplanation: 'Maintains cwnd (Congestion Window) in MSS units. Phase 1 (Slow Start): cwnd doubles every RTT until ssthresh. Phase 2 (Congestion Avoidance): cwnd increases by +1 MSS per RTT (Additive Increase). On packet loss: Tahoe resets cwnd to 1; Reno halves ssthresh = cwnd/2 and sets cwnd = ssthresh (Fast Recovery, Multiplicative Decrease).',
    realWorldAnalogy: 'Pouring water into a pitcher slowly at first, then at a steady trickle until you see droplets splash over the rim.',
    commonMisconceptions: [
      'Myth: "Slow Start" is slow. Reality: Slow start increases exponentially (1, 2, 4, 8, 16...), which is the fastest growth rate in TCP.',
    ],
    prerequisites: ['tcp-sliding-window'],
    relatedTopics: ['tcp-ack-loss', 'tcp-fast-retransmit'],
    simulationId: 'tcp-congestion-control',
    labId: 'lab-congestion-control',
    practiceCount: 12,
    whatIfScenarios: [
      {
        question: 'What happens to cwnd when 3 duplicate ACKs are received in TCP Reno?',
        expectedOutcome: 'ssthresh is set to cwnd / 2, and cwnd is set to ssthresh (Fast Recovery), avoiding a drop to 1 MSS.',
      },
    ],
  },

  'dns-resolution': {
    id: 'dns-resolution',
    name: 'Domain Name System (DNS)',
    layer: 'Application',
    pdu: 'Message / Datagram',
    addressing: 'FQDN, IP Address',
    devices: ['Stub Resolver', 'Recursive Resolver', 'Root DNS', 'TLD DNS', 'Authoritative Server'],
    summary: 'The phonebook of the internet, mapping human-readable names to IP addresses.',
    beginnerExplanation: 'You do not memorize phone numbers; you look up "Mom" in contacts. DNS translates "google.com" into the numerical IP address "142.250.190.46" so routers know where to send packets.',
    technicalExplanation: 'Uses UDP port 53 (and TCP for large responses/zone transfers). In recursive queries, the local resolver navigates the hierarchical namespace: Root (.) -> TLD (.com) -> Authoritative (example.com). Responses are cached according to Time-To-Live (TTL).',
    realWorldAnalogy: 'Asking an information desk at a giant library for a specific book location.',
    commonMisconceptions: [
      'Myth: Root servers store every single website IP. Reality: Root servers only hold delegations to the TLD nameservers.',
    ],
    prerequisites: ['ip-addressing'],
    relatedTopics: ['http-https', 'dhcp-protocol', 'udp-basics'],
    simulationId: 'dns-resolution',
    labId: 'lab-dns',
    practiceCount: 10,
    whatIfScenarios: [
      {
        question: 'What happens when a DNS TTL is set to 0 seconds?',
        expectedOutcome: 'Resolvers will not cache the response, forcing every single user request to query the authoritative nameserver, increasing latency and server load.',
      },
    ],
  },

  'arp-protocol': {
    id: 'arp-protocol',
    name: 'Address Resolution Protocol (ARP)',
    layer: 'Data Link',
    pdu: 'Frame',
    addressing: 'IP Address <-> MAC Address',
    devices: ['Layer 2 Switches', 'Network Cards (NICs)', 'Routers'],
    summary: 'Resolves a known Layer 3 IP address to a physical Layer 2 MAC address on the local broadcast domain.',
    beginnerExplanation: 'You are in a classroom and know you need to talk to "Student ID 42", but you do not know what they look like. You shout: "Who is student 42?" (Broadcast). That student raises their hand and replies: "I am right here at desk 5" (Unicast).',
    technicalExplanation: 'Host sends an ARP Request broadcast (Ethernet destination FF:FF:FF:FF:FF:FF). The target device matching the IP replies with an ARP Reply unicast containing its MAC address. Both devices store the mapping in their local ARP cache table with an expiration timer.',
    realWorldAnalogy: 'Shouting a person’s name in a crowded room to find out where they are sitting.',
    commonMisconceptions: [
      'Myth: ARP works across the internet. Reality: ARP operates strictly within a single local broadcast domain (subnet). It cannot cross a router.',
    ],
    prerequisites: ['ip-addressing', 'ethernet-mac'],
    relatedTopics: ['ethernet-mac', 'switching-vlan', 'subnetting-routing'],
    simulationId: 'arp-switch-learning',
    labId: 'lab-arp',
    practiceCount: 10,
    whatIfScenarios: [
      {
        question: 'What happens if two devices have the same IP address on a LAN?',
        expectedOutcome: 'Both devices reply to ARP requests (ARP conflict/spoofing symptom), causing intermittent connection drops as switch MAC tables flap.',
      },
    ],
  },

  'subnetting-routing': {
    id: 'subnetting-routing',
    name: 'IP Subnetting & Routing Tables',
    layer: 'Network',
    pdu: 'Packet',
    addressing: 'IPv4 / IPv6, CIDR Prefix (/24, /28)',
    devices: ['Layer 3 Routers', 'Default Gateways'],
    summary: 'Partitioning address space into logical subnets and determining packet forwarding paths using Longest Prefix Match.',
    beginnerExplanation: 'Subnetting is like dividing a large apartment building into numbered floors and suites. Routing is the mail sorting facility deciding which delivery truck takes a package based on the postal code prefix.',
    technicalExplanation: 'A subnet mask divides an IP into Network ID and Host ID. A router applies bitwise AND operations between the destination IP and table subnet masks to find all matching routes, then forwards out the interface of the route with the Longest Prefix Match (most specific mask).',
    realWorldAnalogy: 'Sorting mail by Country -> State -> City -> Postal Code -> Street Address.',
    commonMisconceptions: [
      'Myth: A /24 subnet has 256 usable hosts. Reality: 2 addresses are reserved (Network ID .0 and Broadcast .255), giving 254 usable host addresses.',
    ],
    prerequisites: ['ip-addressing'],
    relatedTopics: ['arp-protocol', 'nat-protocol', 'icmp-diagnostics'],
    simulationId: 'routing-longest-prefix',
    labId: 'lab-subnetting',
    practiceCount: 12,
    whatIfScenarios: [
      {
        question: 'What happens if a routing table has no default gateway (0.0.0.0/0) and no matching route?',
        expectedOutcome: 'The router drops the packet immediately and sends an ICMP Type 3 Code 0 (Destination Network Unreachable) error back to the sender.',
      },
    ],
  },

  'nat-protocol': {
    id: 'nat-protocol',
    name: 'Network Address Translation (NAT & PAT)',
    layer: 'Network',
    pdu: 'Packet',
    addressing: 'Private RFC 1918 IPs <-> Public IP + Port',
    devices: ['Home Gateways', 'Enterprise Firewalls', 'Edge Routers'],
    summary: 'Translates private unroutable IP addresses to a shared public IP, conserving global IPv4 space.',
    beginnerExplanation: 'Like a receptionist in a company with 500 employees. Every outgoing letter has the company’s main street address and an extension number. When replies arrive, the receptionist routes them to the right worker.',
    technicalExplanation: 'Port Address Translation (PAT/NAPT) maps many private sockets (e.g. 192.168.1.15:52134) to a single public IP with unique source ports (e.g. 203.0.113.8:61001). A state table tracks active sessions and rewrites return packet headers.',
    realWorldAnalogy: 'A mailroom desk sorting corporate mail using department extension codes.',
    commonMisconceptions: [
      'Myth: NAT is a true security firewall. Reality: NAT hides internal topology as a side effect of address translation, but is not an authentication or stateful inspection firewall.',
    ],
    prerequisites: ['ip-addressing', 'ports-sockets'],
    relatedTopics: ['subnetting-routing', 'http-https'],
    simulationId: 'nat-translation',
    labId: 'lab-nat',
    practiceCount: 10,
    whatIfScenarios: [
      {
        question: 'What happens if an external device tries to initiate a connection to a private host behind NAT without port forwarding?',
        expectedOutcome: 'The NAT router has no entry in its state table for the unsolicited inbound packet and immediately drops it.',
      },
    ],
  },
};
