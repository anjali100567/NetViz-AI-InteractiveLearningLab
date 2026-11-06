# NetViz AI — Visual Computer Networks Learning Lab

> An AI-powered interactive virtual laboratory for college students and network engineers to learn Computer Networks by watching protocols, packets, frames, ACKs, timers, headers, and network devices interact visually.

---

## 🚀 Key Features

1. **Deterministic Simulation Engine (Zero AI Hallucination)**
   - Computes packet journeys, hop-by-hop MAC rewriting, sequence numbers, acknowledgments, RTO timers, retransmissions, sliding windows, queue overflow drops, and Fast Retransmit.
   - Separate from the AI explanation layer: the simulation engine produces ground-truth events; the AI explains them.

2. **Three Core Learning Approaches**
   - **Top-Down Mode (`/learn/top-down`)**: Application (HTTP/HTTPS) → Transport (TCP) → Network (IP) → Data Link (Ethernet) → Physical (Bits/signals).
   - **Bottom-Up Mode (`/learn/bottom-up`)**: Physical (Bits) → Data Link (Frame CRC) → Network (IP routing) → Transport (TCP socket demux) → Application (HTTP daemon).
   - **Explore-Any-Topic Mode (`/topics`)**: Jump directly to TCP Sliding Window, ACK Loss, IP Subnetting, ARP, DNS, NAT, or Congestion Control.

3. **Interactive 5-Layer OSI / TCP-IP Map (`/learn`)**
   - Displays all 5 layers with interactive inspection of Purpose, Addressing, Protocols, Devices, Common Problems, Real-World Analogies, and 1-click Lab / Visualize shortcuts.

4. **16 Guided Labs (`/labs`)**
   - Every lab strictly follows the pedagogy:
     `Learn → Observe → Predict → Configure → Run → Analyze → Practice → Reflect`
   - Real-time prediction challenges, dual-level hints, walkthroughs, automated scoring, and recommendations.

5. **Wireshark-Style Packet Analyzer (`/packet-analyzer`)**
   - Real packet traces with capture & display filters (`tcp`, `http`, `syn`, `retransmission`, port matches).
   - Layered packet tree breakdown (Frame, Ethernet II, IPv4, TCP, Application).
   - Raw Hex & ASCII dump view.
   - **"Explain This Packet"** AI button for instant diagnosis of anomalies and handshakes.

6. **Ask NetViz AI Tutor (`/simulator`, `/labs`, `/topics`)**
   - Context-aware tutor with 3 guidance levels: **Hint**, **Explanation**, and **Walkthrough**.
   - **Natural Language "What-If" Prompt Bar**: e.g., *"Show what happens if window size is 2 and packet 3 is lost"* converts automatically into structured simulation parameters with a confirmation modal before execution.
   - Built-in deterministic offline engine works out of the box without requiring external API keys.

7. **Practice Round System & Dashboard (`/practice`, `/dashboard`, `/progress`)**
   - 100+ seed practice questions across all 5 layers and major protocols.
   - Immediate feedback, explanations, timed challenges, accuracy calculations, and final diagnostic reports.
   - 10 unlockable networking badges and daily learning streaks.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with dark navy & networking status palette
- **Icons**: Lucide React
- **Graphs**: Recharts (live CWND and SSTHRESH AIMD sawtooth traces)
- **State**: React State + LocalStorage-backed progress store

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── page.tsx                     # Landing & Home Showcase
│   ├── dashboard/page.tsx           # Student Dashboard with 8 widgets
│   ├── learn/
│   │   ├── page.tsx                 # Interactive 5-Layer OSI Map
│   │   ├── top-down/page.tsx        # Top-Down Encapsulation Flow
│   │   └── bottom-up/page.tsx       # Bottom-Up Decapsulation Flow
│   ├── topics/
│   │   ├── page.tsx                 # Topics Explorer with Search & Filter
│   │   └── [topicId]/page.tsx       # Topic Deep Dive with AI Tutor
│   ├── simulator/page.tsx           # Packet Journey Simulator & Compare Mode
│   ├── labs/
│   │   ├── page.tsx                 # 16 Guided Labs Index
│   │   └── [labId]/page.tsx         # 3-Panel Lab Workspace
│   ├── practice/
│   │   ├── page.tsx                 # Practice Rounds Catalog
│   │   └── [topicId]/page.tsx       # Interactive Exam Quiz & Final Report
│   ├── packet-analyzer/page.tsx     # Wireshark-Style Trace Inspector
│   ├── progress/page.tsx            # Mastery Records, Streak & 10 Badges
│   ├── settings/page.tsx            # AI Provider, API Keys & Speed Settings
│   └── api/
│       ├── ai/tutor/route.ts        # AI Tutor API endpoint
│       └── ai/scenario/route.ts     # Natural language scenario parser
├── components/
│   ├── navigation/Navbar.tsx        # Responsive Navigation
│   ├── simulation/
│   │   ├── NetworkCanvas.tsx        # SVG/Canvas Topology & Animated Packets
│   │   ├── PacketInspector.tsx      # Field-by-Field Header Breakdown
│   │   ├── EventTimeline.tsx        # Chronological Event Playback
│   │   ├── SimulationControls.tsx   # Play, Pause, Step, Speed, Scenarios
│   │   └── CongestionGraph.tsx      # Live Recharts CWND Sawtooth Graph
│   └── ai/
│       ├── AiTutorPanel.tsx         # Floating/Docked Tutor (3 Guidance Levels)
│       └── WhatIfPromptBar.tsx      # Natural Language What-If Input
└── lib/
    ├── simulation/
    │   ├── types.ts                 # Packets, Events, Devices, Config Types
    │   ├── engine.ts                # Deterministic Engine & Scenarios
    │   └── networkProtocols.ts      # DNS, ARP, DHCP, Routing, NAT Engines
    ├── content/
    │   ├── topicsData.ts            # Detailed Topic Explanations
    │   ├── labsData.ts              # 16 Guided Labs Specs
    │   ├── practiceQuestions.ts     # 100+ Question Bank
    │   ├── packetTraces.ts          # Wireshark Sample Traces
    │   └── badgesData.ts            # 10 Student Badges
    ├── ai/
    │   ├── tutorEngine.ts           # State-Aware AI Reasoning Engine
    │   └── whatIfParser.ts          # Natural Language Parameter Converter
    └── store/
        └── userProgressStore.ts     # LocalStorage Progress & Accuracy Hook
