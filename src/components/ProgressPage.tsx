import React, { useState } from 'react';
import { PracticeSession, UserProfile } from '../types';
import {
  TrendingUp,
  Award,
  Sparkles,
  BarChart3,
  Calendar,
  Clock,
  ArrowUpRight,
  Filter,
  ChevronRight,
  Target,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';

interface ProgressPageProps {
  user: UserProfile;
  sessions: PracticeSession[];
  onViewSession: (session: PracticeSession) => void;
  onStartNewPractice: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  user,
  sessions,
  onViewSession,
  onStartNewPractice,
}) => {
  const [filterPart, setFilterPart] = useState<'All' | 'Part 1' | 'Part 2' | 'Part 3'>('All');

  const filteredSessions = sessions.filter((s) => {
    if (filterPart === 'All') return true;
    return s.part === filterPart;
  });

  // Criteria calculations
  const calculateAverageCriteria = () => {
    if (sessions.length === 0) return { fc: 0, lr: 0, gra: 0, pr: 0, overall: 0 };
    let fc = 0, lr = 0, gra = 0, pr = 0, overall = 0;
    sessions.forEach((s) => {
      fc += s.evaluation.criteria.fluencyCoherence.band;
      lr += s.evaluation.criteria.lexicalResource.band;
      gra += s.evaluation.criteria.grammaticalRangeAccuracy.band;
      pr += s.evaluation.criteria.pronunciation.band;
      overall += s.evaluation.overallBand;
    });
    const len = sessions.length;
    return {
      fc: +(fc / len).toFixed(1),
      lr: +(lr / len).toFixed(1),
      gra: +(gra / len).toFixed(1),
      pr: +(pr / len).toFixed(1),
      overall: +(overall / len).toFixed(1),
    };
  };

  const avgs = calculateAverageCriteria();

  // Dynamic AI summary generation based on candidate's data
  const generateAISummary = () => {
    if (sessions.length === 0) {
      return "Start your first IELTS practice session to unlock personalized AI diagnostic insights on your fluency, grammar, and vocabulary trajectory.";
    }

    const firstScore = sessions[sessions.length - 1].evaluation.overallBand;
    const latestScore = sessions[0].evaluation.overallBand;
    const diff = latestScore - firstScore;

    let growthText = '';
    if (diff > 0) {
      growthText = `You have demonstrated an impressive upward trajectory (+${diff.toFixed(1)} Band improvement) from Band ${firstScore.toFixed(1)} to Band ${latestScore.toFixed(1)}.`;
    } else if (diff === 0) {
      growthText = `You have maintained consistent performance at Band ${latestScore.toFixed(1)}, showing stable proficiency across diverse prompts.`;
    } else {
      growthText = `Your recent practice scored Band ${latestScore.toFixed(1)}, highlighting opportunities to reinforce lexical precision on harder topics.`;
    }

    const strongCriteria =
      avgs.lr >= avgs.gra && avgs.lr >= avgs.fc && avgs.lr >= avgs.pr
        ? 'Lexical Resource'
        : avgs.fc >= avgs.gra && avgs.fc >= avgs.pr
        ? 'Fluency & Coherence'
        : avgs.pr >= avgs.gra
        ? 'Pronunciation'
        : 'Grammatical Range & Accuracy';

    const focusCriteria =
      avgs.gra <= avgs.fc && avgs.gra <= avgs.lr && avgs.gra <= avgs.pr
        ? 'Grammatical Range & Accuracy'
        : avgs.pr <= avgs.fc && avgs.pr <= avgs.lr
        ? 'Pronunciation'
        : avgs.fc <= avgs.lr
        ? 'Fluency & Coherence'
        : 'Lexical Resource';

    return `${growthText} Your strongest assessment pillar is currently ${strongCriteria} (Avg ${Math.max(avgs.fc, avgs.lr, avgs.gra, avgs.pr).toFixed(1)}), characterized by natural idiomatic usage. To bridge the gap toward your Target Band ${user.targetBand.toFixed(1)}, prioritize ${focusCriteria} by reducing minor structural agreement slips and incorporating complex conditional clauses during Part 2 long turns.`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Progress & Performance Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Speaking Progress & Improvement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking your trajectory toward IELTS Band {user.targetBand.toFixed(1)}
          </p>
        </div>

        <button
          id="progress-start-practice-btn"
          onClick={onStartNewPractice}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 hover:from-blue-700 hover:via-indigo-700 hover:to-pink-600 text-white font-extrabold text-sm shadow-md shadow-indigo-100 active:scale-98 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Practice Session</span>
        </button>
      </div>

      {/* AI SUMMARY OF IMPROVEMENT CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 shrink-0 border border-white/10">
            <BrainCircuit className="w-6 h-6" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-200">
                AI Coach Intelligence Summary
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Active Assessment
              </span>
            </div>
            <p className="text-sm sm:text-base text-indigo-50 leading-relaxed font-medium">
              {generateAISummary()}
            </p>
          </div>
        </div>
      </div>

      {/* OVERALL STATS & CRITERIA RADAR/BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overall Metrics */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900">
            Overall Benchmark
          </h2>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Band</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">
                Band {avgs.overall.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Across {sessions.length} recorded tests</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target IELTS Band</p>
              <p className="text-3xl font-black text-pink-600 mt-1">
                Band {user.targetBand.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Gap: {Math.max(0, user.targetBand - avgs.overall).toFixed(1)} band to target
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Right Column: 4 Criteria Progress Bars */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Average Scores by IELTS Assessment Criteria
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Max 9.0</span>
          </div>

          <div className="space-y-4">
            {/* 1. Fluency & Coherence */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Fluency & Coherence</span>
                <span className="text-blue-600 font-extrabold">Band {avgs.fc.toFixed(1)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(avgs.fc / 9) * 100}%` }}
                />
              </div>
            </div>

            {/* 2. Lexical Resource */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Lexical Resource (Vocabulary)</span>
                <span className="text-purple-600 font-extrabold">Band {avgs.lr.toFixed(1)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${(avgs.lr / 9) * 100}%` }}
                />
              </div>
            </div>

            {/* 3. Grammatical Range & Accuracy */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Grammatical Range & Accuracy</span>
                <span className="text-pink-600 font-extrabold">Band {avgs.gra.toFixed(1)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-500"
                  style={{ width: `${(avgs.gra / 9) * 100}%` }}
                />
              </div>
            </div>

            {/* 4. Pronunciation */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700">Pronunciation</span>
                <span className="text-amber-600 font-extrabold">Band {avgs.pr.toFixed(1)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(avgs.pr / 9) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SESSION TIMELINE & HISTORY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Practice History & Evaluated Transcripts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select any past session to review detailed examiner feedback
            </p>
          </div>

          {/* Part Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Part 1', 'Part 2', 'Part 3'] as const).map((part) => (
              <button
                key={part}
                id={`progress-filter-${part.replace(' ', '')}`}
                onClick={() => setFilterPart(part)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterPart === part
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-bold text-slate-600">No sessions match this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredSessions.map((sess) => (
              <div
                key={sess.id}
                id={`history-card-${sess.id}`}
                onClick={() => onViewSession(sess)}
                className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/60 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 flex flex-col items-center justify-center shrink-0 transition-colors">
                    <span className="text-base font-black leading-none">
                      {sess.evaluation.overallBand.toFixed(1)}
                    </span>
                    <span className="text-[9px] font-bold uppercase mt-0.5">Band</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {sess.part}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {sess.difficulty}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(sess.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
                      {sess.topic}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      "{sess.question}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="px-2 py-1 rounded bg-slate-100">FC: {sess.evaluation.criteria.fluencyCoherence.band.toFixed(1)}</span>
                    <span className="px-2 py-1 rounded bg-slate-100">LR: {sess.evaluation.criteria.lexicalResource.band.toFixed(1)}</span>
                    <span className="px-2 py-1 rounded bg-slate-100">GRA: {sess.evaluation.criteria.grammaticalRangeAccuracy.band.toFixed(1)}</span>
                    <span className="px-2 py-1 rounded bg-slate-100">PR: {sess.evaluation.criteria.pronunciation.band.toFixed(1)}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
