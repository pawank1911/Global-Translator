import React, { useState, useRef } from 'react';
import { translateText } from '../api/translation';
import { extractTextFromImage } from '../api/ocr';

const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' }
];

const Icons = {
  Languages: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
  ),
  ArrowRightLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
  ),
  Loader2: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  Mic: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  ),
  Volume2: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
  ),
  ImagePlus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  )
};

const Translator = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [sourceLang, setSourceLang] = useState('auto');
  const [isListening, setIsListening] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsLoading(true);
    setError('');
    setTranslatedText('');

    try {
      const result = await translateText(sourceText, targetLang, sourceLang);
      setTranslatedText(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMicrophone = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    
    if (isListening) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang === 'auto' ? navigator.language : sourceLang;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSourceText((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    recognition.onerror = (event) => {
      setError('Microphone error: ' + event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSpeak = () => {
    if (!translatedText) return;
    
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsOcrProcessing(true);
    setError('');

    try {
      const extractedText = await extractTextFromImage(file);
      setSourceText(extractedText);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsOcrProcessing(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 animate-in fade-in duration-700">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center p-2 bg-primary/20 rounded-xl mb-2 shadow-sm shadow-primary/20">
          <div className="w-6 h-6 sm:w-8 sm:h-8 text-primary">
            <Icons.Languages />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
          Global Translator
        </h1>
        <p className="text-text-muted text-sm max-w-lg mx-auto">
          Break barriers instantly. Fast translation with Auto Detect, Mic Input & OCR.
        </p>
      </div>

      <div className="glass-panel p-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-medium text-slate-300 uppercase tracking-wider hidden sm:block">Translate From</span>
              <select
                className="bg-slate-800/80 border border-slate-600 text-white text-xs sm:text-sm rounded-md focus:ring-primary focus:border-primary block p-1.5 outline-none cursor-pointer transition-colors shadow-sm"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={`src-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative group hover:shadow-primary/5 transition-all duration-300 rounded-lg">
              <textarea
                className="glass-input w-full h-24 sm:h-32 p-3 text-sm resize-none shadow-inner"
                placeholder={isOcrProcessing ? "Extracting text..." : isListening ? "Listening..." : "Type or paste text..."}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              
              <div className="absolute bottom-2 right-2 flex gap-1.5">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={isOcrProcessing}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 rounded-md transition-colors border border-slate-600/50 flex flex-col justify-center items-center backdrop-blur-md focus:outline-none disabled:opacity-50"
                  title="Upload image OCR"
                >
                  {isOcrProcessing ? (
                    <div className="w-4 h-4 animate-spin"><Icons.Loader2 /></div>
                  ) : (
                    <div className="w-4 h-4"><Icons.ImagePlus /></div>
                  )}
                </button>
                <button
                  onClick={handleMicrophone}
                  className={`p-1.5 rounded-md transition-colors border flex items-center justify-center backdrop-blur-md focus:outline-none ${isListening ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-blue-400 border-slate-600/50'}`}
                  title="Voice Input"
                >
                  <div className="w-4 h-4"><Icons.Mic /></div>
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center h-full">
            <div className="bg-slate-800 border border-slate-700 p-2 mt-6 rounded-full text-primary shadow-sm shadow-primary/10">
              <div className="w-4 h-4"><Icons.ArrowRightLeft /></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 transform lg:translate-y-0">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-medium text-slate-300 uppercase tracking-wider hidden sm:block">Translate To</span>
              <select
                className="bg-slate-800/80 border border-slate-600 text-white text-xs sm:text-sm rounded-md focus:ring-primary focus:border-primary block p-1.5 outline-none cursor-pointer transition-colors shadow-sm"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {LANGUAGES.filter(l => l.code !== 'auto').map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative group hover:shadow-primary/5 transition-all duration-300 rounded-lg">
              <textarea
                className="glass-input w-full h-24 sm:h-32 p-3 text-sm resize-none text-blue-50 bg-slate-900/80 shadow-inner ring-1 ring-slate-800"
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
              />
              
              {translatedText && (
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                  <button
                    onClick={handleSpeak}
                    className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-md transition-colors border border-indigo-500/30 flex items-center justify-center backdrop-blur-md focus:outline-none"
                    title="Read Aloud"
                  >
                    <div className="w-4 h-4"><Icons.Volume2 /></div>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors border border-slate-600/50 flex items-center justify-center backdrop-blur-md focus:outline-none"
                    title="Copy"
                  >
                    <div className="w-4 h-4">{copied ? <Icons.Check /> : <Icons.Copy />}</div>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {error && (
          <div className="mt-4 p-2.5 bg-red-500/10 border border-red-500/40 rounded-lg text-red-400 text-xs text-center font-medium backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isLoading}
            className="primary-button py-2.5 px-8 text-sm w-full sm:w-auto min-w-[200px] tracking-wide flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 animate-spin"><Icons.Loader2 /></div>
                Translating...
              </>
            ) : (
              'Translate Now'
            )}
          </button>
        </div>
      </div>
      
      <div className="text-center mt-6 text-slate-500/70 text-xs font-medium tracking-wide">
        <p>POWERED BY RAPIDAPI ONLY</p>
      </div>
    </div>
  );
};

export default Translator;
