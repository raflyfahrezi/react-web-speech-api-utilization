import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeechSynthesisConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  lang?: string;
}

export interface UseSpeechSynthesisReturn {
  speak: (text: string, config?: SpeechSynthesisConfig) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  error: string | null;
}

const defaultConfig: Required<Omit<SpeechSynthesisConfig, 'voice'>> & { voice: SpeechSynthesisVoice | null } = {
  rate: 1,
  pitch: 1,
  volume: 1,
  voice: null,
  lang: 'en-US',
};

export const useSpeechSynthesis = (
  initialConfig: SpeechSynthesisConfig = {}
): UseSpeechSynthesisReturn => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const config = { ...defaultConfig, ...initialConfig };

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!supported) {
      setError('Speech synthesis is not supported in this browser.');
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = useCallback((text: string, overrideConfig?: SpeechSynthesisConfig) => {
    if (!supported) {
      setError('Speech synthesis is not supported');
      return;
    }

    if (!text || text.trim().length === 0) {
      setError('Please provide text to speak');
      return;
    }

    setError(null);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const finalConfig = { ...config, ...overrideConfig };

    utterance.rate = finalConfig.rate!;
    utterance.pitch = finalConfig.pitch!;
    utterance.volume = finalConfig.volume!;
    utterance.lang = finalConfig.lang!;

    if (finalConfig.voice) {
      utterance.voice = finalConfig.voice;
    } else if (voices.length > 0) {
      const defaultVoice = voices.find(voice => voice.lang === finalConfig.lang) || voices[0];
      utterance.voice = defaultVoice;
    }

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onerror = (event) => {
      const errorMessages: Record<string, string> = {
        'canceled': 'Speech was canceled',
        'interrupted': 'Speech was interrupted',
        'audio-busy': 'Audio output is busy',
        'audio-hardware': 'Audio hardware error',
        'network': 'Network error',
        'synthesis-unavailable': 'Speech synthesis unavailable',
        'synthesis-failed': 'Speech synthesis failed',
        'language-unavailable': 'Language not available',
        'voice-unavailable': 'Voice not available',
        'text-too-long': 'Text is too long',
        'invalid-argument': 'Invalid argument',
      };

      const message = errorMessages[event.error] || `Speech synthesis error: ${event.error}`;
      setError(message);
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onpause = () => {
      setPaused(true);
    };

    utterance.onresume = () => {
      setPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported, config, voices]);

  const cancel = useCallback(() => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  const pause = useCallback(() => {
    if (!supported || !speaking) return;
    
    window.speechSynthesis.pause();
  }, [supported, speaking]);

  const resume = useCallback(() => {
    if (!supported || !paused) return;
    
    window.speechSynthesis.resume();
  }, [supported, paused]);

  return {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
    error,
  };
};