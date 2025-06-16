import React, { useState } from 'react';
import { Heart, Brain, Zap, Ghost, Flower } from 'lucide-react';
import { fetchCohereTranslation } from './lib/cohere';

type TranslationMode = 'honest' | 'savage' | 'soft' | 'chaotic';

interface Translation {
  mode: TranslationMode;
  result: string;
  icon: string;
  inputText: string; // Track the input that was translated
}

const modeConfig = {
  honest: { icon: Brain, color: 'bg-pink-100 text-pink-700', emoji: '🧠' },
  savage: { icon: Zap, color: 'bg-gray-100 text-gray-700', emoji: '💀' },
  soft: { icon: Flower, color: 'bg-green-100 text-green-700', emoji: '🌸' },
  chaotic: { icon: Ghost, color: 'bg-purple-100 text-purple-700', emoji: '👻' }
};

function App() {
  const [inputText, setInputText] = useState("Can't stop thinking about you 😊");
  const [selectedMode, setSelectedMode] = useState<TranslationMode>('honest');
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    const currentInput = inputText.trim();
    const currentMode = selectedMode;
    
    if (!currentInput) return;
    
    console.log('Translating:', { input: currentInput, mode: currentMode });
    
    setIsTranslating(true);
    
    try {
      const result = await fetchCohereTranslation(currentInput, currentMode);
      console.log('Translation result:', result);
      
      setTranslation({
        mode: currentMode,
        result,
        icon: modeConfig[currentMode].emoji,
        inputText: currentInput
      });
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation({
        mode: currentMode,
        result: "Something went wrong 💔 Please try again.",
        icon: "😓",
        inputText: currentInput
      });
    }

    setIsTranslating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-purple-300">
      {/* Header */}
      <header className="pt-8 pr-8 flex justify-end">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="text-2xl font-bold text-purple-700">Crushor</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16 leading-tight">
          What does your crush<br />
          really mean?
        </h1>

        {/* Input Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your crush's message..."
            className="w-full h-24 text-lg text-gray-700 placeholder-gray-400 border-none outline-none resize-none bg-transparent"
          />
          
          {/* Mode Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 mb-6">
            {(Object.keys(modeConfig) as TranslationMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 capitalize ${
                  selectedMode === mode
                    ? 'bg-gray-900 text-white transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {modeConfig[mode].emoji} {mode}
              </button>
            ))}
          </div>
          
          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isTranslating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Translating...
              </span>
            ) : (
              'Translate'
            )}
          </button>
        </div>

        {/* Result Card */}
        {translation && (
          <div className="bg-white rounded-3xl p-8 shadow-lg animate-fadeIn">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{translation.icon}</span>
              <span className="font-semibold text-gray-900 capitalize text-lg">
                {translation.mode}
              </span>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Original message:</p>
              <p className="text-gray-800 italic">"{translation.inputText}"</p>
            </div>
            <p className="text-xl text-gray-800 leading-relaxed">
              {translation.result}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;