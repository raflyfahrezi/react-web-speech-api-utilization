import { useState } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export const SpeechSynthesisComponent = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  const {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
    error
  } = useSpeechSynthesis({
    rate,
    pitch,
    volume,
    voice: selectedVoice
  });

  const handleSpeak = () => {
    if (!text.trim()) {
      return;
    }
    speak(text);
  };

  const handleVoiceChange = (voiceURI: string) => {
    const voice = voices.find(v => v.voiceURI === voiceURI) || null;
    setSelectedVoice(voice);
  };

  return (
    <div className="speech-synthesis">
      <h2>Speech Synthesis</h2>
      
      {!supported ? (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          Speech synthesis is not supported in this browser.
        </div>
      ) : error ? (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      ) : null}

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
          value={selectedVoice?.voiceURI || ''}
          onChange={(e) => handleVoiceChange(e.target.value)}
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
          onClick={handleSpeak}
          disabled={speaking && !paused}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: (speaking && !paused) ? 0.5 : 1
          }}
        >
          Speak
        </button>

        {speaking && !paused && (
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

        {speaking && paused && (
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

        {speaking && (
          <button
            onClick={cancel}
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
          speaking ? (paused ? '⏸️ Paused' : '🔊 Speaking...') : '⚪ Ready'
        }
      </div>
    </div>
  );
};