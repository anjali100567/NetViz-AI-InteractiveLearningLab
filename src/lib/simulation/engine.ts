import { 
  SimulationConfig, 
  SimulationEvent, 
  SimulationPacket, 
  NetworkDevice, 
  PacketHeader,
  LayerType
} from './types';

export interface PredefinedScenario {
  id: string;
  name: string;
  description: string;
  protocol: string;
  category: 'TCP' | 'UDP' | 'Encapsulation' | 'ARQ' | 'Congestion' | 'Network';
  defaultConfig: Partial<SimulationConfig>;
  generateEvents: (config: SimulationConfig) => SimulationEvent[];
}

export function createEncapsulationHeaders(payload: string, seqNum = 1000, ackNum = 0): PacketHeader[] {
  return [
    {
      layer: 'Application',
      name: 'HTTP / Web Data',
      fields: {
        method: 'GET',
        path: '/index.html',
        protocolVersion: 'HTTP/1.1',
        host: 'api.netviz.internal',
        payloadLength: `${payload.length} bytes`,
      },
    },
    {
      layer: 'Transport',
      name: 'TCP Header (20 Bytes)',
      fields: {
        sourcePort: 54321,
        destinationPort: 80,
        sequenceNumber: seqNum,
        ackNumber: ackNum,
        windowSize: 64240,
        flags: 'ACK, PSH (0x018)',
        checksum: '0x8a4b (Valid)',
      },
    },
    {
      layer: 'Network',
      name: 'IPv4 Header (20 Bytes)',
      fields: {
        version: 4,
        headerLength: '20 bytes',
        ttl: 64,
        protocol: 'TCP (6)',
        sourceIp: '192.168.1.10',
        destinationIp: '10.0.0.50',
        checksum: '0xb231 (Valid)',
      },
    },
    {
      layer: 'Data Link',
      name: 'Ethernet II Frame (18 Bytes)',
      fields: {
        destinationMac: '00:1A:2B:3C:4D:5E',
        sourceMac: 'AA:BB:CC:DD:EE:01',
        etherType: '0x0800 (IPv4)',
        fcsCrc: '0x3F82C901 (CRC-32 OK)',
      },
    },
    {
      layer: 'Physical',
      name: 'Bitstream / Physical Signal',
      fields: {
        encoding: 'NRZ / 4B5B Optical Signal',
        baudRate: '1000 Mbps',
        bitsSample: '01001000 01100101 01101100 01101100 01101111...',
      },
    },
  ];
}

