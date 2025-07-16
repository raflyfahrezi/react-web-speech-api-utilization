import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const SpeechRecognitionComponent = () => {
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    toggleListening,
    clearTranscript,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-US',
    maxAlternatives: 1,
  });

  return (
    <div className="speech-recognition">
      <h2>Speech Recognition</h2>
      
      {!isSupported ? (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          Speech recognition is not supported in this browser.
        </div>
      ) : error ? (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      ) : null}

      <div className="controls" style={{ marginBottom: '2rem' }}>
        <button
          onClick={toggleListening}
          disabled={!isSupported}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: isListening ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '1rem',
            opacity: !isSupported ? 0.5 : 1
          }}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        
        <button
          onClick={clearTranscript}
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
          Clear Transcript
        </button>
      </div>

      <div className="status" style={{ marginBottom: '1rem' }}>
        <strong>Status:</strong> {isListening ? '🔴 Listening...' : '⚪ Not listening'}
      </div>

      <div className="transcript-container" style={{ 
        border: '1px solid #ddd',
        padding: '1rem',
        borderRadius: '4px',
        minHeight: '200px',
        backgroundColor: '#f5f5f5'
      }}>
        <h3>Transcript:</h3>
        <div className="final-transcript">
          {transcript.map((segment, index) => (
            <p key={index} style={{ margin: '0.5rem 0' }}>
              {segment.text}
            </p>
          ))}
          {interimTranscript && (
            <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#666' }}>
              {interimTranscript}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};