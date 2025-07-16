# Web Speech API Demo with React + TypeScript

A comprehensive demonstration of the Web Speech API using React, TypeScript, and Vite. This project showcases both Speech Recognition and Speech Synthesis capabilities with a clean, modern interface.

## 🚀 Features

### Speech Recognition (Speech-to-Text)
- Real-time speech-to-text conversion
- Continuous recognition with interim results
- Clear visual feedback for listening status
- Transcript management with timestamps
- Error handling and browser compatibility checks
- **Custom `useSpeechRecognition` hook for reusability**

### Speech Synthesis (Text-to-Speech)
- Convert text to natural-sounding speech
- Multiple voice options with language support
- Adjustable speech parameters (rate, pitch, volume)
- Playback controls (play, pause, resume, stop)
- Real-time status indicators
- **Custom `useSpeechSynthesis` hook for reusability**

### Voice Commands Demo
- Interactive voice command recognition
- Visual feedback through background color changes
- Demonstrates practical use of the speech recognition hook
- Simple command parsing system

### Text Reader Demo
- Article reader with navigation controls
- Variable reading speeds (slow, normal, fast)
- Auto-advance feature for hands-free reading
- Demonstrates practical use of the speech synthesis hook

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **ES6+** - Modern JavaScript features
- **Web Speech API** - Browser-native speech capabilities

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd microphone-utilization
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── SpeechRecognition.tsx    # Main speech recognition component
│   ├── SpeechSynthesis.tsx      # Text-to-speech component
│   ├── VoiceCommandDemo.tsx     # Voice command demonstration
│   └── TextReaderDemo.tsx       # Article reader demonstration
├── hooks/
│   ├── useSpeechRecognition.ts  # Reusable speech recognition hook
│   └── useSpeechSynthesis.ts    # Reusable speech synthesis hook
├── types/
│   └── speech.d.ts              # TypeScript definitions for Web Speech API
├── App.tsx                      # Main application component
├── App.css                      # Application styles
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## 🎯 Usage

### Using the Speech Recognition Hook

```typescript
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

const MyComponent = () => {
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: 'en-US',
  });

  // Your component logic here
};
```

### Using the Speech Synthesis Hook

```typescript
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

const MyComponent = () => {
  const {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
    error,
  } = useSpeechSynthesis({
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  // Speak text
  const handleSpeak = () => {
    speak('Hello world!');
  };

  // Your component logic here
};
```

### Configuration Options

**`useSpeechRecognition` options:**
- `continuous` (boolean): Keep recognizing speech continuously
- `interimResults` (boolean): Get results while speaking
- `lang` (string): Language code (e.g., 'en-US', 'es-ES')
- `maxAlternatives` (number): Maximum number of alternative transcripts

**`useSpeechSynthesis` options:**
- `rate` (number): Speech rate (0.5 to 2)
- `pitch` (number): Voice pitch (0 to 2)
- `volume` (number): Speech volume (0 to 1)
- `voice` (SpeechSynthesisVoice): Specific voice to use
- `lang` (string): Language code

## 🌐 Browser Compatibility

The Web Speech API has limited browser support:

### Speech Recognition
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (macOS & iOS)
- ❌ Firefox (not supported)
- ❌ Opera (limited support)

### Speech Synthesis
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Note:** Always check for browser compatibility and provide appropriate fallbacks.

## 🔒 Permissions

Speech Recognition requires microphone access. Users will be prompted to grant permission when starting recognition for the first time.

## 🎨 Customization

### Adding New Voice Commands

Edit `src/components/VoiceCommandDemo.tsx`:

```typescript
const commands: Command[] = [
  {
    phrase: 'your-command',
    action: () => {
      // Your action here
    },
    description: 'Say "your-command" to trigger this action'
  },
  // Add more commands...
];
```

### Styling

The project uses inline styles for demonstration purposes. You can easily convert to CSS modules, styled-components, or your preferred styling solution.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- UI components styled with modern CSS

## 🐛 Known Issues

- Speech recognition may stop after periods of silence
- Some browsers require HTTPS for speech recognition
- Voice availability varies by operating system and browser

## 🔍 Key Differences: Speech Recognition vs Speech Synthesis

- **Speech Recognition** (Speech-to-Text): Converts spoken words into text
  - Listens through microphone
  - Transcribes human speech
  - Use cases: Voice typing, voice commands

- **Speech Synthesis** (Text-to-Speech): Converts text into spoken words
  - Speaks through speakers
  - Generates synthetic speech
  - Use cases: Screen readers, audiobooks

## 💡 Tips

1. **For best recognition results:**
   - Use a good quality microphone
   - Speak clearly and at a moderate pace
   - Minimize background noise

2. **For speech synthesis:**
   - Test different voices to find the most natural sounding one
   - Adjust rate and pitch for better comprehension
   - Some voices may not support all languages

3. **Development tips:**
   - Use Chrome DevTools for debugging
   - Test on multiple devices and browsers
   - Consider implementing fallbacks for unsupported browsers
   - The custom hooks make it easy to add speech features to any component