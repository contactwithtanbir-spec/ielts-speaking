import React from 'react';
import { PageView, UserProfile } from '../types';
import { Sparkles, Mic, LayoutDashboard, TrendingUp, User, Home, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  user: UserProfile | null;
  onStartPractice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  user,
  onStartPractice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          id="nav-brand-logo"
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
            <Mic className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
              IELTS Speaking Coach
            </span>
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 uppercase tracking-wider">
              AI
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              id="nav-btn-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              id="nav-btn-practice"
              onClick={() => onNavigate('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentPage === 'practice'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Mic className="w-4 h-4" />
              Practice
            </button>

            <button
              id="nav-btn-progress"
              onClick={() => onNavigate('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentPage === 'progress'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Progress
            </button>

            <button
              id="nav-btn-profile"
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentPage === 'profile'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <button
              id="nav-btn-landing-home"
              onClick={() => onNavigate('landing')}
              className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPage === 'landing'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              id="nav-btn-landing-register"
              onClick={() => onNavigate('register')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Create Profile</span>
            </button>
          </nav>
        )}

        {/* Right side CTA or User pill */}
        {user && (
          <div className="flex items-center gap-3">
            <button
              id="header-start-practice-btn"
              onClick={onStartPractice}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 rounded-xl hover:opacity-95 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Practice</span>
            </button>

            <button
              id="header-profile-avatar-btn"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
              title="View Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] font-medium text-indigo-600 leading-tight">
                  Target Band {user.targetBand.toFixed(1)}
                </p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation for authenticated user */}
      {user && (
        <div className="md:hidden border-t border-slate-100 bg-white px-2 py-1 flex items-center justify-around">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center py-1 px-3 text-[11px] font-semibold ${
              currentPage === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('practice')}
            className={`flex flex-col items-center py-1 px-3 text-[11px] font-semibold ${
              currentPage === 'practice' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <Mic className="w-4 h-4" />
            Practice
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`flex flex-col items-center py-1 px-3 text-[11px] font-semibold ${
              currentPage === 'progress' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Progress
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center py-1 px-3 text-[11px] font-semibold ${
              currentPage === 'profile' ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
        </div>
      )}
    </header>
  );
};
