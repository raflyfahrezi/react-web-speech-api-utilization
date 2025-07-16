import { useState } from 'react';
import { SpeechRecognitionComponent } from './components/SpeechRecognition';
import { SpeechSynthesisComponent } from './components/SpeechSynthesis';
import { VoiceCommandDemo } from './components/VoiceCommandDemo';
import { TextReaderDemo } from './components/TextReaderDemo';
import './App.css';

type TabType = 'recognition' | 'synthesis' | 'commands' | 'reader';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('recognition');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Web Speech API Demo</h1>
        <p>Explore Speech Recognition and Speech Synthesis with React + TypeScript</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'recognition' ? 'active' : ''}`}
          onClick={() => setActiveTab('recognition')}
        >
          Speech Recognition
        </button>
        <button
          className={`tab-button ${activeTab === 'synthesis' ? 'active' : ''}`}
          onClick={() => setActiveTab('synthesis')}
        >
          Speech Synthesis
        </button>
        <button
          className={`tab-button ${activeTab === 'commands' ? 'active' : ''}`}
          onClick={() => setActiveTab('commands')}
        >
          Voice Commands
        </button>
        <button
          className={`tab-button ${activeTab === 'reader' ? 'active' : ''}`}
          onClick={() => setActiveTab('reader')}
        >
          Text Reader
        </button>
      </nav>

      <main className="app-content">
        <div className="tab-content">
          {activeTab === 'recognition' ? (
            <SpeechRecognitionComponent />
          ) : activeTab === 'synthesis' ? (
            <SpeechSynthesisComponent />
          ) : activeTab === 'commands' ? (
            <VoiceCommandDemo />
          ) : (
            <TextReaderDemo />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with React + TypeScript + Vite. 
          Check browser compatibility for Web Speech API support.
        </p>
      </footer>
    </div>
  );
}

export default App;