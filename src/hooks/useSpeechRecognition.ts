import { useState, useEffect, useRef, useCallback } from 'react';

export interface TranscriptSegment {
  text: string;
  isFinal: boolean;
  timestamp: number;
}

export interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: TranscriptSegment[];
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  clearTranscript: () => void;
  resetError: () => void;
}

const defaultConfig: Required<SpeechRecognitionConfig> = {
  continuous: true,
  interimResults: true,
  lang: 'en-US',
  maxAlternatives: 1,
};

export const useSpeechRecognition = (
  config: SpeechRecognitionConfig = {}
): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const finalConfig = { ...defaultConfig, ...config };

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = finalConfig.continuous;
    recognition.interimResults = finalConfig.interimResults;
    recognition.lang = finalConfig.lang;
    recognition.maxAlternatives = finalConfig.maxAlternatives;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessages: Record<string, string> = {
        'network': 'Network error occurred',
        'not-allowed': 'Microphone permission denied',
        'no-speech': 'No speech detected',
        'aborted': 'Speech recognition aborted',
        'audio-capture': 'No microphone found',
        'bad-grammar': 'Grammar error in speech recognition',
      };

      const message = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
      setError(message);
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      const results = Array.from(event.results);

      for (let i = event.resultIndex; i < results.length; i++) {
        const result = results[i];
        if (result.isFinal) {
          setTranscript(prev => [...prev, {
            text: result[0].transcript,
            isFinal: true,
            timestamp: Date.now()
          }]);
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [
    isSupported,
    finalConfig.continuous,
    finalConfig.interimResults,
    finalConfig.lang,
    finalConfig.maxAlternatives
  ]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    setInterimTranscript('');
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    resetError,
  };
};