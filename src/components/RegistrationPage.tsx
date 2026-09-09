import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Target, BarChart2, ArrowRight, Sparkles, Check } from 'lucide-react';

interface RegistrationPageProps {
  initialData?: UserProfile | null;
  onRegister: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  initialData,
  onRegister,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [targetBand, setTargetBand] = useState<number>(initialData?.targetBand || 7.0);
  const [currentLevel, setCurrentLevel] = useState<string>(initialData?.currentLevel || 'Intermediate');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const targetBandOptions = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  const levelOptions = [
    { value: 'Beginner', label: 'Beginner (Band 4.0 - 4.5)', desc: 'Basic everyday phrases with hesitation' },
    { value: 'Elementary', label: 'Elementary (Band 5.0 - 5.5)', desc: 'Can express simple ideas on familiar topics' },
    { value: 'Intermediate', label: 'Intermediate (Band 6.0 - 6.5)', desc: 'Comfortable speaking with minor grammatical slips' },
    { value: 'Upper-Intermediate', label: 'Upper-Intermediate (Band 7.0 - 7.5)', desc: 'Fluent discussion with good vocabulary range' },
    { value: 'Advanced', label: 'Advanced (Band 8.0+)', desc: 'Near-native fluency, precision, and natural idioms' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRegister({
      name: name.trim(),
      email: email.trim(),
      targetBand,
      currentLevel,
      joinedDate: initialData?.joinedDate || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl shadow-slate-100/70 relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            Step 1: Candidate Profile Required
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Your IELTS Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
            Please enter your basic information before starting practice so the AI examiner can calibrate questions and evaluate your speaking accurately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Enter your full name (e.g. Tanbir Ahmed)"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-indigo-500'
                } rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 transition-all`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-500 font-medium mt-1.5">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="Enter your email (e.g. candidate@example.com)"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-indigo-500'
                } rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 transition-all`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 font-medium mt-1.5">{errors.email}</p>}
          </div>

          {/* Target IELTS Band */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="target-band-select" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-pink-500" />
                Target IELTS Band
              </label>
              <span className="text-sm font-extrabold px-2.5 py-0.5 rounded-lg bg-pink-100 text-pink-800">
                Band {targetBand.toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {targetBandOptions.map((band) => (
                <button
                  type="button"
                  key={band}
                  id={`target-band-${band}`}
                  onClick={() => setTargetBand(band)}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                    targetBand === band
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {band.toFixed(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Current Speaking Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              Current Speaking Level
            </label>
            <div className="space-y-2">
              {levelOptions.map((lvl) => {
                const isSelected = currentLevel.includes(lvl.value);
                return (
                  <label
                    key={lvl.value}
                    onClick={() => setCurrentLevel(lvl.value)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-200'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{lvl.label}</p>
                        <p className="text-xs text-slate-500">{lvl.desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-2">
            <button
              id="reg-continue-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 hover:from-blue-700 hover:via-indigo-700 hover:to-pink-600 text-white font-bold text-base shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer active:scale-98"
            >
              <span>Create Profile & Start Practice</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 mt-3 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