export const SIMULATION_SCENARIOS: Record<string, PredefinedScenario> = {
  'tcp-handshake': {
    id: 'tcp-handshake',
    name: 'TCP Three-Way Handshake',
    description: 'Establishment of reliable bidirectional transport connection between Client and Server using SYN, SYN-ACK, and ACK.',
    protocol: 'TCP',
    category: 'TCP',
    defaultConfig: {
      protocol: 'TCP',
      windowSize: 4,
      rtt: 100,
      packetLossProbability: 0,
      ackLossProbability: 0,
    },
    generateEvents: (config) => {
      const clientSeq = 1000;
      const serverSeq = 5000;
      const events: SimulationEvent[] = [];

      // Step 1: SYN
      events.push({
        eventId: 1,
        timestamp: 0,
        type: 'packet_sent',
        protocol: 'TCP',
        source: 'client',
        destination: 'server',
        sequenceNumber: clientSeq,
        ackNumber: 0,
        status: config.targetedLostPackets?.includes(1) ? 'lost' : 'in_flight',
        explanation: 'Client sends SYN (Synchronize Sequence Number). Initiates handshake to agree on initial sequence number (ISN = 1000).',
        technicalDetails: `TCP Flags: [SYN=1, ACK=0], Seq=${clientSeq}, Ack=0, Window=65535. State transitions: Client CLOSED -> SYN_SENT.`,
        layer: 'Transport',
      });

      if (config.targetedLostPackets?.includes(1)) {
        events.push({
          eventId: 2,
          timestamp: 200,
          type: 'timeout_expired',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          status: 'lost',
          explanation: 'SYN packet was dropped in transit. Client RTO (Retransmission Timeout) timer expires!',
          technicalDetails: 'Client waits for SYN-ACK. On timeout, client retransmits SYN with backoff timer.',
          layer: 'Transport',
        });
        events.push({
          eventId: 3,
          timestamp: 250,
          type: 'retransmission',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: clientSeq,
          status: 'delivered',
          explanation: 'Client retransmits SYN segment. Retransmission succeeds!',
          layer: 'Transport',
        });
      }

      // Step 2: SYN-ACK
      const isSynAckLost = config.targetedLostAcks?.includes(1);
      events.push({
        eventId: events.length + 1,
        timestamp: 120,
        type: isSynAckLost ? 'ack_lost' : 'packet_received',
        protocol: 'TCP',
        source: 'server',
        destination: 'client',
        sequenceNumber: serverSeq,
        ackNumber: clientSeq + 1,
        status: isSynAckLost ? 'lost' : 'delivered',
        explanation: isSynAckLost 
          ? 'Server sends SYN-ACK, but it is dropped by router queue overflow!' 
          : 'Server responds with SYN-ACK: confirms receipt of client ISN (Ack=1001) and presents its own ISN (Seq=5000).',
        technicalDetails: `TCP Flags: [SYN=1, ACK=1], Seq=${serverSeq}, Ack=${clientSeq + 1}. Server state: LISTEN -> SYN_RCVD.`,
        layer: 'Transport',
      });

      if (!isSynAckLost) {
        // Step 3: ACK
        events.push({
          eventId: events.length + 1,
          timestamp: 240,
          type: 'ack_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: clientSeq + 1,
          ackNumber: serverSeq + 1,
          status: 'delivered',
          explanation: 'Client sends final ACK acknowledging server sequence number (Ack=5001). Handshake complete!',
          technicalDetails: `TCP Flags: [ACK=1], Seq=${clientSeq + 1}, Ack=${serverSeq + 1}. Both endpoints are now ESTABLISHED.`,
          layer: 'Transport',
        });

        events.push({
          eventId: events.length + 1,
          timestamp: 300,
          type: 'connection_established',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          status: 'delivered',
          explanation: 'Full-duplex reliable TCP stream is ready for Application Data transmission (HTTP/HTTPS/SSH).',
          technicalDetails: 'Sockets bound on both sides. Sender and receiver sliding windows initialized.',
          layer: 'Transport',
        });
      }

      return events;
    },
  },

  'tcp-sliding-window': {
    id: 'tcp-sliding-window',
    name: 'TCP Sliding Window Flow Control',
    description: 'Visualizes sender and receiver windows, in-flight segments without waiting for individual ACKs, and window slide on cumulative acknowledgment.',
    protocol: 'TCP',
    category: 'TCP',
    defaultConfig: {
      windowSize: 4,
      segmentCount: 8,
      rtt: 120,
    },
    generateEvents: (config) => {
      const events: SimulationEvent[] = [];
      const win = config.windowSize || 4;
      const count = config.segmentCount || 8;

      let time = 0;
      // Phase 1: Sender sends initial window of segments
      for (let i = 1; i <= Math.min(win, count); i++) {
        events.push({
          eventId: events.length + 1,
          timestamp: time,
          type: 'packet_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 1000 + (i - 1) * 100,
          status: 'in_flight',
          explanation: `Sender transmits Segment #${i} (Seq ${1000 + (i - 1) * 100}) within current sending window [1..${win}].`,
          technicalDetails: `Window capacity: ${win} segments. Data in flight: ${i}/${win}. Can transmit without waiting for ACK.`,
          layer: 'Transport',
        });
        time += 25;
      }

      // Phase 2: Receiver receives and ACKs
      for (let i = 1; i <= Math.min(win, count); i++) {
        time += 50;
        events.push({
          eventId: events.length + 1,
          timestamp: time,
          type: 'ack_sent',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          ackNumber: 1000 + i * 100,
          status: 'delivered',
          explanation: `Receiver delivers Segment #${i} to app buffer and returns cumulative ACK ${1000 + i * 100}.`,
          technicalDetails: `Expected next sequence: ${1000 + i * 100}. Sender window slides forward by 1 segment.`,
          layer: 'Transport',
        });

        // Sliding window: Sender transmits next segment if available
        const nextSegment = win + i;
        if (nextSegment <= count) {
          time += 20;
          events.push({
            eventId: events.length + 1,
            timestamp: time,
            type: 'packet_sent',
            protocol: 'TCP',
            source: 'client',
            destination: 'server',
            sequenceNumber: 1000 + (nextSegment - 1) * 100,
            status: 'in_flight',
            explanation: `Window advanced! Sender transmits Segment #${nextSegment} into newly opened window slot.`,
            technicalDetails: `Window now covers [${i + 1}..${nextSegment}]. Flow control prevents receiver buffer overrun.`,
            layer: 'Transport',
          });
        }
      }

      return events;
    },
  },

  'tcp-ack-loss': {
    id: 'tcp-ack-loss',
    name: 'ACK Loss and Duplicate Detection',
    description: 'Data segment reaches server successfully, but the return ACK is lost in transit. Sender times out, retransmits, and receiver detects duplicate data.',
    protocol: 'TCP',
    category: 'TCP',
    defaultConfig: {
      windowSize: 2,
      rtt: 100,
    },
    generateEvents: () => {
      return [
        {
          eventId: 1,
          timestamp: 0,
          type: 'packet_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 2000,
          status: 'in_flight',
          explanation: 'Sender transmits Data Segment #1 (Seq 2000, 100 bytes payload). Starts RTO timer (200ms).',
          technicalDetails: 'Sender state: Unacknowledged segment in flight. Timer T1 running.',
          layer: 'Transport',
        },
        {
          eventId: 2,
          timestamp: 80,
          type: 'packet_received',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          sequenceNumber: 2000,
          status: 'delivered',
          explanation: 'Receiver safely buffers Segment #1 and prepares ACK 2100.',
          technicalDetails: 'Receiver updates expected sequence to 2100. Pushes payload to application layer.',
          layer: 'Transport',
        },
        {
          eventId: 3,
          timestamp: 110,
          type: 'ack_lost',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          ackNumber: 2100,
          status: 'lost',
          explanation: 'CRITICAL: The return ACK 2100 is dropped due to network link fault / queue drop!',
          technicalDetails: 'Packet lost in transit. Sender NEVER receives this ACK. Notice: The data arrived safely, but sender cannot know this!',
          layer: 'Transport',
        },
        {
          eventId: 4,
          timestamp: 220,
          type: 'timeout_expired',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 2000,
          status: 'lost',
          explanation: 'Sender RTO timer expires! Sender concludes Segment #1 was not received.',
          technicalDetails: 'TCP assumes packet loss. Doubles RTO timer (Karn’s Algorithm / Exponential Backoff).',
          layer: 'Transport',
        },
        {
          eventId: 5,
          timestamp: 260,
          type: 'retransmission',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 2000,
          status: 'retransmitted',
          explanation: 'Sender retransmits Segment #1 (Seq 2000).',
          technicalDetails: 'Same sequence number 2000 allows receiver to match this against previously received data.',
          layer: 'Transport',
        },
        {
          eventId: 6,
          timestamp: 340,
          type: 'packet_received',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          sequenceNumber: 2000,
          status: 'delivered',
          explanation: 'Receiver receives retransmission and detects DUPLICATE data! Discards payload from app stream to prevent corruption.',
          technicalDetails: 'Receiver recognizes Seq 2000 < expected 2100. Immediately resends ACK 2100 so sender can clear its buffer.',
          layer: 'Transport',
        },
        {
          eventId: 7,
          timestamp: 400,
          type: 'ack_sent',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          ackNumber: 2100,
          status: 'delivered',
          explanation: 'Duplicate ACK 2100 successfully reaches the sender. Sender cancels timer and advances window!',
          technicalDetails: 'Handled gracefully without application corruption. Both sides synchronized.',
          layer: 'Transport',
        },
      ];
    },
  },

  'tcp-fast-retransmit': {
    id: 'tcp-fast-retransmit',
    name: 'Duplicate ACK & Fast Retransmit',
    description: 'When Segment #2 is lost but Segments #3, #4, and #5 arrive out of order, receiver generates 3 duplicate ACKs, triggering fast retransmit before timeout.',
    protocol: 'TCP',
    category: 'TCP',
    defaultConfig: {
      windowSize: 5,
    },
    generateEvents: () => {
      return [
        {
          eventId: 1,
          timestamp: 0,
          type: 'packet_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 100,
          status: 'delivered',
          explanation: 'Sender transmits Segment #1 (Seq 100). Successfully delivered.',
          layer: 'Transport',
        },
        {
          eventId: 2,
          timestamp: 20,
          type: 'packet_lost',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 200,
          status: 'lost',
          explanation: 'Sender transmits Segment #2 (Seq 200) - PACKET IS DROPPED in router queue!',
          layer: 'Transport',
        },
        {
          eventId: 3,
          timestamp: 40,
          type: 'packet_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 300,
          status: 'in_flight',
          explanation: 'Sender transmits Segment #3 (Seq 300).',
          layer: 'Transport',
        },
        {
          eventId: 4,
          timestamp: 60,
          type: 'packet_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 400,
          status: 'in_flight',
          explanation: 'Sender transmits Segment #4 (Seq 400).',
          layer: 'Transport',
        },
        {
          eventId: 5,
          timestamp: 80,
          type: 'packet_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 500,
          status: 'in_flight',
          explanation: 'Sender transmits Segment #5 (Seq 500).',
          layer: 'Transport',
        },
        {
          eventId: 6,
          timestamp: 120,
          type: 'duplicate_ack',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          ackNumber: 200,
          status: 'duplicate_ack',
          explanation: 'Segment #3 arrives out of order! Receiver buffers it, but repeats ACK 200 (Duplicate ACK #1).',
          layer: 'Transport',
        },
        {
          eventId: 7,
          timestamp: 150,
          type: 'duplicate_ack',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          ackNumber: 200,
          status: 'duplicate_ack',
          explanation: 'Segment #4 arrives out of order! Receiver repeats ACK 200 (Duplicate ACK #2).',
          layer: 'Transport',
        },
        {
          eventId: 8,
          timestamp: 180,
          type: 'duplicate_ack',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          ackNumber: 200,
          status: 'duplicate_ack',
          explanation: 'Segment #5 arrives out of order! Receiver repeats ACK 200 (Duplicate ACK #3 - THRESHOLD MET!).',
          technicalDetails: 'TCP Fast Retransmit rule: Receiving 3 duplicate ACKs signifies a missing segment rather than reordering.',
          layer: 'Transport',
        },
        {
          eventId: 9,
          timestamp: 210,
          type: 'retransmission',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 200,
          status: 'retransmitted',
          explanation: 'FAST RETRANSMIT TRIGGERED! Sender immediately resends missing Segment #2 without waiting for RTO timeout!',
          technicalDetails: 'Saves hundreds of milliseconds of idle waiting. Enter Fast Recovery phase.',
          layer: 'Transport',
        },
        {
          eventId: 10,
          timestamp: 300,
          type: 'ack_sent',
          protocol: 'TCP',
          source: 'server',
          destination: 'client',
          ackNumber: 600,
          status: 'delivered',
          explanation: 'Cumulative ACK 600 received! The gap was filled, so receiver acknowledges all buffered packets through Seq 500.',
          layer: 'Transport',
        },
      ];
    },
  },

  'tcp-congestion-control': {
    id: 'tcp-congestion-control',
    name: 'TCP Congestion Control (Tahoe & Reno)',
    description: 'Visualizes Slow Start exponential growth, Congestion Avoidance additive increase (AIMD), SSTHRESH reduction upon loss, and Multiplicative Decrease.',
    protocol: 'TCP',
    category: 'Congestion',
    defaultConfig: {
      cwnd: 1,
      ssthresh: 8,
    },
    generateEvents: () => {
      const events: SimulationEvent[] = [];
      const cwndSequence = [
        { rtt: 1, cwnd: 1, state: 'Slow Start', note: 'Initial cwnd = 1 MSS. Exponential growth phase begins.' },
        { rtt: 2, cwnd: 2, state: 'Slow Start', note: '1 ACK received -> cwnd doubled to 2 MSS.' },
        { rtt: 3, cwnd: 4, state: 'Slow Start', note: '2 ACKs received -> cwnd doubled to 4 MSS.' },
        { rtt: 4, cwnd: 8, state: 'Threshold Reached', note: 'cwnd reached ssthresh (8 MSS)! Transitioning to Congestion Avoidance (linear growth).' },
        { rtt: 5, cwnd: 9, state: 'Congestion Avoidance', note: 'Additive increase: +1 MSS per RTT (AIMD).' },
        { rtt: 6, cwnd: 10, state: 'Congestion Avoidance', note: 'Additive increase: cwnd is now 10 MSS.' },
        { rtt: 7, cwnd: 11, state: 'Congestion Avoidance', note: 'Additive increase: cwnd is now 11 MSS. Link approaching bottleneck queue capacity.' },
        { rtt: 8, cwnd: 12, state: 'Packet Drop Occurred', note: 'Router queue overflow! Segment dropped. Loss detected by 3 Dup ACKs.' },
        { rtt: 9, cwnd: 6, state: 'Fast Recovery (Reno)', note: 'Multiplicative decrease: ssthresh set to cwnd/2 = 6 MSS. cwnd set to 6 MSS.' },
        { rtt: 10, cwnd: 7, state: 'Congestion Avoidance', note: 'Resuming linear increase from new threshold.' },
      ];

      cwndSequence.forEach((item, index) => {
        events.push({
          eventId: index + 1,
          timestamp: index * 100,
          type: item.state.includes('Drop') ? 'packet_lost' : 'packet_sent',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          sequenceNumber: 1000 + index * 100,
          windowSize: item.cwnd,
          status: item.state.includes('Drop') ? 'lost' : 'delivered',
          explanation: `[RTT ${item.rtt}] ${item.state}: CWND = ${item.cwnd} MSS. ${item.note}`,
          technicalDetails: `CWND: ${item.cwnd} MSS, SSTHRESH: ${item.rtt >= 9 ? 6 : 8} MSS. Mechanism: ${item.state}.`,
          layer: 'Transport',
        });
      });

      return events;
    },
  },

  'packet-encapsulation': {
    id: 'packet-encapsulation',
    name: 'Layer-by-Layer Encapsulation & Decapsulation',
    description: 'Follows an HTTP GET request from Application layer down to Physical signals on sender, through routers, and up through decapsulation on server.',
    protocol: 'HTTP',
    category: 'Encapsulation',
    defaultConfig: {},
    generateEvents: () => {
      return [
        {
          eventId: 1,
          timestamp: 0,
          type: 'application_data_created',
          protocol: 'HTTP',
          source: 'client',
          destination: 'server',
          status: 'in_flight',
          explanation: 'Application Layer: User enters URL in browser. HTTP GET /index.html request payload is generated.',
          technicalDetails: 'Data payload: "GET /index.html HTTP/1.1\\r\\nHost: api.netviz.internal\\r\\n\\r\\n" (56 bytes)',
          layer: 'Application',
        },
        {
          eventId: 2,
          timestamp: 50,
          type: 'header_added',
          protocol: 'TCP',
          source: 'client',
          destination: 'server',
          status: 'in_flight',
          explanation: 'Transport Layer: TCP encapsulates HTTP data into a Segment. Adds Source Port 54321 and Destination Port 80.',
          technicalDetails: 'Headers added: Src Port: 54321, Dst Port: 80, Seq: 1001, Ack: 501, Flags: PSH,ACK, Window: 64240. Total size: 76 bytes.',
          layer: 'Transport',
        },
        {
          eventId: 3,
          timestamp: 100,
          type: 'header_added',
          protocol: 'IPv4',
          source: 'client',
          destination: 'server',
          status: 'in_flight',
          explanation: 'Network Layer: IP encapsulates TCP segment into a Packet. Adds Source IP 192.168.1.10 and Destination IP 10.0.0.50.',
          technicalDetails: 'Headers added: IPv4 Header (20 bytes), TTL: 64, Protocol: 6 (TCP). Total size: 96 bytes.',
          layer: 'Network',
        },
        {
          eventId: 4,
          timestamp: 150,
          type: 'frame_created',
          protocol: 'Ethernet',
          source: 'client',
          destination: 'server',
          status: 'in_flight',
          explanation: 'Data Link Layer: Ethernet encapsulates IP packet into a Frame. Adds Source MAC, Next-Hop MAC, and CRC Checksum Trailer.',
          technicalDetails: 'Headers added: Preamble, Dst MAC: 00:1A:2B:3C:4D:5E (Default Gateway), Src MAC: AA:BB:CC:DD:EE:01, EtherType: 0x0800, FCS: CRC-32 (18 bytes).',
          layer: 'Data Link',
        },
        {
          eventId: 5,
          timestamp: 200,
          type: 'packet_sent',
          protocol: 'Ethernet',
          source: 'client',
          destination: 'server',
          status: 'in_flight',
          explanation: 'Physical Layer: NIC converts digital frame bytes into electromagnetic pulses / optical bits and transmits across the wire.',
          technicalDetails: 'Encoding: Manchester/NRZ physical signaling. Raw bit stream traveling at ~200,000 km/s in copper.',
          layer: 'Physical',
        },
        {
          eventId: 6,
          timestamp: 300,
          type: 'route_selected',
          protocol: 'IPv4',
          source: 'client',
          destination: 'server',
          status: 'in_flight',
          explanation: 'Router Hop: Router receives frame, checks CRC, strips old Ethernet header, decrements TTL (64 -> 63), and builds NEW Ethernet frame for next link!',
          technicalDetails: 'Key Concept: IP addresses remain end-to-end, but MAC addresses change hop-by-hop at every router!',
          layer: 'Network',
        },
        {
          eventId: 7,
          timestamp: 400,
          type: 'header_removed',
          protocol: 'Ethernet',
          source: 'server',
          destination: 'server',
          status: 'delivered',
          explanation: 'Server Data Link: Destination NIC validates CRC-32 trailer, strips Ethernet header, passes payload up to IP layer.',
          layer: 'Data Link',
        },
        {
          eventId: 8,
          timestamp: 450,
          type: 'header_removed',
          protocol: 'IPv4',
          source: 'server',
          destination: 'server',
          status: 'delivered',
          explanation: 'Server Network: IP layer validates Destination IP matches host, strips IP header, routes to TCP protocol handler (Protocol 6).',
          layer: 'Network',
        },
        {
          eventId: 9,
          timestamp: 500,
          type: 'header_removed',
          protocol: 'TCP',
          source: 'server',
          destination: 'server',
          status: 'delivered',
          explanation: 'Server Transport: TCP verifies checksum, checks sequence order, strips TCP header, routes payload to Port 80 socket listener.',
          layer: 'Transport',
        },
        {
          eventId: 10,
          timestamp: 550,
          type: 'packet_received',
          protocol: 'HTTP',
          source: 'server',
          destination: 'server',
          status: 'delivered',
          explanation: 'Server Application: Web server (Nginx/Apache) receives pure HTTP GET /index.html and begins rendering response!',
          layer: 'Application',
        },
      ];
    },
  },
};
