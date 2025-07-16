import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface Article {
  title: string;
  content: string;
}

const sampleArticles: Article[] = [
  {
    title: "Introduction to React",
    content: "React is a JavaScript library for building user interfaces. It lets you create reusable UI components and manage their state efficiently. React's declarative nature makes it predictable and easier to debug."
  },
  {
    title: "TypeScript Benefits",
    content: "TypeScript adds static typing to JavaScript, catching errors at compile time. It provides better IDE support with autocomplete and refactoring tools. TypeScript makes large codebases more maintainable and helps teams collaborate more effectively."
  },
  {
    title: "Web Speech API",
    content: "The Web Speech API enables web applications to handle voice input and output. Speech recognition converts spoken words into text, while speech synthesis converts text into spoken words. This technology opens up new possibilities for accessibility and user interaction."
  }
];

export const TextReaderDemo = () => {
  const [selectedArticle, setSelectedArticle] = useState<number>(0);
  const [readingSpeed, setReadingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [autoAdvance, setAutoAdvance] = useState(false);

  const speedSettings = {
    slow: { rate: 0.8, pitch: 1 },
    normal: { rate: 1, pitch: 1 },
    fast: { rate: 1.3, pitch: 1.1 }
  };

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
    ...speedSettings[readingSpeed],
    volume: 1
  });

  const preferredVoice = voices.find(voice => 
    voice.lang.startsWith('en') && voice.name.includes('English')
  ) || voices[0];

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const handleReadArticle = () => {
    const article = sampleArticles[selectedArticle];
    const textToRead = `${article.title}. ${article.content}`;
    
    speak(textToRead, {
      voice: preferredVoice,
      ...speedSettings[readingSpeed]
    });
  };

  const handleNextArticle = () => {
    cancel();
    const nextIndex = (selectedArticle + 1) % sampleArticles.length;
    setSelectedArticle(nextIndex);
    
    if (autoAdvance) {
      setTimeout(() => {
        const article = sampleArticles[nextIndex];
        speak(`${article.title}. ${article.content}`, {
          voice: preferredVoice,
          ...speedSettings[readingSpeed]
        });
      }, 500);
    }
  };

  const handlePreviousArticle = () => {
    cancel();
    const prevIndex = selectedArticle === 0 ? sampleArticles.length - 1 : selectedArticle - 1;
    setSelectedArticle(prevIndex);
  };

  if (!supported) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Text-to-speech is not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div className="text-reader-demo">
      <h3>Article Reader Demo</h3>
      <p>Use text-to-speech to read articles aloud!</p>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ 
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1rem',
        backgroundColor: '#f9f9f9'
      }}>
        <h4 style={{ marginTop: 0, color: '#333' }}>
          {sampleArticles[selectedArticle].title}
        </h4>
        <p style={{ lineHeight: 1.6, color: '#555' }}>
          {sampleArticles[selectedArticle].content}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handlePreviousArticle}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#607D8B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Previous
        </button>

        <button
          onClick={handleNextArticle}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#607D8B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Next →
        </button>

        <select
          value={readingSpeed}
          onChange={(e) => setReadingSpeed(e.target.value as 'slow' | 'normal' | 'fast')}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <option value="slow">Slow Speed</option>
          <option value="normal">Normal Speed</option>
          <option value="fast">Fast Speed</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
          />
          Auto-advance
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {!speaking ? (
          <button
            onClick={handleReadArticle}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔊 Read Article
          </button>
        ) : (
          <>
            {!paused ? (
              <button
                onClick={pause}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1.1rem',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ⏸️ Pause
              </button>
            ) : (
              <button
                onClick={resume}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1.1rem',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ▶️ Resume
              </button>
            )}
            <button
              onClick={cancel}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1.1rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ⏹️ Stop
            </button>
          </>
        )}
      </div>

      <div style={{ 
        marginTop: '1rem',
        padding: '0.5rem',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Status:</strong> {
          speaking ? (paused ? '⏸️ Paused' : '🔊 Reading...') : '⚪ Ready to read'
        }
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        <strong>Tip:</strong> Try different reading speeds and enable auto-advance to create a hands-free reading experience!
      </div>
    </div>
  );
};