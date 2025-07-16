import { useState, useEffect, useCallback } from 'react';

interface Voice {
  name: string;
  lang: string;
  voiceURI: string;
  localService: boolean;
  default: boolean;
}

export const SpeechSynthesisComponent = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis is not supported in this browser.');
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].voiceURI);
      }
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const speak = useCallback(() => {
    if (!text.trim()) {
      setError('Please enter some text to speak.');
      return;
    }

    setError(null);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      setError(`Speech synthesis error: ${event.error}`);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoice, rate, pitch, volume, voices]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  return (
    <div className="speech-synthesis">
      <h2>Speech Synthesis</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="text-input" style={{ marginBottom: '1rem' }}>
        <label htmlFor="text-to-speak" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Text to speak:
        </label>
        <textarea
          id="text-to-speak"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
          placeholder="Enter text here..."
        />
      </div>

      <div className="voice-selection" style={{ marginBottom: '1rem' }}>
        <label htmlFor="voice-select" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Voice:
        </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="controls-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <label htmlFor="rate" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Rate: {rate}
          </label>
          <input
            id="rate"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="pitch" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Pitch: {pitch}
          </label>
          <input
            id="pitch"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="volume" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Volume: {volume}
          </label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="action-buttons" style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={speak}
          disabled={isSpeaking && !isPaused}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: (isSpeaking && !isPaused) ? 0.5 : 1
          }}
        >
          Speak
        </button>

        {isSpeaking && !isPaused && (
          <button
            onClick={pause}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Pause
          </button>
        )}

        {isSpeaking && isPaused && (
          <button
            onClick={resume}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Resume
          </button>
        )}

        {isSpeaking && (
          <button
            onClick={stop}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Stop
          </button>
        )}
      </div>

      <div className="status" style={{ marginTop: '1rem' }}>
        <strong>Status:</strong> {
          isSpeaking ? (isPaused ? '⏸️ Paused' : '🔊 Speaking...') : '⚪ Ready'
        }
      </div>
    </div>
  );
};