import { useEffect, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface Command {
  phrase: string;
  action: () => void;
  description: string;
}

export const VoiceCommandDemo = () => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lastCommand, setLastCommand] = useState<string>('');
  
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition({
    continuous: false,
    interimResults: false,
    lang: 'en-US',
  });

  const commands: Command[] = [
    {
      phrase: 'red',
      action: () => setBackgroundColor('#ffcccc'),
      description: 'Say "red" to change background to red'
    },
    {
      phrase: 'blue',
      action: () => setBackgroundColor('#ccccff'),
      description: 'Say "blue" to change background to blue'
    },
    {
      phrase: 'green',
      action: () => setBackgroundColor('#ccffcc'),
      description: 'Say "green" to change background to green'
    },
    {
      phrase: 'reset',
      action: () => setBackgroundColor('#ffffff'),
      description: 'Say "reset" to change background to white'
    },
  ];

  useEffect(() => {
    if (transcript.length > 0) {
      const latestTranscript = transcript[transcript.length - 1];
      const text = latestTranscript.text.toLowerCase().trim();
      
      const matchedCommand = commands.find(cmd => 
        text.includes(cmd.phrase)
      );
      
      if (matchedCommand) {
        matchedCommand.action();
        setLastCommand(matchedCommand.phrase);
        clearTranscript();
      }
    }
  }, [transcript]);

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Voice commands are not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor,
      minHeight: '400px',
      borderRadius: '8px',
      transition: 'background-color 0.3s ease'
    }}>
      <h3>Voice Command Demo</h3>
      <p>Use voice commands to change the background color!</p>
      
      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h4>Available Commands:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {commands.map((cmd, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              {cmd.description}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleVoiceCommand}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1.1rem',
          backgroundColor: isListening ? '#ff4444' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isListening ? '🎤 Listening...' : '🎤 Start Voice Command'}
      </button>

      {lastCommand && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Last command:</strong> "{lastCommand}"
        </div>
      )}

      {transcript.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Heard:</strong> "{transcript[transcript.length - 1].text}"
        </div>
      )}
    </div>
  );
};