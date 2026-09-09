import React, { useState, useEffect, useRef } from 'react';
import { DifficultyLevel, IELTSPart, IELTSQuestion, UserProfile } from '../types';
import { sampleQuestions } from '../data/sampleData';
import {
  Mic,
  MicOff,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  Volume2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Check,
  Radio
} from 'lucide-react';

interface SpeakingPracticePageProps {
  user: UserProfile;
  part: IELTSPart;
  difficulty: DifficultyLevel;
  question?: IELTSQuestion;
  onFinishPractice: (data: {
    part: IELTSPart;
    difficulty: DifficultyLevel;
    topic: string;
    question: string;
    cuePoints?: string[];
    transcript: string;
    audioDurationSeconds: number;
    audioUrl?: string;
  }) => void;
  onChangeQuestion: () => void;
  onBackToDashboard: () => void;
}

export const SpeakingPracticePage: React.FC<SpeakingPracticePageProps> = ({
  user,
  part,
  difficulty,
  question: initialQuestion,
  onFinishPractice,
  onChangeQuestion,
  onBackToDashboard,
}) => {
  // Current question
  const [currentQuestion, setCurrentQuestion] = useState<IELTSQuestion>(() => {
    if (initialQuestion) return initialQuestion;
    const match = sampleQuestions.find((q) => q.part === part && q.difficulty === difficulty);
    return (
      match ||
      sampleQuestions.find((q) => q.part === part) ||
      sampleQuestions[0]
    );
  });

  // Preparation Timer (for Part 2)
  const isPart2 = currentQuestion.part === 'Part 2';
  const [prepTimeLeft, setPrepTimeLeft] = useState<number>(60);
  const [isPrepActive, setIsPrepActive] = useState<boolean>(false);
  const [prepCompleted, setPrepCompleted] = useState<boolean>(!isPart2);

  // Speaking Recording Timer
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);

  // Live audio volume level for live visualizer (0 - 100)
  const [audioVolume, setAudioVolume] = useState<number>(0);

  // Transcript state
  const [transcript, setTranscript] = useState<string>('');
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);

  // Recorded audio state
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Follow-up question state
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState<boolean>(false);

  // References
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const accumulatedTranscriptRef = useRef<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Sync isRecording ref
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Keep accumulated transcript in sync if user edits manually
  const handleTranscriptChange = (newVal: string) => {
    setTranscript(newVal);
    accumulatedTranscriptRef.current = newVal;
  };

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + ' ';
          } else {
            interimText += res[0].transcript;
          }
        }

        if (finalChunk) {
          accumulatedTranscriptRef.current = (
            accumulatedTranscriptRef.current + ' ' + finalChunk
          ).replace(/\s+/g, ' ').trim();
        }

        const fullDisplay = (
          accumulatedTranscriptRef.current + (interimText ? ' ' + interimText : '')
        ).replace(/\s+/g, ' ').trim();

        setTranscript(fullDisplay);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning/error:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionDenied(true);
          setIsRecording(false);
        }
      };

      // When browser pauses or speech recognition stops unexpectedly, restart if still recording
      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already active or restarting
          }
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init failed:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, []);

  // Preparation timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isPrepActive && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPrepActive && prepTimeLeft === 0) {
      setIsPrepActive(false);
      setPrepCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isPrepActive, prepTimeLeft]);

  // Speaking recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSpeakingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Audio Volume Meter monitoring
  const monitorVolume = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    // Normalize to 0 - 100
    setAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));

    if (isRecordingRef.current) {
      animFrameRef.current = requestAnimationFrame(monitorVolume);
    } else {
      setAudioVolume(0);
    }
  };

  // Start / Stop Recording
  const toggleRecording = async () => {
    if (isRecording) {
      // STOP RECORDING
      setIsRecording(false);
      isRecordingRef.current = false;
      setAudioVolume(0);

      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      // Stop MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }

      // Stop mic tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    } else {
      // START RECORDING
      setMicPermissionDenied(false);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Set up real audio recording via MediaRecorder
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (audioBlob.size > 0) {
            const url = URL.createObjectURL(audioBlob);
            setRecordedAudioUrl(url);
          }
        };
        mediaRecorder.start(250);
        mediaRecorderRef.current = mediaRecorder;

        // Set up Web Audio Analyser for live visualizer
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;
          monitorVolume();
        } catch (err) {
          console.warn('AudioContext volume meter setup skipped:', err);
        }

        // Start Web Speech Recognition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // If already running
          }
        }

        setIsRecording(true);
        isRecordingRef.current = true;
      } catch (err: any) {
        console.warn('Microphone access failed:', err);
        setMicPermissionDenied(true);
      }
    }
  };

  // Request AI Follow-up Question
  const handleAskFollowUp = async () => {
    if (!transcript.trim()) return;
    setIsLoadingFollowUp(true);
    try {
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          transcript,
          part: currentQuestion.part,
        }),
      });
      const data = await res.json();
      if (data.followUpQuestion) {
        setFollowUpQuestion(data.followUpQuestion);
      }
    } catch (e) {
      setFollowUpQuestion("Can you expand on how this specific experience influenced your mindset going forward?");
    } finally {
      setIsLoadingFollowUp(false);
    }
  };

  // Cycle question
  const handleNextQuestion = () => {
    const pool = sampleQuestions.filter((q) => q.part === part);
    const currentIndex = pool.findIndex((q) => q.id === currentQuestion.id);
    const nextIndex = (currentIndex + 1) % pool.length;
    setCurrentQuestion(pool[nextIndex]);
    setTranscript('');
    accumulatedTranscriptRef.current = '';
    setSpeakingSeconds(0);
    setPrepTimeLeft(60);
    setIsPrepActive(false);
    setPrepCompleted(!isPart2);
    setFollowUpQuestion(null);
    setRecordedAudioUrl(null);
  };

  // Finish practice
  const handleFinish = () => {
    if (!transcript.trim()) {
      alert('Please speak into the microphone or enter what you said before requesting evaluation.');
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      isRecordingRef.current = false;
      try {
        recognitionRef.current?.stop();
        mediaRecorderRef.current?.stop();
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      } catch {}
    }
    onFinishPractice({
      part: currentQuestion.part,
      difficulty: currentQuestion.difficulty,
      topic: currentQuestion.topic,
      question: currentQuestion.question,
      cuePoints: currentQuestion.cuePoints,
      transcript: transcript.trim(),
      audioDurationSeconds: Math.max(speakingSeconds, 5),
      audioUrl: recordedAudioUrl || undefined,
    });
  };

  // Format seconds mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Session Breadcrumb & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-xs">
            {currentQuestion.part}
          </span>
          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800">
            {currentQuestion.difficulty} Difficulty
          </span>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
            {currentQuestion.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="practice-switch-question-btn"
            onClick={handleNextQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Try another question for this part"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next Question</span>
          </button>
          <button
            id="practice-exit-btn"
            onClick={onBackToDashboard}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* QUESTION CARD / IELTS CUE CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md relative overflow-hidden">
        {/* Colorful accent band */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500" />

        {isPart2 ? (
          /* Real IELTS Candidate Task Card for Part 2 */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                IELTS Speaking • Candidate Task Card
              </span>
              <span className="text-xs font-bold text-slate-400">
                Target: 1-2 minutes talk
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-100/80">
              <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2.5">
                You should say:
              </p>
              <ul className="space-y-2">
                {currentQuestion.cuePoints?.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Part 2 Preparation Timer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                  isPrepActive ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    1-Minute Preparation Time
                  </p>
                  <p className="text-xs text-slate-500">
                    {prepTimeLeft > 0
                      ? `${prepTimeLeft}s remaining to organize your notes`
                      : 'Preparation complete! You may now begin speaking.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isPrepActive && prepTimeLeft === 60 && (
                  <button
                    id="prep-start-btn"
                    onClick={() => setIsPrepActive(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Start 1-Min Prep
                  </button>
                )}
                {isPrepActive && (
                  <button
                    id="prep-pause-btn"
                    onClick={() => setIsPrepActive(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Pause
                  </button>
                )}
                <button
                  id="prep-skip-btn"
                  onClick={() => {
                    setIsPrepActive(false);
                    setPrepTimeLeft(0);
                    setPrepCompleted(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Skip Prep
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Part 1 or Part 3 Question Display */
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                {currentQuestion.part === 'Part 1' ? 'IELTS Part 1 • Everyday Questions' : 'IELTS Part 3 • Analytical Discussion'}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Recommended: {currentQuestion.recommendedSpeakingSeconds}s
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>

            {currentQuestion.cuePoints && currentQuestion.cuePoints.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Discussion Angles:</p>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.cuePoints.map((pt, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700">
                      • {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CENTERPIECE: LARGE MICROPHONE BUTTON & RECORDING CONTROLS */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center relative">
        {/* Speaking Duration Status */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-300'}`} />
          <span className="text-sm font-black tracking-wider text-slate-700 font-mono">
            {formatTime(speakingSeconds)}
          </span>
          <span className="text-xs text-slate-400">
            / {formatTime(currentQuestion.recommendedSpeakingSeconds)} recommended
          </span>
        </div>

        {/* Live Audio Activity Waveform / Level Meter */}
        {isRecording && (
          <div className="flex items-center justify-center gap-1 mb-5 h-6">
            {[40, 70, 90, 60, 80, 50, 95, 65, 75, 45, 85].map((baseHeight, idx) => {
              const activeScale = Math.max(0.2, (audioVolume / 100) * (baseHeight / 100));
              return (
                <div
                  key={idx}
                  className="w-1.5 rounded-full bg-gradient-to-t from-rose-500 to-pink-500 transition-all duration-75"
                  style={{
                    height: `${Math.round(activeScale * 24) + 4}px`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Big Mic Button */}
        <div className="relative mb-6">
          {/* Pulsing ring animation when recording */}
          {isRecording && (
            <>
              <div className="absolute -inset-4 rounded-full bg-rose-400/20 animate-ping duration-1000 pointer-events-none" />
              <div className="absolute -inset-2 rounded-full bg-pink-500/30 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            id="practice-mic-toggle-btn"
            onClick={toggleRecording}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-xl cursor-pointer ${
              isRecording
                ? 'bg-gradient-to-tr from-rose-500 via-pink-600 to-rose-600 text-white shadow-rose-200 hover:brightness-105'
                : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 text-white shadow-indigo-200 hover:scale-105'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider mt-1">
                  Stop
                </span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
                <span className="text-[11px] font-black uppercase tracking-wider mt-1">
                  Tap to Speak
                </span>
              </>
            )}
          </button>
        </div>

        {/* Live Indicator / Action Text */}
        <div className="text-center">
          <p className="text-base font-bold text-slate-800">
            {isRecording
              ? 'Examiner is listening to your actual voice...'
              : 'Click the microphone button and speak your answer clearly'}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            {isRecording
              ? 'Every word you say is being captured and transcribed below for real IELTS evaluation.'
              : 'Take a breath, organize your points, and tap the microphone when ready.'}
          </p>
        </div>

        {/* Microphone permission notice if denied */}
        {micPermissionDenied && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Microphone access was not granted. Please allow microphone permission in your browser or type your spoken words in the transcript box below.
            </span>
          </div>
        )}
      </div>

      {/* TRANSCRIPT & RESPONSE AREA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Exact Words Spoken (Transcript)
            </h3>
            {transcript && (
              <span className="text-xs text-slate-400 font-semibold">
                ({transcript.trim().split(/\s+/).filter(Boolean).length} words)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {transcript && (
              <button
                id="practice-clear-transcript-btn"
                onClick={() => {
                  setTranscript('');
                  accumulatedTranscriptRef.current = '';
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Editable / Live Transcript Textarea */}
        <div className="relative">
          <textarea
            id="practice-transcript-input"
            rows={4}
            value={transcript}
            onChange={(e) => handleTranscriptChange(e.target.value)}
            placeholder="As you speak into the microphone, your exact words appear here in real time. You can also touch up any transcribed words before submitting..."
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-y"
          />
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Live Listening...</span>
            </div>
          )}
        </div>

        {/* Examiner Follow-Up Section (if requested) */}
        {followUpQuestion && (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2">
            <div className="flex items-center gap-2 text-purple-800 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Examiner Follow-Up Question</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              "{followUpQuestion}"
            </p>
            <p className="text-xs text-purple-700/80">
              You can tap the microphone to continue speaking, or finish for your score.
            </p>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Ask Follow-up Option */}
          <button
            id="practice-ask-followup-btn"
            onClick={handleAskFollowUp}
            disabled={!transcript.trim() || isLoadingFollowUp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isLoadingFollowUp ? 'Generating question...' : 'Ask Follow-up Question'}</span>
          </button>

          {/* Finish Practice Button */}
          <button
            id="practice-finish-btn"
            onClick={handleFinish}
            disabled={!transcript.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 hover:from-blue-700 hover:via-indigo-700 hover:to-pink-600 disabled:opacity-40 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Evaluate My Exact Spoken Response</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
