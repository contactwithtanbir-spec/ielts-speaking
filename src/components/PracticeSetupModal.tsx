import React, { useState, useEffect } from 'react';
import { DifficultyLevel, IELTSPart, IELTSQuestion } from '../types';
import { sampleQuestions } from '../data/sampleData';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PracticeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (part: IELTSPart, difficulty: DifficultyLevel, customQuestion?: IELTSQuestion) => void;
}

export const PracticeSetupModal: React.FC<PracticeSetupModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  const [selectedPart, setSelectedPart] = useState<IELTSPart>('Part 2');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Medium');

  // Listen to Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const partsConfig: {
    id: IELTSPart;
    title: string;
    badge: string;
    time: string;
    desc: string;
    iconColor: string;
    bgColor: string;
  }[] = [
    {
      id: 'Part 1',
      title: 'Introduction & Interview',
      badge: 'Familiar Topics',
      time: '4-5 mins (45s per response)',
      desc: 'Answer natural questions about your hometown, daily routine, hobbies, and interests.',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'Part 2',
      title: 'Individual Long Turn',
      badge: 'Cue Card with 1-min Prep',
      time: '1 min prep + 2 mins talk',
      desc: 'Given an authentic IELTS Cue Card with 4 bullet points. Practice 1-minute planning and fluent delivery.',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'Part 3',
      title: 'Two-Way Discussion',
      badge: 'Analytical Debate',
      time: '4-5 mins (60s in-depth)',
      desc: 'Analyze societal issues, abstract concepts, and speculative trends linked to Part 2 themes.',
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  const difficultyConfig: {
    id: DifficultyLevel;
    label: string;
    color: string;
    badgeColor: string;
    desc: string;
  }[] = [
    {
      id: 'Easy',
      label: 'Easy',
      color: 'hover:border-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'Familiar themes, relaxed pace, direct questions',
    },
    {
      id: 'Medium',
      label: 'Medium',
      color: 'hover:border-indigo-300',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      desc: 'Standard authentic IELTS exam difficulty & format',
    },
    {
      id: 'Hard',
      label: 'Hard',
      color: 'hover:border-rose-300',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'Complex abstract topics requiring sophisticated vocabulary',
    },
  ];

  const handleStart = () => {
    const match = sampleQuestions.find(
      (q) => q.part === selectedPart && q.difficulty === selectedDifficulty
    );
    onStart(selectedPart, selectedDifficulty, match);
    onClose();
  };

  return (
    <div
      id="practice-setup-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
    >
      <div
        id="practice-setup-modal-card"
        className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-100 flex flex-col relative overflow-hidden my-auto"
      >
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 z-10" />

        {/* Fixed Header */}
        <div className="pt-6 pb-3 px-5 sm:px-7 shrink-0 border-b border-slate-100 flex items-start justify-between relative">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Setup</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              Choose Speaking Practice Mode
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an IELTS Speaking Part and difficulty level
            </p>
          </div>

          {/* Close Button */}
          <button
            id="setup-close-btn"
            onClick={onClose}
            className="p-2 -mr-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-5">
          {/* 1. Choose IELTS Part */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. Select IELTS Speaking Part
            </label>
            <div className="space-y-2.5">
              {partsConfig.map((part) => {
                const isSelected = selectedPart === part.id;
                return (
                  <div
                    key={part.id}
                    id={`setup-part-${part.id.replace(' ', '')}`}
                    onClick={() => setSelectedPart(part.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-200'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-sm">
                            {part.id}: {part.title}
                          </h3>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${part.bgColor} ${part.iconColor}`}
                          >
                            {part.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {part.desc}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400 mt-1">
                          ⏱ {part.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Choose Difficulty Option */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Choose Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {difficultyConfig.map((diff) => {
                const isSelected = selectedDifficulty === diff.id;
                return (
                  <button
                    type="button"
                    key={diff.id}
                    id={`setup-difficulty-${diff.id}`}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-1 ring-indigo-200'
                        : `border-slate-200 bg-slate-50/70 ${diff.color}`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{diff.label}</span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${diff.badgeColor}`}
                      >
                        {diff.id === 'Easy' ? '★☆☆' : diff.id === 'Medium' ? '★★☆' : '★★★'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                      {diff.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center gap-3 shrink-0">
          <button
            type="button"
            id="setup-cancel-btn"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            id="setup-start-session-btn"
            type="button"
            onClick={handleStart}
            className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 hover:from-blue-700 hover:via-indigo-700 hover:to-pink-600 text-white font-extrabold text-sm shadow-md shadow-indigo-200 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Practice Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
