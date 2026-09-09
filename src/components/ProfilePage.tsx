import React, { useState } from 'react';
import { PracticeSession, UserProfile } from '../types';
import {
  User,
  Mail,
  Target,
  BarChart2,
  Calendar,
  Save,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  sessions: PracticeSession[];
  onUpdateProfile: (updated: UserProfile) => void;
  onResetDemoData: () => void;
  onSwitchUser: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  sessions,
  onUpdateProfile,
  onResetDemoData,
  onSwitchUser,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [targetBand, setTargetBand] = useState<number>(user.targetBand);
  const [currentLevel, setCurrentLevel] = useState<string>(user.currentLevel);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const targetBandOptions = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  const levelOptions = [
    'Beginner (Band 4.0 - 4.5)',
    'Elementary (Band 5.0 - 5.5)',
    'Intermediate (Band 6.0 - 6.5)',
    'Upper-Intermediate (Band 7.0 - 7.5)',
    'Advanced (Band 8.0+)',
  ];

  const totalSpeakingSeconds = sessions.reduce((acc, s) => acc + s.audioDurationSeconds, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      targetBand,
      currentLevel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg shadow-indigo-100">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Candidate
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user.email}</p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                Target: Band {user.targetBand.toFixed(1)} • {user.currentLevel}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-center px-3 border-r border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Practices</p>
              <p className="text-lg font-black text-slate-900">{sessions.length}</p>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Band</p>
              <p className="text-lg font-black text-indigo-600">
                {sessions.length > 0
                  ? (sessions.reduce((acc, s) => acc + s.evaluation.overallBand, 0) / sessions.length).toFixed(1)
                  : 'N/A'}
              </p>
            </div>
            <div className="text-center px-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Spoken</p>
              <p className="text-lg font-black text-slate-900">{Math.round(totalSpeakingSeconds / 60)}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile & Target Band Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
        <h2 className="text-lg font-black text-slate-900 mb-1">IELTS Candidate Settings</h2>
        <p className="text-xs text-slate-500 mb-6">
          Adjust your target band and level so the AI coach adjusts grading stringency
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Candidate Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Target IELTS Band */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target IELTS Band Score
              </label>
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Band {targetBand.toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {targetBandOptions.map((band) => (
                <button
                  type="button"
                  key={band}
                  id={`profile-band-${band}`}
                  onClick={() => setTargetBand(band)}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    targetBand === band
                      ? 'bg-indigo-600 text-white border-transparent shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {band.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Current Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Speaking Proficiency Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {levelOptions.map((lvl) => {
                const isSelected = currentLevel.includes(lvl.split(' ')[0]);
                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setCurrentLevel(lvl.split(' ')[0])}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{lvl}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Changes saved successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </span>
            )}

            <button
              id="profile-save-btn"
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Management */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Demo Candidate Data</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset practice history to initial sample records (Miftahul Jannat Rijvee, Target 7.0)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="profile-reset-demo-btn"
            onClick={onResetDemoData}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            id="profile-switch-user-btn"
            onClick={onSwitchUser}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Register New User
          </button>
        </div>
      </div>
    </div>
  );
};
