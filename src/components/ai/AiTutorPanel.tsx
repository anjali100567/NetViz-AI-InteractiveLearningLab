'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  BookOpen, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import { generateTutorAnswer, TutorResponse, TutorContext } from '@/lib/ai/tutorEngine';
import { SimulationEvent, SimulationPacket } from '@/lib/simulation/types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  response?: TutorResponse;
  timestamp: string;
}

interface AiTutorPanelProps {
  currentEvent?: SimulationEvent | null;
  selectedPacket?: SimulationPacket | null;
  topicId?: string;
  labId?: string;
}

export function AiTutorPanel({ currentEvent, selectedPacket, topicId, labId }: AiTutorPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am NetViz AI, your interactive Computer Networks tutor. I observe your exact packet timeline and headers in real-time. What would you like to explore?',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [guidanceLevel, setGuidanceLevel] = useState<'hint' | 'explanation' | 'walkthrough'>('explanation');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Why was this packet retransmitted?',
    'What happens if an ACK is lost?',
    'Why did the MAC address change at the router?',
    'Explain the current simulation event in detail',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call deterministic tutor engine
    setTimeout(() => {
      const context: TutorContext = {
        labId,
        topicId,
        currentEvent,
        selectedPacket,
        guidanceLevel,
      };
      const answer = generateTutorAnswer(query, context);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        response: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="w-full rounded-2xl bg-navy-900 border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col h-full">
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              Ask NetViz AI
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                Active Tutor
              </span>
            </h3>
          </div>
        </div>

        {/* Guidance Level Selector */}
        <div className="flex rounded-lg bg-navy-950 p-0.5 border border-slate-800 text-[10px] font-semibold">
          {(['hint', 'explanation', 'walkthrough'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setGuidanceLevel(lvl)}
              className={`px-2 py-1 rounded-md capitalize transition-colors ${
                guidanceLevel === lvl
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1 max-h-[460px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-br-none'
                  : 'bg-navy-950/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {msg.text && <p>{msg.text}</p>}

              {msg.response && (
                <div className="space-y-2.5">
                  <div className="font-bold text-cyan-300 text-xs">
                    {msg.response.directAnswer}
                  </div>

                  <p className="text-slate-300">
                    {msg.response.simpleExplanation}
                  </p>

                  <div className="p-2.5 rounded-xl bg-navy-900/90 border border-slate-800 text-[11px]">
                    <div className="font-semibold text-amber-300 flex items-center gap-1 mb-1">
                      <Sparkles className="h-3 w-3" />
                      Visual Observation
                    </div>
                    <p className="text-slate-300">{msg.response.visualExplanation}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] font-mono">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">TECHNICAL EXPLANATION</span>
                    <p className="text-slate-300 leading-tight">{msg.response.technicalExplanation}</p>
                  </div>

                  {msg.response.currentEventContext && (
                    <div className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/30 p-2 rounded-lg border border-cyan-800/30">
                      📍 {msg.response.currentEventContext}
                    </div>
                  )}

                  {msg.response.relatedLabOrPractice && (
                    <Link
                      href={msg.response.relatedLabOrPractice.href}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-semibold hover:underline mt-1"
                    >
                      <BookOpen className="h-3 w-3" />
                      Try {msg.response.relatedLabOrPractice.title}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-navy-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
            <Bot className="h-4 w-4 animate-bounce text-cyan-400" />
            <span>NetViz AI is analyzing simulation state...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[10px]">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about packets, window size, loss, timers..."
          className="flex-1 bg-navy-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 font-sans"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
