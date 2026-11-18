import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Mic, Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { sound } from '../utils/sound';

interface VoiceRecorderProps {
  label: string;
  sublabel?: string;
  savedAudioUrl?: string;
  onAudioRecorded: (url: string) => void;
  accent?: 'sky' | 'fuchsia' | 'emerald';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  label,
  sublabel = 'Grabatu zure ahotsa zure profil digitalerako',
  savedAudioUrl,
  onAudioRecorded,
  accent = 'sky',
}) => {
  const { formatCase } = usePreferences();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(savedAudioUrl);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setAudioUrl(savedAudioUrl);
  }, [savedAudioUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getSupportedMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
      return '';
    }
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus',
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
  };

  const startRecording = async () => {
    setErrorMsg(null);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setErrorMsg('Zure mugikorreko nabigatzaileak ez du ahots-grabaketa onartzen.');
      return;
    }

    try {
      sound.playPop();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = getSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        const finalType = recorder.mimeType || chunksRef.current[0]?.type || mimeType || 'audio/mp4';
        const blob = new Blob(chunksRef.current, { type: finalType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onAudioRecorded(url);
        sound.playSuccess();
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setIsRecording(true);
      setSeconds(0);

      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 15) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMsg('Sakatu "Baimendu" nabigatzailean mikrofonoa erabiltzeko.');
    }
  };

  const togglePlay = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    } else if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      sound.playPop();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const resetAudio = () => {
    sound.playPop();
    if (audioRef.current) audioRef.current.pause();
    setAudioUrl(undefined);
    setIsPlaying(false);
    onAudioRecorded('');
  };

  const borderStyles = {
    sky: 'border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30',
    fuchsia: 'border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50/60 dark:bg-fuchsia-950/30',
    emerald: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30',
  }[accent];

  return (
    <div className={`surface-card p-4 rounded-2xl border ${borderStyles} transition-colors`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {formatCase(label)}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{formatCase(sublabel)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {!isRecording && !audioUrl && (
            <button
              type="button"
              onClick={startRecording}
              className="btn-tactile min-h-[42px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 border-rose-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>{formatCase('Grabatu nire ahotsa')}</span>
            </button>
          )}

          {isRecording && (
            <button
              type="button"
              onClick={stopRecording}
              className="btn-tactile min-h-[42px] px-4 py-2 rounded-xl bg-rose-700 border-rose-950 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 tabular-nums"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>{formatCase(`Gelditu (${seconds}s)`)}</span>
            </button>
          )}

          {audioUrl && !isRecording && (
            <>
              <button
                type="button"
                onClick={togglePlay}
                className="btn-tactile min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-emerald-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{formatCase(isPlaying ? 'Pausatu' : 'Entzun')}</span>
              </button>
              <button
                type="button"
                onClick={resetAudio}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                title="Berriro grabatu"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{formatCase('Berriro')}</span>
              </button>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>{formatCase('Gordeta')}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {errorMsg && (
        <p className="mt-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3 py-2 rounded-xl">
          {errorMsg}
        </p>
      )}
    </div>
  );
};
