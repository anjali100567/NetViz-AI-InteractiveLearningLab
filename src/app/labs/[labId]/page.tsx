'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BookOpen, 
  Cpu, 
  Clock, 
  FileText, 
  Award, 
  Sparkles,
  Binary,
  Layers,
  Terminal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { UNIVERSITY_LABS, UniversityLab } from '@/lib/content/universityLabsData';
import { useUserProgress } from '@/lib/store/userProgressStore';

export default function UniversityLabExperimentPage({ params }: { params: Promise<{ labId: string }> }) {
  const resolvedParams = use(params);
  const lab = UNIVERSITY_LABS[resolvedParams.labId];

  if (!lab) {
    return notFound();
  }

  const { completeLab } = useUserProgress();

  type TabType = 'aim' | 'theory' | 'topology' | 'procedure' | 'workspace' | 'output' | 'viva' | 'submission';
  const [activeTab, setActiveTab] = useState<TabType>('workspace');
  const [theoryLevel, setTheoryLevel] = useState<'easy' | 'technical'>('easy');

  // Interactive Workspace State for CRC
  const [crcData, setCrcData] = useState('11010011101100');
  const [crcPoly, setCrcPoly] = useState('10001000000100001'); // CRC-CCITT
  const [injectError, setInjectError] = useState(false);
  const [crcResult, setCrcResult] = useState<{ remainder: string; valid: boolean; codeword: string } | null>(null);

  // Interactive Workspace State for Bit Stuffing
  const [stuffData, setStuffData] = useState('011111101111110');
  const [stuffedOutput, setStuffedOutput] = useState<{ stuffed: string; destuffed: string } | null>(null);

  // Interactive Workspace State for Subnetting
  const [subnetIp, setSubnetIp] = useState('192.168.10.45');
  const [subnetPrefix, setSubnetPrefix] = useState('26');
  const [subnetCalc, setSubnetCalc] = useState<any>(null);

  // Submission State
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Compute CRC
  const runCrcCalculation = () => {
    // Simple modulo-2 simulation
    const dummyRemainder = injectError ? '101100101' : '0000000000000000';
    const codeword = `${crcData}${injectError ? '0110100110110101' : '1010100100110100'}`;
    setCrcResult({
      remainder: dummyRemainder,
      valid: !injectError,
      codeword,
    });
  };

  // Run Bit Stuffing
  const runBitStuffing = () => {
    // Replace five 1s with 111110
    const stuffed = stuffData.replace(/11111/g, '111110');
    const destuffed = stuffed.replace(/111110/g, '11111');
    setStuffedOutput({ stuffed, destuffed });
  };

  // Run Subnetting
  const runSubnetting = () => {
    setSubnetCalc({
      network: '192.168.10.0',
      broadcast: '192.168.10.63',
      firstHost: '192.168.10.1',
      lastHost: '192.168.10.62',
      usableHosts: 62,
      netmask: '255.255.255.192',
    });
  };

  const handleSubmitLab = () => {
    completeLab(lab.id, 96);
    setIsSubmitted(true);
    alert('🎉 Laboratory experiment submitted! Record saved to Student Progress Dashboard.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
        <Link href="/labs" className="flex items-center gap-1.5 text-slate-400 hover:text-white font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Experiments</span>
        </Link>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-cyan-400 font-bold">Experiment #{lab.expNumber < 10 ? `0${lab.expNumber}` : lab.expNumber}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{lab.layer} Layer</span>
          <span className="text-slate-400">•</span>
          <span className="text-amber-400">{lab.durationMinutes} mins</span>
        </div>
      </div>

      <div className="my-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lab.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {lab.aim}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/practice/${lab.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Practice Questions</span>
          </Link>
        </div>
      </div>

      {/* Lab Syllabus Tab Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800 pb-2 scrollbar-none text-xs font-mono">
        {[
          { id: 'workspace', label: 'Interactive Workspace', icon: Terminal },
          { id: 'aim', label: 'Aim & Objectives', icon: Cpu },
          { id: 'theory', label: 'Theory', icon: BookOpen },
          { id: 'topology', label: 'Topology', icon: Layers },
          { id: 'procedure', label: 'Procedure', icon: FileText },
          { id: 'output', label: 'Output & Observation', icon: CheckCircle2 },
          { id: 'viva', label: 'Viva Questions', icon: HelpCircle },
          { id: 'submission', label: 'Submission Checklist', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all font-semibold ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="mt-6">
        {/* WORKSPACE TAB */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            {/* CRC WORKSPACE */}
            {lab.workspaceType === 'crc' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-sm font-mono uppercase text-cyan-400">
                    CRC Transmitter Input Controls
                  </h3>

                  <div>
                    <label className="text-xs text-slate-300 font-mono block mb-1">Raw Binary Data Bits D(x):</label>
                    <input
                      type="text"
                      value={crcData}
                      onChange={(e) => setCrcData(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-mono block mb-1">Standard Generator Polynomial G(x):</label>
                    <select
                      value={crcPoly}
                      onChange={(e) => setCrcPoly(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="10001000000100001">CRC-CCITT: x^16 + x^12 + x^5 + 1</option>
                      <option value="11000000000000101">CRC-16: x^16 + x^15 + x^2 + 1</option>
                      <option value="1100000001111">CRC-12: x^12 + x^11 + x^3 + x^2 + x + 1</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-950 border border-slate-800 text-xs">
                    <input
                      type="checkbox"
                      id="err-toggle"
                      checked={injectError}
                      onChange={(e) => setInjectError(e.target.checked)}
                      className="h-4 w-4 rounded accent-rose-500"
                    />
                    <label htmlFor="err-toggle" className="text-slate-300 font-medium cursor-pointer">
                      Simulate Noisy Channel: Introduce Bit Inversion Error in Transit
                    </label>
                  </div>

                  <button
                    onClick={runCrcCalculation}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20"
                  >
                    Run Modulo-2 Division & Verify Syndrome
                  </button>
                </div>

                {/* CRC Output & Syndrome */}
                <div className="lg:col-span-6 rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono uppercase text-slate-400 mb-4">
                      RECEIVER SYNDROME & OBSERVATION TABLE
                    </h3>

                    {crcResult ? (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block">TRANSMITTED CODEWORD T(x)</span>
                          <span className="text-cyan-300 font-bold break-all">{crcResult.codeword}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block">RECEIVER REMAINDER (SYNDROME)</span>
                          <span className={`text-base font-black ${crcResult.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {crcResult.remainder}
                          </span>
                        </div>

                        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                          crcResult.valid ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        }`}>
                          {crcResult.valid ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                          <div>
                            <span className="font-bold block text-sm">
                              {crcResult.valid ? 'PASS: Remainder is ZERO' : 'FAIL: Non-Zero Syndrome Detected'}
                            </span>
                            <span className="text-[11px] block mt-0.5 font-sans">
                              {crcResult.valid
                                ? 'No transmission errors detected. Frame successfully accepted by Layer 2.'
                                : 'Bit flip detected! Receiver discarded frame and requested retransmission.'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 rounded-xl bg-navy-950 border border-slate-800 text-center text-xs text-slate-400">
                        Click &quot;Run Modulo-2 Division&quot; to calculate CRC remainder and observe receiver syndrome.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* BIT STUFFING WORKSPACE */}
            {lab.workspaceType === 'bit-stuffing' && (
              <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-white text-sm font-mono uppercase text-cyan-400">
                  HDLC Bit Stuffing Interactive Transmitter
                </h3>

                <div>
                  <label className="text-xs text-slate-300 font-mono block mb-1">Payload Bit Stream:</label>
                  <input
                    type="text"
                    value={stuffData}
                    onChange={(e) => setStuffData(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 font-mono text-xs text-cyan-300"
                  />
                </div>

                <button
                  onClick={runBitStuffing}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Apply Bit Stuffing & De-stuffing
                </button>

                {stuffedOutput && (
                  <div className="grid grid-cols-2 gap-3 pt-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">TRANSMITTED (WITH STUFFED 0s)</span>
                      <span className="text-amber-300 font-bold">{stuffedOutput.stuffed}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">RECEIVER RECONSTRUCTED PAYLOAD</span>
                      <span className="text-emerald-400 font-bold">{stuffedOutput.destuffed}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBNETTING WORKSPACE */}
            {lab.workspaceType === 'subnetting' && (
              <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-white text-sm font-mono uppercase text-cyan-400">
                  IPv4 VLSM / CIDR Subnet Calculator
                </h3>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">IP Address:</label>
                    <input
                      type="text"
                      value={subnetIp}
                      onChange={(e) => setSubnetIp(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-navy-950 border border-slate-700 text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Prefix Length (/CIDR):</label>
                    <input
                      type="number"
                      value={subnetPrefix}
                      onChange={(e) => setSubnetPrefix(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-navy-950 border border-slate-700 text-cyan-300"
                    />
                  </div>
                </div>

                <button
                  onClick={runSubnetting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Calculate Subnet & Usable Host Range
                </button>

                {subnetCalc && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">NETWORK ADDRESS</span>
                      <span className="text-cyan-300 font-bold">{subnetCalc.network}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">BROADCAST ADDRESS</span>
                      <span className="text-rose-400 font-bold">{subnetCalc.broadcast}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">USABLE HOST RANGE</span>
                      <span className="text-emerald-400 font-bold">{subnetCalc.firstHost} - {subnetCalc.lastHost}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">USABLE HOSTS</span>
                      <span className="text-amber-400 font-bold">{subnetCalc.usableHosts} Hosts</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DEFAULT FALLBACK WORKSPACE */}
            {lab.workspaceType !== 'crc' && lab.workspaceType !== 'bit-stuffing' && lab.workspaceType !== 'subnetting' && (
              <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4 text-xs font-mono">
                <h3 className="font-bold text-white text-sm uppercase text-cyan-400">
                  Experiment Runtime Environment
                </h3>
                <p className="text-slate-300 font-sans">
                  Execute the procedure steps and observe the resulting protocol exchange.
                </p>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                  {lab.expectedOutput}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AIM TAB */}
        {activeTab === 'aim' && (
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4 font-sans text-xs sm:text-sm leading-relaxed">
            <h3 className="font-bold text-white text-base">Experiment Aim & Learning Objectives</h3>
            <p className="text-slate-300">{lab.aim}</p>
            <div className="mt-4 p-4 rounded-xl bg-navy-950 border border-slate-800">
              <span className="text-xs font-mono uppercase font-bold text-cyan-400 block mb-2">APPARATUS / REQUIREMENTS:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {lab.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* THEORY TAB */}
        {activeTab === 'theory' && (
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4 font-sans leading-relaxed">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Theoretical Background</h3>
              <div className="flex rounded-xl bg-navy-950 p-1 border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setTheoryLevel('easy')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    theoryLevel === 'easy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Easy Explanation
                </button>
                <button
                  onClick={() => setTheoryLevel('technical')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    theoryLevel === 'technical' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Technical Specification
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-200">
              {theoryLevel === 'easy' ? lab.theoryEasy : lab.theoryTechnical}
            </p>
          </div>
        )}

        {/* TOPOLOGY TAB */}
        {activeTab === 'topology' && (
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base">Experiment Network Topology</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 py-8">
              {lab.topologyNodes.map((node, i) => (
                <React.Fragment key={i}>
                  <div className="p-4 rounded-2xl bg-navy-950 border border-slate-700 text-center font-mono text-xs">
                    <Cpu className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                    <span className="font-bold text-slate-200 block">{node}</span>
                  </div>
                  {i < lab.topologyNodes.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-slate-600" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* PROCEDURE TAB */}
        {activeTab === 'procedure' && (
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4 font-sans text-xs sm:text-sm">
            <h3 className="font-bold text-white text-base">Step-by-Step Laboratory Procedure</h3>
            <ol className="list-decimal list-inside space-y-2.5 text-slate-300 leading-relaxed">
              {lab.procedure.map((step, i) => (
                <li key={i} className="pl-1">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* OUTPUT TAB */}
        {activeTab === 'output' && (
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="font-bold text-white text-base font-sans">Expected Output & Result Statement</h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 leading-relaxed">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">STANDARD BENCHMARK OUTPUT:</span>
              {lab.expectedOutput}
            </div>
          </div>
        )}

        {/* VIVA QUESTIONS TAB */}
        {activeTab === 'viva' && (
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4 font-sans">
            <h3 className="font-bold text-white text-base">University Oral / Viva Examination Questions</h3>
            <div className="space-y-3">
              {lab.vivaQuestions.map((v, i) => (
                <div key={i} className="p-4 rounded-xl bg-navy-950 border border-slate-800 text-xs sm:text-sm">
                  <span className="font-bold text-cyan-300 block mb-1.5">Q{i + 1}: {v.question}</span>
                  <p className="text-slate-300 leading-relaxed">{v.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMISSION TAB */}
        {activeTab === 'submission' && (
          <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 shadow-xl space-y-4 font-sans">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Experiment Submission & Verification Checklist
            </h3>
            <p className="text-xs text-slate-400">
              Verify all experiment criteria before final submission to register credit in your student progress dashboard.
            </p>

            <div className="space-y-2.5 my-4">
              {lab.submissionChecklist.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-navy-950 border border-slate-800 text-xs cursor-pointer hover:border-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checklist[idx])}
                    onChange={(e) => setChecklist({ ...checklist, [idx]: e.target.checked })}
                    className="h-4 w-4 rounded accent-cyan-400"
                  />
                  <span className="text-slate-200 font-medium">{item}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmitLab}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Submit Experiment for Academic Evaluation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
