import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS, NATIVE_LANGUAGE_NAMES } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { sound } from '../soundManager';

interface Props {
  language: Language;
  onLanguageChange: (l: Language) => void;
  onNext: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

const IntroScreen: React.FC<Props> = ({ language, onLanguageChange, onNext, onOpenHistory, onOpenHelp }) => {
  const t = TRANSLATIONS[language];
  const languages: Language[] = ['fa', 'en', 'nl', 'de', 'fr', 'ar', 'tr', 'pl', 'uk'];

  const isRTL = language === 'fa' || language === 'ar';

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 text-center select-none">
      {/* Brand Title Area */}
      <div className="mt-6 w-full">
        {/* Animated Neon Decorative Confetti Icons */}
        <div className="flex justify-between px-4 mb-2">
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎈</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</span>
        </div>

        {/* Outer Pixel Box for Title */}
        <div className="pixel-card-neon bg-[#1d0e3a] text-white p-4 mx-2 relative overflow-hidden">
          {/* Subtle overlay grid inside banner */}
          <div className="absolute inset-0 opacity-10 bg-pixel-grid pointer-events-none"></div>
          
          <h1 className="text-5xl font-black mb-1 font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-[#ffd200] to-cyan-400 drop-shadow-[3px_3px_0px_#000000]">
            {t.title}
          </h1>
          <p className="text-xs uppercase tracking-widest font-bold text-cyan-300">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Main Center Mascot Character */}
      <div 
        className="my-4 flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
        onClick={() => {
          sound.playCorrect();
        }}
      >
        <TeamMascot color="PARTY" size={140} className="animate-party-float drop-shadow-xl" />
        <div className="mt-1 px-4 py-1.5 border-2 border-black bg-white rounded-full text-[11px] font-bold shadow-[2px_2px_0px_0px_#000000]" dir={isRTL ? 'rtl' : 'ltr'}>
          {language === 'fa' ? '🕹️ آماده‌ی هیجانی؟ گوشی رو بچرخون!' : '🕹️ Ready! Pass the phone!'}
        </div>
      </div>

      {/* Inputs / Buttons Area */}
      <div className="w-full max-w-sm space-y-6">
        
        {/* Language Selector */}
        <div className="bg-white/95 p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_#000000]">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2 text-center">
            {language === 'fa' ? '🌐 انتخاب زبان بازی' : '🌐 SELECT LANGUAGE'}
          </div>
          <div className="grid grid-cols-3 gap-2" dir="ltr">
            {languages.map(l => (
              <button 
                key={l}
                onClick={() => {
                  sound.playToggle();
                  onLanguageChange(l);
                }}
                className={`py-1.5 px-0.5 rounded-lg font-bold text-[10px] transition-all border-2 border-black text-center ${
                  language === l 
                  ? 'bg-[#ff007f] text-white shadow-[2px_2px_0px_0px_#000000] -translate-x-[1px] -translate-y-[1px]' 
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {NATIVE_LANGUAGE_NAMES[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Menu Actions */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              sound.playStartGame();
              onNext();
            }}
            className="pixel-btn pixel-btn-pink w-full py-4 text-xl font-display uppercase tracking-wider"
          >
            🕹️ {t.newGame}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                sound.playClick();
                onOpenHistory();
              }}
              className="pixel-btn pixel-btn-cyan py-3 text-sm font-bold"
            >
              🏆 {t.history}
            </button>

            <button 
              onClick={() => {
                sound.playClick();
                onOpenHelp();
              }}
              className="pixel-btn pixel-btn-yellow py-3 text-sm font-bold"
            >
              📖 {t.guide}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Version */}
      <div className="mt-4 px-3 py-1 bg-black/80 text-cyan-300 text-[10px] font-mono tracking-widest rounded border-2 border-slate-700">
        NEON CARNIVAL v1.2.5
      </div>
    </div>
  );
};

export default IntroScreen;