```

---

## 🏃 Getting Started

### 1. Installation
```bash
# In project directory
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 How to Extend the Application

### 1. How to Add a New Protocol
1. Open `src/lib/simulation/types.ts` and add your protocol name to `ProtocolType`:
   ```typescript
   export type ProtocolType = ... | 'BGP' | 'OSPF';
   ```
2. Open `src/lib/simulation/engine.ts` or `src/lib/simulation/networkProtocols.ts`.
3. Add a new scenario entry under `SIMULATION_SCENARIOS`:
   ```typescript
   'bgp-peering': {
     id: 'bgp-peering',
     name: 'BGP Route Advertisement',
     protocol: 'BGP',
     category: 'Network',
     defaultConfig: { ... },
     generateEvents: (config) => [
       {
         eventId: 1,
         timestamp: 0,
         type: 'packet_sent',
         protocol: 'BGP',
         source: 'Router R1',
         destination: 'Router R2',
         status: 'delivered',
         explanation: 'BGP OPEN message exchanged over TCP Port 179.',
         layer: 'Network',
       },
     ],
   }
   ```

### 2. How to Add a New Guided Lab
1. Open `src/lib/content/labsData.ts`.
2. Add a new `GuidedLab` object to `GUIDED_LABS`:
   ```typescript
   'lab-bgp': {
     id: 'lab-bgp',
     title: 'Lab 17: Border Gateway Protocol (BGP)',
     difficulty: 'Advanced',
     durationMinutes: 25,
     layer: 'Network',
     learningObjective: 'Observe autonomous system peering and path vector routing.',
     prerequisites: ['TCP Handshake', 'Subnetting & Routing'],
     conceptsUsed: ['Autonomous System (AS)', 'BGP Open', 'Keepalive', 'Path Vector'],
     topology: ['AS 100 Router', 'Internet Exchange Point', 'AS 200 Router'],
     defaultSimulationId: 'bgp-peering',
     steps: [
       {
         stepNumber: 1,
         title: 'Establish BGP TCP Peering',
         stage: 'Learn',
         instruction: 'Inspect the TCP Port 179 session establishment.',
         aiHintLevel1: 'BGP uses reliable TCP transport rather than UDP.',
         aiHintLevel2: 'Look for the BGP OPEN message.',
         walkthrough: 'Routers establish a TCP 3-way handshake on Port 179 before sending BGP messages.',
       },
     ],
   }
   ```

### 3. How to Add New Practice Questions
1. Open `src/lib/content/practiceQuestions.ts`.
2. Append a new item to `PRACTICE_QUESTIONS`:
   ```typescript
   {
     id: 'bgp-q1',
     topicId: 'subnetting-routing',
     layer: 'Network',
     difficulty: 'Hard',
     type: 'multiple-choice',
     question: 'Which underlying transport protocol and port does BGP use?',
     options: ['UDP Port 520', 'TCP Port 179', 'ICMP Type 8', 'IP Protocol 89'],
     correctAnswer: 1,
     explanation: 'BGP establishes reliable peering sessions over TCP port 179.',
     hint: 'Unlike RIP or OSPF, BGP relies on a connection-oriented transport protocol.',
   }
   ```

---

## 🎨 Visual Color Standards

| Status | Color | Meaning |
|---|---|---|
| In Flight / Waiting | **Blue** (`#3B82F6`) | Transmitted packet traversing the link |
| Delivered / ACKed | **Green** (`#10B981`) | Successfully delivered and acknowledged |
| Lost / Dropped | **Red** (`#EF4444`) | Packet dropped due to queue drop or corrupt CRC |
| Delayed | **Yellow** (`#F59E0B`) | High latency RTT link propagation |
| Retransmitted | **Orange** (`#F97316`) | Re-sent packet following timeout or Fast Retransmit |
| Duplicate ACK | **Purple** (`#A855F7`) | Out-of-order segment triggering repeated ACK |

---

## 📄 License
MIT License. Built for Computer Science and Engineering education.
