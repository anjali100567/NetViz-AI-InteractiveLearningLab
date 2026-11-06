export interface UniversityLab {
  id: string;
  expNumber: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  layer: 'Physical' | 'Data Link' | 'Network' | 'Transport' | 'Application';
  aim: string;
  theoryEasy: string;
  theoryTechnical: string;
  requirements: string[];
  procedure: string[];
  topologyNodes: string[];
  algorithm: string[];
  workspaceType: 'crc' | 'bit-stuffing' | 'terminal' | 'sliding-window' | 'dijkstra' | 'subnetting' | 'socket' | 'generic';
  expectedOutput: string;
  vivaQuestions: {
    question: string;
    answer: string;
  }[];
  submissionChecklist: string[];
}

export const UNIVERSITY_LABS: Record<string, UniversityLab> = {
  'exp-crc': {
    id: 'exp-crc',
    expNumber: 4,
    title: 'Cyclic Redundancy Check (CRC) Error Detection',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Data Link',
    aim: 'To implement and demonstrate error detection using Cyclic Redundancy Check (CRC) with standard generator polynomials (CRC-12, CRC-16, CRC-CCITT) and verify receiver-side syndrome computation under bit errors.',
    theoryEasy: 'CRC acts like a mathematical remainder seal on a letter. The sender divides the data by a secret number and sticks the remainder at the end. The receiver divides the whole packet by that same secret number. If the remainder is 0, nothing was corrupted! If not zero, an error is detected.',
    theoryTechnical: 'CRC uses polynomial division over GF(2) (modulo-2 arithmetic using XOR operations without carries or borrows). Given data polynomial D(x) of length k and generator polynomial G(x) of degree r, the sender appends r zeros to D(x) and computes the remainder R(x) = (D(x) * x^r) mod G(x). The transmitted frame T(x) = (D(x) * x^r) + R(x) is divisible by G(x) with remainder 0 at the receiver.',
    requirements: ['Modulo-2 XOR Engine', 'Standard Generator Polynomials (CRC-CCITT: x^16 + x^12 + x^5 + 1)'],
    procedure: [
      'Enter the raw binary data bits (e.g. 11010011101100).',
      'Select a standard generator polynomial (CRC-CCITT: 10001000000100001).',
      'Compute the remainder via modulo-2 binary division.',
      'Append the CRC remainder bits to form the transmitted frame.',
      'Simulate transmission with or without introducing a bit flip.',
      'Verify that receiver division produces a zero syndrome for valid frames or a non-zero syndrome for corrupted frames.',
    ],
    topologyNodes: ['Sender NIC', 'Noisy Copper Cable', 'Receiver NIC'],
    algorithm: [
      'Append r zero bits to the data bit string, where r is the degree of generator polynomial G.',
      'Perform modulo-2 division of the augmented data string by G using bitwise XOR.',
      'When the division reaches the end of the data, the r-bit remainder is the CRC checksum.',
      'Append this remainder to the original data to create the transmitted frame.',
      'At the receiver, divide the received frame by G. If the remainder is 0, accept; else flag error.',
    ],
    workspaceType: 'crc',
    expectedOutput: 'Remainder = 0000 -> Checksum Valid. Frame Accepted without bit errors.',
    vivaQuestions: [
      {
        question: 'Why is CRC superior to a simple 1-bit parity check or checksum?',
        answer: 'A simple parity check only catches odd numbers of bit flips and fails completely on even-number bursts. CRC guarantees detection of all single-bit errors, all double-bit errors, all odd numbers of errors, and burst errors of length up to the generator polynomial degree r.',
      },
      {
        question: 'What mathematical operation replaces subtraction in modulo-2 arithmetic?',
        answer: 'Bitwise XOR (Exclusive OR) without carries or borrows.',
      },
    ],
    submissionChecklist: [
      'Input data bits and generator polynomial recorded',
      'Modulo-2 division calculation steps verified',
      'Transmitted codeword and remainder identified',
      'Receiver syndrome with injected bit error tested',
    ],
  },

  'exp-bit-stuffing': {
    id: 'exp-bit-stuffing',
    expNumber: 3,
    title: 'Character & Bit Stuffing in Data Link Framing',
    difficulty: 'Beginner',
    durationMinutes: 15,
    layer: 'Data Link',
    aim: 'To demonstrate transparent transmission over synchronous communication channels using Bit Stuffing (HDLC standard: 01111110 flag).',
    theoryEasy: 'Imagine sending a text where the word "END" tells the receiver to stop reading. What if your message naturally contains the word "END"? To prevent confusion, you insert an extra space or character so the receiver knows it is part of the message, not the stop flag!',
    theoryTechnical: 'In HDLC, frames begin and end with the 8-bit flag sequence 01111110 (0x7E). To ensure this delimiter never appears within the payload data (which would cause false premature frame termination), the sender hardware inserts a 0 bit immediately after every sequence of five consecutive 1s. The receiver automatically deletes any 0 that immediately follows five consecutive 1s.',
    requirements: ['Bit Stream Buffer', 'HDLC 01111110 Delimiter Detector'],
    procedure: [
      'Enter arbitrary binary payload data containing sequences of 1s (e.g. 011111101111110).',
      'Scan payload: whenever five consecutive 1s are encountered, stuff a 0 bit.',
      'Wrap with start flag (01111110) and end flag (01111110).',
      'Transmit and perform de-stuffing at the receiver to reconstruct identical original data.',
    ],
    topologyNodes: ['Transmitter Shift Register', 'Serial Link', 'Receiver De-stuffer'],
    algorithm: [
      'Initialize ones_count = 0.',
      'Iterate through each bit: if bit == 1, increment ones_count. If ones_count == 5, insert a 0 bit and reset ones_count = 0.',
      'If bit == 0, reset ones_count = 0.',
      'Receiver: upon detecting five 1s followed by a 0, discard the 0 bit.',
    ],
    workspaceType: 'bit-stuffing',
    expectedOutput: 'Original: 01111110 -> Stuffed: 011111010 -> Reconstructed: 01111110',
    vivaQuestions: [
      {
        question: 'What happens at the receiver if five consecutive 1s are followed by a 1 and then a 0?',
        answer: '01111110 is recognized as the legitimate frame delimiter flag sequence.',
      },
      {
        question: 'What is the purpose of Byte Stuffing / Character Stuffing?',
        answer: 'Byte stuffing inserts an escape byte (ESC / DLE) before any occurrence of the flag byte within the payload in byte-oriented protocols like PPP.',
      },
    ],
    submissionChecklist: [
      'Input bit stream documented',
      'Locations of stuffed 0 bits highlighted',
      'Receiver de-stuffing verification confirmed',
    ],
  },

  'exp-sliding-window': {
    id: 'exp-sliding-window',
    expNumber: 6,
    title: 'Sliding Window Protocol & Throughput Analysis',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Transport',
    aim: 'To simulate sliding window flow control, examine the effect of window size on link utilization, and analyze pipeline efficiency.',
    theoryEasy: 'Stop-and-wait sends one packet and waits for a receipt before sending another. Sliding window allows you to mail 4 or 8 letters at once, sliding your window forward each time a receipt arrives.',
    theoryTechnical: 'Link utilization U = (N * T_trans) / (T_trans + 2 * T_prop), where N is window size. If N >= 1 + 2a (where a = T_prop / T_trans), utilization reaches 100%. Sliding window overcomes the high latency-bandwidth penalty of stop-and-wait ARQ.',
    requirements: ['Sender Window Buffer', 'Receiver Sequence Tracker', 'RTT Delay Timer'],
    procedure: [
      'Set Window Size N (1, 2, 4, 8).',
      'Set Transmission delay (Tt) and Propagation delay (Tp).',
      'Transmit frames up to window capacity without waiting for ACKs.',
      'Observe window sliding upon receipt of cumulative ACK.',
      'Calculate theoretical vs observed link utilization.',
    ],
    topologyNodes: ['Sender Host', 'Propagation Link', 'Receiver Host'],
    algorithm: [
      'Maintain send_base and next_seq_num.',
      'Can send as long as next_seq_num < send_base + N.',
      'Upon receiving ACK(n), slide send_base = n + 1.',
    ],
    workspaceType: 'sliding-window',
    expectedOutput: 'Window Size N=4: Link Utilization reaches 85% compared to 20% for N=1.',
    vivaQuestions: [
      {
        question: 'What is the Bandwidth-Delay Product (BDP)?',
        answer: 'BDP = Bandwidth (bps) * RTT (seconds). It represents the maximum amount of unacknowledged data that can fit in the network pipe.',
      },
    ],
    submissionChecklist: [
      'Utilization vs Window Size graph plotted',
      'Observation table filled for N=1, N=4, N=8',
    ],
  },

  'exp-go-back-n': {
    id: 'exp-go-back-n',
    expNumber: 7,
    title: 'Go-Back-N ARQ Protocol with Frame Loss Recovery',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Data Link',
    aim: 'To simulate Go-Back-N ARQ error recovery, observe cumulative acknowledgments, and analyze redundant retransmissions when a middle frame is dropped.',
    theoryEasy: 'You mail packages 1, 2, 3, 4. Package 2 gets lost in the mail. Even though the receiver gets 3 and 4, they throw them away because 2 is missing! You must go back to package 2 and re-send 2, 3, and 4 all over again.',
    theoryTechnical: 'In Go-Back-N (GBN), the receiver maintains a window of size 1 and only accepts frames that arrive strictly in order. Any out-of-order frame is discarded. When the sender timer for the lost frame expires, the sender retransmits ALL frames from the lost frame onward (hence "Go Back N").',
    requirements: ['GBN Sender Pipeline', 'GBN Receiver Window (Size 1)'],
    procedure: [
      'Set sender window size = 4.',
      'Transmit Frames 0, 1, 2, 3.',
      'Inject drop on Frame 1.',
      'Observe receiver discarding Frames 2 and 3 and repeating ACK 0.',
      'Observe sender timeout on Frame 1 and retransmission of Frames 1, 2, 3.',
    ],
    topologyNodes: ['Host A', 'Drop Point', 'Host B'],
    algorithm: [
      'Sender: window [base .. base+N-1].',
      'Receiver: expected_frame = k. If received frame == k, send ACK(k), increment k. Else discard and repeat ACK(k-1).',
      'Sender timeout: retransmit all frames from base to next_seq_num - 1.',
    ],
    workspaceType: 'sliding-window',
    expectedOutput: 'Frame 1 dropped -> Timeout -> Sender retransmits Frames 1, 2, 3.',
    vivaQuestions: [
      {
        question: 'What is the maximum window size in Go-Back-N if sequence numbers use m bits?',
        answer: 'Maximum window size N <= 2^m - 1 to prevent ambiguity between old and new frames.',
      },
    ],
    submissionChecklist: [
      'Total retransmitted frames counted',
      'Efficiency comparison with Selective Repeat documented',
    ],
  },

  'exp-dijkstra': {
    id: 'exp-dijkstra',
    expNumber: 9,
    title: 'Dijkstra Shortest Path Routing Algorithm',
    difficulty: 'Advanced',
    durationMinutes: 25,
    layer: 'Network',
    aim: 'To compute least-cost forwarding paths in an interconnected network using Dijkstra’s Link-State Routing Algorithm and construct the router routing table.',
    theoryEasy: 'Finding the shortest GPS driving route through traffic intersections. At each city, you pick the unvisited neighbor with the lowest total travel cost until all cities are mapped.',
    theoryTechnical: 'Dijkstra’s algorithm computes the shortest path tree from a single source node to all other nodes in a weighted directed graph G=(V,E). It maintains a set S of nodes whose least-cost paths are known, greedily adding the node with the minimum distance metric at each step in O(|V|^2) or O(|E| + |V| log |V|) time.',
    requirements: ['Weighted Adjacency Matrix', 'Priority Queue / Distance Table'],
    procedure: [
      'Define network topology with node costs (e.g. Router A through Router E).',
      'Initialize dist[source] = 0 and dist[v] = infinity for all other nodes.',
      'Greedily select unvisited node with minimum distance.',
      'Relax neighbor edges: dist[v] = min(dist[v], dist[u] + cost(u, v)).',
      'Generate final least-cost forwarding table.',
    ],
    topologyNodes: ['Router A', 'Router B', 'Router C', 'Router D', 'Router E'],
    algorithm: [
      'Initialize N\' = {u}, for all v, D(v) = c(u,v).',
      'Find w not in N\' such that D(w) is minimum.',
      'Add w to N\'.',
      'Update D(v) = min(D(v), D(w) + c(w,v)) for all neighbors of w not in N\'.',
      'Repeat until all nodes are in N\'.',
    ],
    workspaceType: 'dijkstra',
    expectedOutput: 'Shortest path from A to E: A -> C -> D -> E (Total Cost: 7).',
    vivaQuestions: [
      {
        question: 'Which real-world interior gateway routing protocol uses Dijkstra’s algorithm?',
        answer: 'OSPF (Open Shortest Path First) and IS-IS.',
      },
    ],
    submissionChecklist: [
      'Step-by-step distance table recorded',
      'Shortest path tree drawn',
    ],
  },

  'exp-subnetting': {
    id: 'exp-subnetting',
    expNumber: 11,
    title: 'IPv4 Subnetting, Variable Length Subnet Masking (VLSM) & CIDR',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    layer: 'Network',
    aim: 'To partition a Class C network into required subnets, calculate network/broadcast addresses, assign host IP ranges, and determine whether a target is local or remote.',
    theoryEasy: 'Subnetting is dividing a large apartment building into floors and suites so mail carriers can sort mail efficiently.',
    theoryTechnical: 'Applies bitwise binary AND between IPv4 address and 32-bit subnet mask to extract Network ID. Host bits determine usable address space (2^h - 2). Default gateway decision: if (DstIP AND Mask) == (SrcIP AND Mask), packet is delivered locally via ARP; else forwarded to Default Gateway.',
    requirements: ['Binary Subnet Calculator', 'VLSM Allocation Table'],
    procedure: [
      'Enter base network IP (e.g. 192.168.10.0) and CIDR prefix (e.g. /26).',
      'Compute subnet mask (255.255.255.192), block size (64), and total subnets (4).',
      'Calculate Network Address, First Usable Host, Last Usable Host, and Broadcast Address.',
      'Test destination routing logic for local vs remote hosts.',
    ],
    topologyNodes: ['Host 1 (Subnet A)', 'L2 Switch', 'Router Gateway', 'Host 2 (Subnet B)'],
    algorithm: [
      'Subnet mask = 32 - prefix bits.',
      'Block size = 2^(32 - prefix).',
      'Network ID = IP AND Mask.',
      'Broadcast = Network ID + (Block size - 1).',
      'Usable hosts = Network ID + 1 through Broadcast - 1.',
    ],
    workspaceType: 'subnetting',
    expectedOutput: '192.168.10.0/26: Net=192.168.10.0, Usable=192.168.10.1-62, Bcast=192.168.10.63.',
    vivaQuestions: [
      {
        question: 'Why do we subtract 2 when calculating usable host addresses in a subnet?',
        answer: 'The first address with all host bits set to 0 represents the Network ID, and the last address with all host bits set to 1 represents the Subnet Broadcast Address.',
      },
    ],
    submissionChecklist: [
      'Network, broadcast, and host range calculated',
      'Local vs remote forwarding test passed',
    ],
  },

  'exp-tcp-sockets': {
    id: 'exp-tcp-sockets',
    expNumber: 15,
    title: 'Client-Server Socket Programming using TCP',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    layer: 'Application',
    aim: 'To understand and execute client-server socket programming using TCP, tracing the socket lifecycle: socket(), bind(), listen(), accept(), connect(), send(), recv(), and close().',
    theoryEasy: 'Setting up a customer service phone line: The office buys a phone (socket), plugs it into an extension number (bind), waits for rings (listen), picks up an incoming call (accept), chats with the customer (send/recv), and hangs up (close).',
    theoryTechnical: 'The Berkeley Sockets API provides the abstraction for network I/O. A TCP server creates an AF_INET SOCK_STREAM socket, binds to an IP/port, puts the socket in passive LISTEN state, and blocks on accept() returning a new connected socket for client communication. Full-duplex byte stream ensured by underlying TCP stack.',
    requirements: ['Socket API State Machine', 'Python/Node.js Code Runner'],
    procedure: [
      'Inspect TCP Server lifecycle code.',
      'Inspect TCP Client lifecycle code.',
      'Execute Server: bind to 127.0.0.1:8080 and enter LISTEN state.',
      'Execute Client: initiate connect() to trigger TCP 3-way handshake.',
      'Transmit payload message and observe echo response.',
      'Terminate connection with close().',
    ],
    topologyNodes: ['Client Process (PID 1024)', 'Kernel TCP Stack', 'Server Process (PID 4096)'],
    algorithm: [
      'Server: s = socket(), s.bind((HOST, PORT)), s.listen(5), conn, addr = s.accept(), data = conn.recv(1024), conn.sendall(data), conn.close().',
      'Client: c = socket(), c.connect((HOST, PORT)), c.sendall(msg), resp = c.recv(1024), c.close().',
    ],
    workspaceType: 'socket',
    expectedOutput: 'Client: Connected to 127.0.0.1:8080 -> Sent: "Hello NetViz" -> Echo Received: "HELLO NETVIZ"',
    vivaQuestions: [
      {
        question: 'Why does accept() return a new socket descriptor rather than reusing the listening socket?',
        answer: 'The listening socket must remain free to accept new incoming connection requests from other clients, while the dedicated new socket handles the established full-duplex session with this specific client.',
      },
    ],
    submissionChecklist: [
      'Server socket lifecycle states verified',
      'Handshake and data exchange log recorded',
    ],
  },
};
