import { SimulationEvent, SimulationPacket, SimulationConfig } from '../simulation/types';

export interface TutorContext {
  labId?: string;
  topicId?: string;
  currentStep?: number;
  topology?: string[];
  config?: Partial<SimulationConfig>;
  events?: SimulationEvent[];
  selectedPacket?: SimulationPacket | null;
  currentEvent?: SimulationEvent | null;
  guidanceLevel: 'hint' | 'explanation' | 'walkthrough';
}

export interface TutorResponse {
  directAnswer: string;
  simpleExplanation: string;
  visualExplanation: string;
  technicalExplanation: string;
  currentEventContext?: string;
  deeperExplanation?: string;
  relatedLabOrPractice?: {
    title: string;
    href: string;
  };
}

export function generateTutorAnswer(question: string, context: TutorContext): TutorResponse {
  const q = question.toLowerCase();
  const level = context.guidanceLevel || 'explanation';
  const currEvt = context.currentEvent;
  const selPkt = context.selectedPacket;

  // Build current event reference if available
  let eventContextText = '';
  if (currEvt) {
    eventContextText = `Current Event #${currEvt.eventId} (${currEvt.type}): ${currEvt.explanation}`;
  } else if (selPkt) {
    eventContextText = `Selected Packet ${selPkt.protocol} (Seq: ${selPkt.sequenceNumber ?? 'N/A'}, Ack: ${selPkt.ackNumber ?? 'N/A'}, Status: ${selPkt.status})`;
  }

  // Question Category 1: Window size questions
  if (q.includes('window size') && (q.includes('small') || q.includes('large') || q.includes('limit'))) {
    if (level === 'hint') {
      return {
        directAnswer: 'The TCP window size bounds the unacknowledged bytes that can travel in flight before the sender must halt.',
        simpleExplanation: 'Small window = waiting frequently for ACKs; large window = keeping the network pipe full.',
        visualExplanation: 'Look at the in-flight packet counter. When it reaches window size, the sender stops transmitting.',
        technicalExplanation: 'Throughput is bounded by min(rwnd, cwnd) / RTT. A small window starves the bandwidth-delay product.',
        currentEventContext: eventContextText,
        relatedLabOrPractice: { title: 'Lab 4: TCP Sliding Window', href: '/labs/lab-tcp-sliding-window' },
      };
    }
    return {
      directAnswer: 'The window size limits how many packets can be sent without waiting for an acknowledgment.',
      simpleExplanation: 'If window size is 1, sender behaves like Stop-and-Wait (send 1, wait for ACK). If window size is 8, sender transmits 8 segments into the pipeline concurrently.',
      visualExplanation: 'Notice on the timeline: with a small window, there are wide idle time gaps between packet bursts. With a properly sized window, segments flow continuously.',
      technicalExplanation: 'The Bandwidth-Delay Product (BDP = Bandwidth × RTT) represents the capacity of the link. If Window < BDP, link utilization drops below 100%. If Window > BDP, excess packets queue up in router buffers, increasing RTT jitter.',
      currentEventContext: eventContextText,
      deeperExplanation: 'Flow control (rwnd) prevents the sender from overwhelming the receiver socket buffer, while congestion control (cwnd) prevents overwhelming network routers.',
      relatedLabOrPractice: { title: 'Lab 4: TCP Sliding Window Flow Control', href: '/labs/lab-tcp-sliding-window' },
    };
  }

  // Question Category 2: ACK loss
  if (q.includes('ack') && (q.includes('loss') || q.includes('lost') || q.includes('duplicate'))) {
    return {
      directAnswer: 'When an ACK is lost, the data arrived safely, but the sender does not know this until its RTO timer expires and triggers a retransmission.',
      simpleExplanation: 'The receiver already got the data. The lost packet was only the receipt. So when the sender resends the same data, the receiver discards the duplicate bytes and repeats the ACK.',
      visualExplanation: 'In the simulation, see the red X on the reverse path from Server to Client. The Server had already turned green (delivered), but the Client timer rings red (timeout).',
      technicalExplanation: 'TCP sequence numbers allow the receiver to identify that Seq 2000 is < expected sequence 2100. It silently drops the payload to preserve stream integrity and emits a duplicate ACK.',
      currentEventContext: eventContextText,
      deeperExplanation: 'Cumulative ACKs in TCP also provide resilience: if ACK 100 is lost but ACK 200 arrives safely, the sender knows all bytes up to 200 were received, preventing redundant retransmissions.',
      relatedLabOrPractice: { title: 'Lab 3: ACK Loss and Retransmission', href: '/labs/lab-ack-loss' },
    };
  }

  // Question Category 3: Why packet retransmitted / Why TCP slows down
  if (q.includes('retransmit') || q.includes('slow down') || q.includes('timeout')) {
    return {
      directAnswer: 'Packets are retransmitted either because an RTO (Retransmission Timeout) expired or because 3 Duplicate ACKs triggered Fast Retransmit.',
      simpleExplanation: 'TCP treats any packet loss as a sign that network routers are overloaded, so it immediately cuts its speed in half to be polite and avoid a network crash.',
      visualExplanation: 'Observe the CWND line chart: whenever a retransmission event occurs, the green CWND graph plummets downward.',
      technicalExplanation: 'Multiplicative decrease cuts ssthresh = cwnd / 2. If loss was detected by timeout (Tahoe), cwnd resets to 1 MSS. If detected by 3 Dup ACKs (Reno), cwnd enters Fast Recovery at ssthresh.',
      currentEventContext: eventContextText,
      deeperExplanation: 'Jacobson’s algorithm dynamically calculates RTO based on smoothed RTT (SRTT) and RTT variation (RTTVAR) to avoid false timeouts on high-latency links.',
      relatedLabOrPractice: { title: 'Lab 4: TCP Congestion Control', href: '/labs/lab-congestion-control' },
    };
  }

  // Question Category 4: MAC vs IP address changes at router
  if (q.includes('mac') && (q.includes('ip') || q.includes('router') || q.includes('change'))) {
    return {
      directAnswer: 'IP addresses stay the same end-to-end; MAC addresses change at every single router hop.',
      simpleExplanation: 'The IP address is like the name and city on an envelope (where it ultimately goes). The MAC address is like the barcode on the truck carrying it on the current highway link.',
      visualExplanation: 'Look at the Packet Inspector when the packet hops from Client to Router, then from Router to Server. Source IP is always 192.168.1.10, but Source MAC updates from Client NIC to Router Outbound NIC.',
      technicalExplanation: 'Routers decapsulate Layer 2 Ethernet frames, inspect the Layer 3 destination IP, perform longest-prefix matching, decrement TTL, and construct a new Layer 2 frame with the next-hop MAC.',
      currentEventContext: eventContextText,
      relatedLabOrPractice: { title: 'Lab 1: Packet Encapsulation & Decapsulation', href: '/labs/lab-encapsulation' },
    };
  }

  // Question Category 5: DNS Resolution
  if (q.includes('dns') || q.includes('domain') || q.includes('root')) {
    return {
      directAnswer: 'DNS resolution translates human-readable hostnames (like example.com) into numerical IP addresses via a hierarchical lookup chain.',
      simpleExplanation: 'Your computer asks your local resolver, which asks the Root (.), which points to the TLD (.com), which points to the authoritative server who has the final IP.',
      visualExplanation: 'Notice how the resolver makes 3 distinct round trips before returning the answer to the client.',
      technicalExplanation: 'DNS uses UDP port 53. Responses carry a TTL (Time-To-Live) value in seconds indicating how long recursive resolvers are permitted to cache the answer.',
      currentEventContext: eventContextText,
      relatedLabOrPractice: { title: 'Lab 5: Recursive DNS Resolution', href: '/labs/lab-dns' },
    };
  }

  // Question Category 6: TCP vs UDP
  if (q.includes('udp') || (q.includes('tcp') && q.includes('difference'))) {
    return {
      directAnswer: 'TCP is connection-oriented, reliable, and ordered (with handshakes, ACKs, retransmissions), while UDP is connectionless, lightweight, and best-effort with zero retransmission.',
      simpleExplanation: 'TCP is a registered courier letter requiring a signed receipt. UDP is shouting a message out a window—fast, simple, but you cannot guarantee it was heard.',
      visualExplanation: 'Compare the headers: TCP adds 20 bytes with sequence numbers and flags. UDP adds only 8 bytes without state tracking.',
      technicalExplanation: 'TCP guarantees reliability via sliding window ARQ, flow control, and AIMD congestion control. UDP provides raw multiplexing with minimal 8-byte header overhead and no head-of-line blocking.',
      currentEventContext: eventContextText,
      relatedLabOrPractice: { title: 'Compare Mode: TCP vs UDP', href: '/simulator' },
    };
  }

  // General fallback
  return {
    directAnswer: `In this simulation, ${currEvt ? currEvt.explanation : 'packets are flowing through the configured network topology'}.`,
    simpleExplanation: 'Each protocol at each layer performs a specific job: encapsulation adds addressing headers, intermediate devices switch and route, and destination decapsulates.',
    visualExplanation: `You are currently viewing ${context.topicId || 'Computer Networks'} simulation. Step forward to observe state transitions.`,
    technicalExplanation: 'Computer networking adheres to strict RFC protocol state machines where packets are processed deterministically according to header flags, sequence numbers, and routing tables.',
    currentEventContext: eventContextText,
    relatedLabOrPractice: { title: 'Explore All Guided Labs', href: '/labs' },
  };
}
