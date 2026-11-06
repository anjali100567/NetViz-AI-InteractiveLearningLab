'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Bot, 
  Activity, 
  Sliders, 
  Layers, 
  Sparkles,
  HelpCircle,
  Columns,
  Router,
  FileText,
  Info
} from 'lucide-react';
import { NetworkCanvas, TopologyNode } from '@/components/simulation/NetworkCanvas';
import { PacketInspector } from '@/components/simulation/PacketInspector';
import { EventTimeline } from '@/components/simulation/EventTimeline';
import { SimulationControls } from '@/components/simulation/SimulationControls';
import { CongestionGraph } from '@/components/simulation/CongestionGraph';
import { AiTutorPanel } from '@/components/ai/AiTutorPanel';
import { WhatIfPromptBar } from '@/components/ai/WhatIfPromptBar';
import { DeviceInspectionModal } from '@/components/simulation/DeviceInspectionModal';
import { SIMULATION_SCENARIOS } from '@/lib/simulation/engine';
import { SimulationEvent, SimulationPacket } from '@/lib/simulation/types';

function NetworkJourneyContent() {
  const searchParams = useSearchParams();
  const initialScenario = searchParams.get('scenario') || 'packet-encapsulation';

  const [scenarioId, setScenarioId] = useState(initialScenario);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedPacket, setSelectedPacket] = useState<SimulationPacket | null>(null);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareScenarioId, setCompareScenarioId] = useState('tcp-ack-loss');
  const [explanationLevel, setExplanationLevel] = useState<'easy' | 'technical'>('easy');

  const scenario = SIMULATION_SCENARIOS[scenarioId] || SIMULATION_SCENARIOS['packet-encapsulation'];
  const events = scenario.generateEvents(scenario.defaultConfig as any);
  const currentEvent: SimulationEvent | null = events[currentStep] || null;

  // Compare mode events
  const compareScenario = SIMULATION_SCENARIOS[compareScenarioId] || SIMULATION_SCENARIOS['tcp-ack-loss'];
  const compareEvents = compareScenario.generateEvents(compareScenario.defaultConfig as any);
  const currentCompareEvent: SimulationEvent | null = compareEvents[currentStep] || null;

  // Auto playback loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < events.length - 1) {
            return prev + 1;
          } else {
            setIsRunning(false);
            return prev;
          }
        });
      }, 2000 / speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, speed, events.length]);

  const handleTogglePlay = () => {
    if (currentStep >= events.length - 1) {
      setCurrentStep(0);
    }
    setIsRunning(!isRunning);
  };

  const handleStepForward = () => {
    setIsRunning(false);
    if (currentStep < events.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  const handleNodeClick = (node: TopologyNode) => {
    setIsRunning(false);
    setSelectedNode(node);
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              Overall Network Journey (End-to-End Visualizer)
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Cross-Device Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Follow packets through Client $\rightarrow$ Switch $\rightarrow$ Router $\rightarrow$ WAN Cloud $\rightarrow$ Server. Click any device to see internal de-encapsulation!
          </p>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Easy vs Technical Explanation Toggle */}
          <div className="flex rounded-xl bg-navy-900 p-1 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setExplanationLevel('easy')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                explanationLevel === 'easy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Easy Explanation
            </button>
            <button
              onClick={() => setExplanationLevel('technical')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                explanationLevel === 'technical' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Technical Specification
            </button>
          </div>

          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isCompareMode
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-lg'
                : 'bg-navy-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Columns className="h-4 w-4" />
            <span>Compare Mode</span>
          </button>
        </div>
      </div>

      {/* What-If Prompt Bar */}
      <div className="my-4">
        <WhatIfPromptBar
          onApplyScenario={(result) => {
            if (result.scenarioId && SIMULATION_SCENARIOS[result.scenarioId]) {
              setScenarioId(result.scenarioId);
              setCurrentStep(0);
            }
          }}
        />
      </div>

      {/* Synchronized Explanation Banner */}
      {currentEvent && (
        <div className="mb-4 p-4 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">
                CURRENT EVENT #{currentEvent.eventId}: {currentEvent.type}
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">
                {explanationLevel === 'easy' ? currentEvent.explanation : currentEvent.technicalDetails || currentEvent.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              // Open default router modal
              setSelectedNode({
                id: 'router',
                name: 'Gateway Router',
                type: 'router',
                x: 50,
                y: 50,
                ip: '192.168.1.1',
                mac: '00:1A:2B:3C:4D:5E',
                role: 'TTL Decrement & Routing'
              });
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex-shrink-0"
          >
            <Router className="h-3.5 w-3.5 text-cyan-400" />
            <span>Inspect Router Pipeline</span>
          </button>
        </div>
      )}

      {/* Main Controls Strip */}
      <div className="mb-4">
        <SimulationControls
          isRunning={isRunning}
          onTogglePlay={handleTogglePlay}
          onStepForward={handleStepForward}
          onReset={handleReset}
          speed={speed}
          onChangeSpeed={setSpeed}
          selectedScenarioId={scenarioId}
          onSelectScenario={(id) => {
            setScenarioId(id);
            setCurrentStep(0);
          }}
        />
      </div>

      {/* Topology Canvas with Clickable Devices */}
      <div className="mb-6">
        <NetworkCanvas
          currentEvent={currentEvent}
          selectedPacket={selectedPacket}
          onSelectPacket={setSelectedPacket}
          onSelectNode={handleNodeClick}
        />
      </div>

      {/* 3-Column Dashboard: Timeline | Packet Headers | AI Tutor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <EventTimeline
            events={events}
            currentStep={currentStep}
            onSelectStep={(s) => {
              setIsRunning(false);
              setCurrentStep(s);
            }}
          />
        </div>

        <div className="lg:col-span-4">
          <PacketInspector
            currentEvent={currentEvent}
            packet={selectedPacket}
          />
        </div>

        <div className="lg:col-span-4">
          <AiTutorPanel
            currentEvent={currentEvent}
            selectedPacket={selectedPacket}
            topicId={scenario.id}
          />
        </div>
      </div>

      {/* Device Inspection Modal (Triggered when user clicks router, switch, client, server) */}
      <DeviceInspectionModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onContinue={() => {
          setSelectedNode(null);
          setIsRunning(true);
        }}
      />
    </div>
  );
}

export default function NetworkJourneyPage() {
  return (
    <Suspense fallback={<div className="p-10 text-cyan-400 font-mono text-center">Loading Network Journey Engine...</div>}>
      <NetworkJourneyContent />
    </Suspense>
  );
}
