export interface AnalyzedPacket {
  no: number;
  time: number; // in seconds from start
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'DNS' | 'HTTP' | 'ARP' | 'ICMP';
  length: number;
  info: string;
  isRetransmission?: boolean;
  isSyn?: boolean;
  isAck?: boolean;
  isFin?: boolean;
  stream: number;
  frame: {
    frameNumber: number;
    frameLength: number;
    captureLength: number;
    protocolsInFrame: string;
  };
  ethernet: {
    sourceMac: string;
    destinationMac: string;
    type: string;
  };
  ip?: {
    version: number;
    headerLength: number;
    differentiatedServices: string;
    totalLength: number;
    identification: string;
    flags: string;
    ttl: number;
    protocol: string;
    checksum: string;
    sourceIp: string;
    destinationIp: string;
  };
  tcp?: {
    sourcePort: number;
    destinationPort: number;
    sequenceNumber: number;
    rawSequenceNumber: number;
    acknowledgmentNumber: number;
    headerLength: number;
    flags: {
      syn: number;
      ack: number;
      fin: number;
      rst: number;
      psh: number;
      urg: number;
      raw: string;
    };
    windowSize: number;
    checksum: string;
    urgentPointer: number;
    payloadLength: number;
  };
  udp?: {
    sourcePort: number;
    destinationPort: number;
    length: number;
    checksum: string;
  };
  applicationData?: {
    protocol: string;
    summary: string;
    lines: string[];
  };
  hexDump: string;
}

