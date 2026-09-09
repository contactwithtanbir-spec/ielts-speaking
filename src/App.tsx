import React, { useState, useEffect } from 'react';
import {
  DifficultyLevel,
  EvaluationResult,
  IELTSPart,
  IELTSQuestion,
  PageView,
  PracticeSession,
  UserProfile,
} from './types';
import { initialUser, samplePreviousSessions } from './data/sampleData';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { RegistrationPage } from './components/RegistrationPage';
import { DashboardPage } from './components/DashboardPage';
import { PracticeSetupModal } from './components/PracticeSetupModal';
import { SpeakingPracticePage } from './components/SpeakingPracticePage';
import { EvaluationPage } from './components/EvaluationPage';
import { ProgressPage } from './components/ProgressPage';
import { ProfilePage } from './components/ProfilePage';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';

const STORAGE_KEY_USER = 'ielts_coach_user_v1';
const STORAGE_KEY_SESSIONS = 'ielts_coach_sessions_v1';

export default function App() {
  // Load user from localStorage; if not found or empty, user is null
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name && parsed.name.trim().length > 0) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  // Load sessions from localStorage
  const [sessions, setSessions] = useState<PracticeSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Active page view (defaults to 'register' if no user profile exists, otherwise 'dashboard')
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name && parsed.name.trim().length > 0) {
          return 'dashboard';
        }
      }
    } catch {}
    return 'register';
  });

  // Currently inspected session for Evaluation Page
  const [activeSession, setActiveSession] = useState<PracticeSession | null>(() => {
    return samplePreviousSessions[0] || null;
  });

  // Modal setup state
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);

  // Practice state
  const [practiceConfig, setPracticeConfig] = useState<{
    part: IELTSPart;
    difficulty: DifficultyLevel;
    question?: IELTSQuestion;
  }>({
    part: 'Part 2',
    difficulty: 'Medium',
  });

  // Evaluating loading state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  // Handler: Start practice button click
  const handleOpenSetup = () => {
    if (!user) {
      setCurrentPage('register');
      return;
    }
    setIsSetupModalOpen(true);
  };

  // Handler: Safe page navigation ensuring profile exists before entering protected pages
  const handleNavigate = (page: PageView) => {
    if (!user && page !== 'landing') {
      setCurrentPage('register');
      return;
    }
    setCurrentPage(page);
  };

  // Handler: Confirm practice setup from modal
  const handleStartPracticeSession = (
    part: IELTSPart,
    difficulty: DifficultyLevel,
    question?: IELTSQuestion
  ) => {
    setPracticeConfig({ part, difficulty, question });
    setCurrentPage('practice');
  };

  // Handler: Finish Speaking Practice -> Call AI Evaluation
  const handleFinishPractice = async (data: {
    part: IELTSPart;
    difficulty: DifficultyLevel;
    topic: string;
    question: string;
    cuePoints?: string[];
    transcript: string;
    audioDurationSeconds: number;
    audioUrl?: string;
  }) => {
    if (!user) {
      setCurrentPage('register');
      return;
    }

    setIsEvaluating(true);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part: data.part,
          difficulty: data.difficulty,
          topic: data.topic,
          question: data.question,
          cuePoints: data.cuePoints,
          transcript: data.transcript,
          targetBand: user.targetBand,
          currentLevel: user.currentLevel,
        }),
      });

      const evalResult: EvaluationResult = await response.json();

      const newSession: PracticeSession = {
        id: `sess-${Date.now()}`,
        date: new Date().toISOString(),
        part: data.part,
        difficulty: data.difficulty,
        topic: data.topic,
        question: data.question,
        cuePoints: data.cuePoints,
        transcript: data.transcript,
        audioDurationSeconds: data.audioDurationSeconds,
        audioUrl: data.audioUrl,
        evaluation: evalResult,
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession);
      setCurrentPage('evaluation');
    } catch (err) {
      console.error('Failed to evaluate speaking response:', err);
      alert('Could not complete AI evaluation. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Handler: Register new user
  const handleRegister = (profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    } catch {}
    setCurrentPage('dashboard');
    // Open the practice setup modal automatically so the candidate can jump into practice
    setTimeout(() => {
      setIsSetupModalOpen(true);
    }, 450);
  };

  // Handler: Switch user / Log out
  const handleSwitchUser = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {}
    setCurrentPage('register');
  };

  // Handler: Reset demo data
  const handleResetDemoData = () => {
    setUser(initialUser);
    setSessions(samplePreviousSessions);
    setActiveSession(samplePreviousSessions[0]);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(initialUser));
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(samplePreviousSessions));
    } catch {}
    alert('Demo candidate loaded (Miftahul Jannat Rijvee, Target 7.0)');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onStartPractice={handleOpenSetup}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        {/* If no user profile exists yet: force Registration or Landing */}
        {!user ? (
          currentPage === 'landing' ? (
            <LandingPage
              onStart={() => setCurrentPage('register')}
              onGoToDashboard={() => setCurrentPage('register')}
              hasUser={false}
            />
          ) : (
            <RegistrationPage
              initialData={null}
              onRegister={handleRegister}
              onCancel={() => setCurrentPage('landing')}
            />
          )
        ) : (
          <>
            {/* Page 1: Landing Page */}
            {currentPage === 'landing' && (
              <LandingPage
                onStart={() => setCurrentPage('dashboard')}
                onGoToDashboard={() => setCurrentPage('dashboard')}
                hasUser={true}
              />
            )}

            {/* Page 2: Registration / Edit Profile Page */}
            {currentPage === 'register' && (
              <RegistrationPage
                initialData={user}
                onRegister={handleRegister}
                onCancel={() => setCurrentPage('dashboard')}
              />
            )}

            {/* Page 3: Dashboard Page */}
            {currentPage === 'dashboard' && (
              <DashboardPage
                user={user}
                sessions={sessions}
                onStartNewPractice={handleOpenSetup}
                onViewSession={(sess) => {
                  setActiveSession(sess);
                  setCurrentPage('evaluation');
                }}
                onViewProgress={() => setCurrentPage('progress')}
              />
            )}

            {/* Page 4: Speaking Practice Page */}
            {currentPage === 'practice' && (
              <SpeakingPracticePage
                user={user}
                part={practiceConfig.part}
                difficulty={practiceConfig.difficulty}
                question={practiceConfig.question}
                onFinishPractice={handleFinishPractice}
                onChangeQuestion={handleOpenSetup}
                onBackToDashboard={() => setCurrentPage('dashboard')}
              />
            )}

            {/* Page 5: AI Evaluation Page */}
            {currentPage === 'evaluation' && activeSession && (
              <EvaluationPage
                user={user}
                session={activeSession}
                onPracticeAgain={handleOpenSetup}
                onViewProgress={() => setCurrentPage('progress')}
                onBackToDashboard={() => setCurrentPage('dashboard')}
              />
            )}

            {/* Page 6: Progress Page */}
            {currentPage === 'progress' && (
              <ProgressPage
                user={user}
                sessions={sessions}
                onViewSession={(sess) => {
                  setActiveSession(sess);
                  setCurrentPage('evaluation');
                }}
                onStartNewPractice={handleOpenSetup}
              />
            )}

            {/* Page 7: Profile Page */}
            {currentPage === 'profile' && (
              <ProfilePage
                user={user}
                sessions={sessions}
                onUpdateProfile={(updated) => setUser(updated)}
                onResetDemoData={handleResetDemoData}
                onSwitchUser={handleSwitchUser}
              />
            )}
          </>
        )}
      </main>

      {/* Practice Setup Modal */}
      <PracticeSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStart={handleStartPracticeSession}
      />

      {/* Evaluating Loading Overlay */}
      {isEvaluating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-md w-full text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 animate-spin blur-xs opacity-75" />
              <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-md">
                <BrainCircuit className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                AI Examiner is Evaluating
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Analyzing your spoken response across Fluency & Coherence, Lexical Resource, Grammar, and Pronunciation...
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Band Score & Diagnostics...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
