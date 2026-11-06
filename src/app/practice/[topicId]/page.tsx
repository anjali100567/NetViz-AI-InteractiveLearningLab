'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  Clock, 
  Award, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { PRACTICE_QUESTIONS, PracticeQuestion } from '@/lib/content/practiceQuestions';
import { useUserProgress } from '@/lib/store/userProgressStore';

export default function PracticeRoundSessionPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = use(params);
  const { topicId } = resolvedParams;
  const { recordPracticeResult } = useUserProgress();

  // Filter questions for topic or use all questions
  const filtered = PRACTICE_QUESTIONS.filter(q => q.topicId === topicId);
  const questions: PracticeQuestion[] = filtered.length > 0 ? filtered : PRACTICE_QUESTIONS.slice(0, 10);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Timer
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    recordPracticeResult(isCorrect, currentQ.topicId);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsComplete(true);
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Final Report View
  if (isComplete) {
    const accuracy = Math.round((score / questions.length) * 100);
    const masteryStatus = accuracy >= 90 ? 'Mastered' : accuracy >= 75 ? 'Good Understanding' : accuracy >= 50 ? 'Needs Revision' : 'Repeat Guided Mode';

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-3xl bg-navy-900 border border-slate-800 p-8 shadow-2xl text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
            <Award className="h-8 w-8" />
          </div>

          <span className="text-xs font-mono uppercase font-bold text-cyan-400">PRACTICE ROUND REPORT</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Round Completed!</h1>
          <p className="text-sm text-slate-300 mt-2">
            Status: <strong className="text-emerald-400">{masteryStatus}</strong>
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
            <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800">
              <span className="text-3xl font-black text-emerald-400">{accuracy}%</span>
              <span className="text-[10px] text-slate-400 block font-mono uppercase mt-1">Accuracy</span>
            </div>
            <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800">
              <span className="text-3xl font-black text-cyan-400">{score}/{questions.length}</span>
              <span className="text-[10px] text-slate-400 block font-mono uppercase mt-1">Score</span>
            </div>
            <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800">
              <span className="text-3xl font-black text-amber-400">{formatTimer(secondsElapsed)}</span>
              <span className="text-[10px] text-slate-400 block font-mono uppercase mt-1">Time</span>
            </div>
            <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800">
              <span className="text-3xl font-black text-purple-400">{hintsUsedCount}</span>
              <span className="text-[10px] text-slate-400 block font-mono uppercase mt-1">Hints Used</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-5 rounded-2xl bg-navy-950 border border-cyan-500/30 text-left my-6">
            <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block mb-1">
              RECOMMENDED NEXT LESSON & LAB:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your answers, review <strong>TCP Sliding Window Flow Control</strong> and try <strong>Lab 3: ACK Loss & Retransmission</strong> to master lost ACK duplicate detection.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setIsAnswered(false);
                setShowHint(false);
                setScore(0);
                setSecondsElapsed(0);
                setIsComplete(false);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Round</span>
            </button>

            <Link
              href="/labs/lab-tcp-sliding-window"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              <BookOpen className="h-4 w-4" />
              <span>Go to Recommended Lab</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 text-xs font-medium"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Session Status Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link href="/practice" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Practice</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            {formatTimer(secondsElapsed)}
          </span>
          <span className="text-cyan-400 font-bold">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full my-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-navy-900 border border-slate-800 p-6 sm:p-8 shadow-xl mt-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            {currentQ.layer} Layer • {currentQ.difficulty}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Type: {currentQ.type}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = idx === currentQ.correctAnswer;

            let buttonStyle = 'border-slate-800 bg-navy-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800/40';

            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold';
              } else if (isSelected) {
                buttonStyle = 'border-rose-500 bg-rose-950/60 text-rose-300';
              } else {
                buttonStyle = 'border-slate-800 bg-navy-950/30 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${buttonStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hint Strip */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setShowHint(!showHint);
              if (!showHint) setHintsUsedCount(h => h + 1);
            }}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint (-0 pts)'}</span>
          </button>
        </div>

        {showHint && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            💡 <strong>Hint:</strong> {currentQ.hint}
          </div>
        )}

        {/* Answer Explanation once submitted */}
        {isAnswered && (
          <div className="mt-6 p-4 rounded-xl bg-navy-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-cyan-400 uppercase text-[10px] block mb-1 font-mono">
              CONCEPT EXPLANATION:
            </span>
            {currentQ.explanation}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              <span>{currentIndex === questions.length - 1 ? 'View Final Report' : 'Next Question'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