export const SAMPLE_PACKET_TRACES: AnalyzedPacket[] = [
  {
    no: 1,
    time: 0.000000,
    source: '192.168.1.10',
    destination: '93.184.216.34',
    protocol: 'TCP',
    length: 74,
    info: '54321 → 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 SACK_PERM=1',
    isSyn: true,
    stream: 0,
    frame: {
      frameNumber: 1,
      frameLength: 74,
      captureLength: 74,
      protocolsInFrame: 'eth:ethertype:ip:tcp',
    },
    ethernet: {
      sourceMac: 'AA:BB:CC:DD:EE:01',
      destinationMac: '00:1A:2B:3C:4D:5E',
      type: 'IPv4 (0x0800)',
    },
    ip: {
      version: 4,
      headerLength: 20,
      differentiatedServices: '0x00 (Default)',
      totalLength: 60,
      identification: '0x4f12 (20242)',
      flags: '0x02, Don\'t fragment',
      ttl: 64,
      protocol: 'TCP (6)',
      checksum: '0xa142 [correct]',
      sourceIp: '192.168.1.10',
      destinationIp: '93.184.216.34',
    },
    tcp: {
      sourcePort: 54321,
      destinationPort: 80,
      sequenceNumber: 0,
      rawSequenceNumber: 3829148201,
      acknowledgmentNumber: 0,
      headerLength: 40,
      flags: {
        syn: 1,
        ack: 0,
        fin: 0,
        rst: 0,
        psh: 0,
        urg: 0,
        raw: '0x002 (SYN)',
      },
      windowSize: 64240,
      checksum: '0x32cf',
      urgentPointer: 0,
      payloadLength: 0,
    },
    hexDump: '00 1a 2b 3c 4d 5e aa bb cc dd ee 01 08 00 45 00\n00 3c 4f 12 40 00 40 06 a1 42 c0 a8 01 0a 5d b8\nd8 22 d4 31 00 50 e4 3b 1f 09 00 00 00 00 a0 02\nfa f0 32 cf 00 00 02 04 05 b4 04 02 08 0a 34 f1',
  },
  {
    no: 2,
    time: 0.042103,
    source: '93.184.216.34',
    destination: '192.168.1.10',
    protocol: 'TCP',
    length: 74,
    info: '80 → 54321 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=1460',
    isSyn: true,
    isAck: true,
    stream: 0,
    frame: {
      frameNumber: 2,
      frameLength: 74,
      captureLength: 74,
      protocolsInFrame: 'eth:ethertype:ip:tcp',
    },
    ethernet: {
      sourceMac: '00:1A:2B:3C:4D:5E',
      destinationMac: 'AA:BB:CC:DD:EE:01',
      type: 'IPv4 (0x0800)',
    },
    ip: {
      version: 4,
      headerLength: 20,
      differentiatedServices: '0x00',
      totalLength: 60,
      identification: '0x0000',
      flags: '0x02, Don\'t fragment',
      ttl: 54,
      protocol: 'TCP (6)',
      checksum: '0x8b31 [correct]',
      sourceIp: '93.184.216.34',
      destinationIp: '192.168.1.10',
    },
    tcp: {
      sourcePort: 80,
      destinationPort: 54321,
      sequenceNumber: 0,
      rawSequenceNumber: 1948201948,
      acknowledgmentNumber: 1,
      headerLength: 40,
      flags: {
        syn: 1,
        ack: 1,
        fin: 0,
        rst: 0,
        psh: 0,
        urg: 0,
        raw: '0x012 (SYN, ACK)',
      },
      windowSize: 65535,
      checksum: '0x811a',
      urgentPointer: 0,
      payloadLength: 0,
    },
    hexDump: 'aa bb cc dd ee 01 00 1a 2b 3c 4d 5e 08 00 45 00\n00 3c 00 00 40 00 36 06 8b 31 5d b8 d8 22 c0 a8\n01 0a 00 50 d4 31 74 24 15 dc e4 3b 1f 0a a0 12\nff ff 81 1a 00 00 02 04 05 b4 01 01 04 02 01 03',
  },
  {
    no: 3,
    time: 0.042215,
    source: '192.168.1.10',
    destination: '93.184.216.34',
    protocol: 'TCP',
    length: 54,
    info: '54321 → 80 [ACK] Seq=1 Ack=1 Win=64240 Len=0',
    isAck: true,
    stream: 0,
    frame: {
      frameNumber: 3,
      frameLength: 54,
      captureLength: 54,
      protocolsInFrame: 'eth:ethertype:ip:tcp',
    },
    ethernet: {
      sourceMac: 'AA:BB:CC:DD:EE:01',
      destinationMac: '00:1A:2B:3C:4D:5E',
      type: 'IPv4 (0x0800)',
    },
    ip: {
      version: 4,
      headerLength: 20,
      differentiatedServices: '0x00',
      totalLength: 40,
      identification: '0x4f13',
      flags: '0x02, Don\'t fragment',
      ttl: 64,
      protocol: 'TCP (6)',
      checksum: '0xa155',
      sourceIp: '192.168.1.10',
      destinationIp: '93.184.216.34',
    },
    tcp: {
      sourcePort: 54321,
      destinationPort: 80,
      sequenceNumber: 1,
      rawSequenceNumber: 3829148202,
      acknowledgmentNumber: 1,
      headerLength: 20,
      flags: {
        syn: 0,
        ack: 1,
        fin: 0,
        rst: 0,
        psh: 0,
        urg: 0,
        raw: '0x010 (ACK)',
      },
      windowSize: 64240,
      checksum: '0x12a9',
      urgentPointer: 0,
      payloadLength: 0,
    },
    hexDump: '00 1a 2b 3c 4d 5e aa bb cc dd ee 01 08 00 45 00\n00 28 4f 13 40 00 40 06 a1 55 c0 a8 01 0a 5d b8\nd8 22 d4 31 00 50 e4 3b 1f 0a 74 24 15 dd 50 10\nfa f0 12 a9 00 00',
  },
  {
    no: 4,
    time: 0.043512,
    source: '192.168.1.10',
    destination: '93.184.216.34',
    protocol: 'HTTP',
    length: 128,
    info: 'GET /index.html HTTP/1.1',
    stream: 0,
    frame: {
      frameNumber: 4,
      frameLength: 128,
      captureLength: 128,
      protocolsInFrame: 'eth:ethertype:ip:tcp:http',
    },
    ethernet: {
      sourceMac: 'AA:BB:CC:DD:EE:01',
      destinationMac: '00:1A:2B:3C:4D:5E',
      type: 'IPv4 (0x0800)',
    },
    ip: {
      version: 4,
      headerLength: 20,
      differentiatedServices: '0x00',
      totalLength: 114,
      identification: '0x4f14',
      flags: '0x02, Don\'t fragment',
      ttl: 64,
      protocol: 'TCP (6)',
      checksum: '0xa10b',
      sourceIp: '192.168.1.10',
      destinationIp: '93.184.216.34',
    },
    tcp: {
      sourcePort: 54321,
      destinationPort: 80,
      sequenceNumber: 1,
      rawSequenceNumber: 3829148202,
      acknowledgmentNumber: 1,
      headerLength: 20,
      flags: {
        syn: 0,
        ack: 1,
        fin: 0,
        rst: 0,
        psh: 1,
        urg: 0,
        raw: '0x018 (PSH, ACK)',
      },
      windowSize: 64240,
      checksum: '0x42ff',
      urgentPointer: 0,
      payloadLength: 74,
    },
    applicationData: {
      protocol: 'Hypertext Transfer Protocol',
      summary: 'GET /index.html HTTP/1.1\\r\\nHost: example.com\\r\\nUser-Agent: NetViz/1.0\\r\\nAccept: */*\\r\\n\\r\\n',
      lines: [
        'Request Method: GET',
        'Request URI: /index.html',
        'Request Version: HTTP/1.1',
        'Host: example.com',
        'User-Agent: NetViz-AI/1.0',
        'Accept: text/html,application/xhtml+xml',
      ],
    },
    hexDump: '47 45 54 20 2f 69 6e 64 65 78 2e 68 74 6d 6c 20\n48 54 54 50 2f 31 2e 31 0d 0a 48 6f 73 74 3a 20\n65 78 61 6d 70 6c 65 2e 63 6f 6d 0d 0a 55 73 65\n72 2d 41 67 65 6e 74 3a 20 4e 65 74 56 69 7a 0d',
  },
  {
    no: 5,
    time: 0.120500,
    source: '192.168.1.10',
    destination: '93.184.216.34',
    protocol: 'TCP',
    length: 128,
    info: '[TCP Retransmission] 54321 → 80 [PSH, ACK] Seq=1 Len=74',
    isRetransmission: true,
    isAck: true,
    stream: 0,
    frame: {
      frameNumber: 5,
      frameLength: 128,
      captureLength: 128,
      protocolsInFrame: 'eth:ethertype:ip:tcp:http',
    },
    ethernet: {
      sourceMac: 'AA:BB:CC:DD:EE:01',
      destinationMac: '00:1A:2B:3C:4D:5E',
      type: 'IPv4 (0x0800)',
    },
    ip: {
      version: 4,
      headerLength: 20,
      differentiatedServices: '0x00',
      totalLength: 114,
      identification: '0x4f15',
      flags: '0x02, Don\'t fragment',
      ttl: 64,
      protocol: 'TCP (6)',
      checksum: '0xa10a',
      sourceIp: '192.168.1.10',
      destinationIp: '93.184.216.34',
    },
    tcp: {
      sourcePort: 54321,
      destinationPort: 80,
      sequenceNumber: 1,
      rawSequenceNumber: 3829148202,
      acknowledgmentNumber: 1,
      headerLength: 20,
      flags: {
        syn: 0,
        ack: 1,
        fin: 0,
        rst: 0,
        psh: 1,
        urg: 0,
        raw: '0x018 (PSH, ACK)',
      },
      windowSize: 64240,
      checksum: '0x42ff',
      urgentPointer: 0,
      payloadLength: 74,
    },
    hexDump: '47 45 54 20 2f 69 6e 64 65 78 2e 68 74 6d 6c 20\n48 54 54 50 2f 31 2e 31 0d 0a 48 6f 73 74 3a 20\n65 78 61 6d 70 6c 65 2e 63 6f 6d 0d 0a 55 73 65',
  },
  {
    no: 6,
    time: 0.162300,
    source: '93.184.216.34',
    destination: '192.168.1.10',
    protocol: 'HTTP',
    length: 290,
    info: 'HTTP/1.1 200 OK (text/html)',
    stream: 0,
    frame: {
      frameNumber: 6,
      frameLength: 290,
      captureLength: 290,
      protocolsInFrame: 'eth:ethertype:ip:tcp:http',
    },
    ethernet: {
      sourceMac: '00:1A:2B:3C:4D:5E',
      destinationMac: 'AA:BB:CC:DD:EE:01',
      type: 'IPv4 (0x0800)',
    },
    ip: {
      version: 4,
      headerLength: 20,
      differentiatedServices: '0x00',
      totalLength: 276,
      identification: '0x10a2',
      flags: '0x02, Don\'t fragment',
      ttl: 54,
      protocol: 'TCP (6)',
      checksum: '0x321e',
      sourceIp: '93.184.216.34',
      destinationIp: '192.168.1.10',
    },
    tcp: {
      sourcePort: 80,
      destinationPort: 54321,
      sequenceNumber: 1,
      rawSequenceNumber: 1948201949,
      acknowledgmentNumber: 75,
      headerLength: 20,
      flags: {
        syn: 0,
        ack: 1,
        fin: 0,
        rst: 0,
        psh: 1,
        urg: 0,
        raw: '0x018 (PSH, ACK)',
      },
      windowSize: 65535,
      checksum: '0x992b',
      urgentPointer: 0,
      payloadLength: 236,
    },
    applicationData: {
      protocol: 'Hypertext Transfer Protocol',
      summary: 'HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\nContent-Length: 125\\r\\n\\r\\n<!DOCTYPE html><html><body><h1>NetViz AI Works!</h1></body></html>',
      lines: [
        'Response Version: HTTP/1.1',
        'Status Code: 200 OK',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Length: 125',
        'Server: ECS (dcb/7F3B)',
      ],
    },
    hexDump: '48 54 54 50 2f 31 2e 31 20 32 30 30 20 4f 4b 0d\n0a 43 6f 6e 74 65 6e 74 2d 54 79 70 65 3a 20 74\n65 78 74 2f 68 74 6d 6c 0d 0a 43 6f 6e 74 65 6e\n74 2d 4c 65 6e 67 74 68 3a 20 31 32 35 0d 0a 0d',
  },
];
