import React from 'react';
import { PracticeSession, UserProfile } from '../types';
import { Sparkles, Mic, Target, Award, Calendar, ArrowRight, TrendingUp, CheckCircle, Clock, ChevronRight } from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile;
  sessions: PracticeSession[];
  onStartNewPractice: () => void;
  onViewSession: (session: PracticeSession) => void;
  onViewProgress: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  sessions,
  onStartNewPractice,
  onViewSession,
  onViewProgress,
}) => {
  const latestSession = sessions[0] || null;

  // Calculate average band
  const avgBand = sessions.length > 0
    ? (sessions.reduce((acc, s) => acc + s.evaluation.overallBand, 0) / sessions.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 p-6 sm:p-10 text-white shadow-xl shadow-indigo-200">
        {/* Subtle background circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for your next IELTS speaking challenge</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome, {user.name}!
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 mt-2 max-w-xl">
              Targeting <span className="font-bold text-white underline decoration-amber-300 decoration-2">Band {user.targetBand.toFixed(1)}</span> • Current Level: <span className="font-semibold text-white">{user.currentLevel}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="dashboard-start-practice-hero-btn"
              onClick={onStartNewPractice}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-900/20 active:scale-98 transition-all cursor-pointer"
            >
              <Mic className="w-5 h-5 text-indigo-600" />
              <span>Start New Practice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Target Band Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target IELTS Band</p>
            <p className="text-3xl font-black text-slate-900 mt-1">Band {user.targetBand.toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-1">Examiner calibrated benchmark</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold shadow-xs">
            <Target className="w-7 h-7" />
          </div>
        </div>

        {/* Recent Practice Score Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Practice Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-indigo-600">
                {latestSession ? `Band ${latestSession.evaluation.overallBand.toFixed(1)}` : 'N/A'}
              </span>
              {latestSession && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {latestSession.part}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {latestSession ? `Completed ${new Date(latestSession.date).toLocaleDateString()}` : 'No practices yet'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
            <Award className="w-7 h-7" />
          </div>
        </div>

        {/* Average Band / Progress */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Performance</p>
            <p className="text-3xl font-black text-slate-900 mt-1">Band {avgBand}</p>
            <p className="text-xs text-slate-400 mt-1">{sessions.length} total speaking sessions logged</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-xs">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Latest Evaluation Spotlight (if available) */}
      {latestSession && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-indigo-100 text-indigo-700">
                  {latestSession.part}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                  {latestSession.difficulty}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(latestSession.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Latest Evaluation: {latestSession.topic}
              </h2>
            </div>

            <button
              id="dashboard-view-latest-eval-btn"
              onClick={() => onViewSession(latestSession)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <span>View Full Feedback & Corrections</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Criteria Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Fluency & Coherence</p>
              <p className="text-2xl font-black text-blue-900 mt-1">
                {latestSession.evaluation.criteria.fluencyCoherence.band.toFixed(1)}
              </p>
              <p className="text-xs text-blue-700/80 mt-1 line-clamp-2">
                {latestSession.evaluation.criteria.fluencyCoherence.feedback}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Lexical Resource</p>
              <p className="text-2xl font-black text-purple-900 mt-1">
                {latestSession.evaluation.criteria.lexicalResource.band.toFixed(1)}
              </p>
              <p className="text-xs text-purple-700/80 mt-1 line-clamp-2">
                {latestSession.evaluation.criteria.lexicalResource.feedback}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100">
              <p className="text-xs font-bold text-pink-700 uppercase tracking-wider">Grammatical Range</p>
              <p className="text-2xl font-black text-pink-900 mt-1">
                {latestSession.evaluation.criteria.grammaticalRangeAccuracy.band.toFixed(1)}
              </p>
              <p className="text-xs text-pink-700/80 mt-1 line-clamp-2">
                {latestSession.evaluation.criteria.grammaticalRangeAccuracy.feedback}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pronunciation</p>
              <p className="text-2xl font-black text-amber-900 mt-1">
                {latestSession.evaluation.criteria.pronunciation.band.toFixed(1)}
              </p>
              <p className="text-xs text-amber-700/80 mt-1 line-clamp-2">
                {latestSession.evaluation.criteria.pronunciation.feedback}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Practice Sessions List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Recent Practice Sessions</h2>
            <p className="text-xs sm:text-sm text-slate-500">Review past attempts and track your progress over time</p>
          </div>
          <button
            id="dashboard-see-all-progress-btn"
            onClick={onViewProgress}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View All Progress
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Mic className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-bold">No practice sessions completed yet</p>
            <p className="text-xs text-slate-400 mt-1">Start your first speaking practice to unlock detailed AI coaching</p>
            <button
              onClick={onStartNewPractice}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Start First Practice
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                id={`session-item-${sess.id}`}
                onClick={() => onViewSession(sess)}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 -mx-3 px-3 rounded-2xl transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 transition-colors">
                    {sess.evaluation.overallBand.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {sess.part}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {sess.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {sess.audioDurationSeconds}s spoken
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
                  <span className="text-xs text-slate-400">
                    {new Date(sess.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
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
