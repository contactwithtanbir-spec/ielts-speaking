import React from 'react';
import { Sparkles, Mic, Award, ArrowRight, CheckCircle2, MessageSquare, BrainCircuit, Headphones, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  onGoToDashboard?: () => void;
  hasUser: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onGoToDashboard, hasUser }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="pt-6 sm:pt-12 pb-12 sm:pb-16 text-center max-w-4xl mx-auto">
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          <span>IELTS Speaking Band 9 Evaluation Engine</span>
        </div>

        {/* Main Logo & Name */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Mic className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            IELTS Speaking Coach <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">AI</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-3">
          “Practice speaking. Get smarter feedback.”
        </p>

        {/* Short description */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Master IELTS Speaking with simulated Part 1, 2, and 3 interviews. Speak naturally, receive live transcripts, and get actionable coaching across Fluency, Vocabulary, Grammar, and Pronunciation.
        </p>

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="landing-start-practice-btn"
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 hover:from-blue-700 hover:via-indigo-700 hover:to-pink-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Practice</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          {hasUser && onGoToDashboard && (
            <button
              id="landing-view-dashboard-btn"
              onClick={onGoToDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <span>Go to My Dashboard</span>
            </button>
          )}
        </div>

        {/* Highlight Tags */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 text-blue-700 border border-blue-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Official 4-Criteria Rubric
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50/80 text-purple-700 border border-purple-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Part 2 Cue Cards with Timer
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50/80 text-pink-700 border border-pink-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" /> Instant Band Score Diagnostics
          </span>
        </div>
      </div>

      {/* Simple "How It Works" Section */}
      <div className="py-12 border-t border-slate-200/80">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Three simple steps to elevate your spoken English band score
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div
            id="how-it-works-step-1"
            className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
              <Compass className="w-6 h-6 text-blue-600" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider mb-2">
              Step 1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Choose Part & Topic</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Select IELTS Speaking Part 1, Part 2 (cue card with 1-min preparation), or Part 3 analytical questions with customizable difficulty.
            </p>
          </div>

          {/* Step 2 */}
          <div
            id="how-it-works-step-2"
            className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4">
              <Headphones className="w-6 h-6 text-purple-600" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 uppercase tracking-wider mb-2">
              Step 2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Speak Naturally</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Tap the large microphone button to record your answer. View the live transcript as you speak, with smart audio fallback support.
            </p>
          </div>

          {/* Step 3 */}
          <div
            id="how-it-works-step-3"
            className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-lg mb-4">
              <Award className="w-6 h-6 text-pink-600" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-pink-50 text-pink-700 uppercase tracking-wider mb-2">
              Step 3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Get AI Feedback</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Receive your estimated Band score, individual ratings across all 4 criteria, grammar corrections, advanced vocabulary, and native rewrites.
            </p>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-slate-400 py-6 border-t border-slate-100">
        <p>IELTS Speaking Coach AI • Empowering candidates worldwide to achieve their target band.</p>
        <p className="mt-1 text-[11px] text-slate-400">
          Scores provided are AI-estimated evaluations for self-study and practice, not official IELTS test results.
        </p>
      </div>
    </div>
  );
};
