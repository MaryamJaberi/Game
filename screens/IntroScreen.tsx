import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, NATIVE_LANGUAGE_NAMES } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { NeonLightning, NeonSparkle, NeonGamepad, NeonTrophy, NeonBook } from '../components/NeonIcons';
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
  const [mascotBounce, setMascotBounce] = useState(false);
  const [partyEmote, setPartyEmote] = useState<string | null>(null);

  const isRTL = language === 'fa' || language === 'ar';

  const handleMascotClick = () => {
    sound.playCorrect();
    setMascotBounce(true);
    const emotes = ['⚡', '✨', '🎉', '💖', '⭐', '🌟', '🚀', '🔥'];
    setPartyEmote(emotes[Math.floor(Math.random() * emotes.length)]);
    setTimeout(() => setMascotBounce(false), 400);
    setTimeout(() => setPartyEmote(null), 900);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-5 text-center select-none overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Brand Title Area - Party & Co SHOCK YOU! Style (Image 1) */}
      <div className="mt-1 w-full max-w-sm">
        {/* Animated Neon Top Bar */}
        <div className="flex justify-between items-center px-4 mb-2">
          <div className="flex items-center gap-1">
            <NeonLightning size={22} color="#FFE600" />
            <span className="text-[10px] font-black tracking-widest text-[#FFE600] uppercase bg-[#160430] px-2 py-0.5 rounded-md border border-[#FFE600]/40">
              SHOCK YOU!
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <NeonSparkle size={18} color="#00F0FF" />
            <NeonLightning size={22} color="#FF007F" />
          </div>
        </div>

        {/* High-Voltage Party Shock Box (Fixes Image 3 issues: No font clipping, high-contrast subtitle) */}
        <div className="pixel-card-shock bg-gradient-to-br from-[#1b0338] via-[#2c0659] to-[#480a8a] text-white p-3.5 sm:p-4 mx-0.5 relative overflow-hidden border-[3.5px] border-[#160430]">
          {/* Memphis Chevron / Zig-zag background accent */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:12px_12px]" />
          
          {/* Top Tag */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FFE600] text-[#160430] text-[9.5px] font-black uppercase rounded-md tracking-wider mb-1.5 shadow-[1px_1px_0px_0px_#160430]">
            ⚡ PARTY & CO
          </div>

          {/* Main Title - Crystal clear rendering with bold 3D Party Shock lettering */}
          <h1 className="text-4xl sm:text-5xl font-black mb-1.5 font-display tracking-tight text-white drop-shadow-[3px_3px_0px_#FF007F] leading-tight">
            {t.title}
          </h1>

          {/* Subtitle - High-contrast Neon Cyan / Yellow pill (Resolves Image 3 unreadable yellow text on white) */}
          <div className="inline-block bg-[#00F0FF] text-[#160430] px-3 py-1 rounded-lg border-2 border-[#160430] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#160430]">
            {t.subtitle}
          </div>
        </div>
      </div>

      {/* Main Center Mascot Character - Glowing Neon Tube Mascot (Image 2) */}
      <div 
        className="my-2.5 flex flex-col items-center cursor-pointer relative"
        onClick={handleMascotClick}
      >
        {partyEmote && (
          <div className="absolute -top-7 text-3xl animate-float-up pointer-events-none z-20">
            {partyEmote}
          </div>
        )}
        
        {/* Glow halo behind mascot */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#FF007F]/20 rounded-full blur-xl transform scale-125 pointer-events-none" />
          <div className={`transition-transform duration-200 ${mascotBounce ? 'scale-110 rotate-6' : 'hover:scale-105 active:scale-95'}`}>
            <TeamMascot color="PARTY" size={135} className="drop-shadow-[0_0_15px_rgba(255,0,127,0.8)]" />
          </div>
        </div>

        <div 
          className="mt-1.5 px-3.5 py-1 border-2 border-[#160430] bg-[#FFE600] rounded-full text-[11px] font-black text-[#160430] shadow-[2px_2px_0px_0px_#160430] flex items-center gap-1.5"
        >
          <NeonLightning size={14} color="#160430" glow={false} />
          <span>{language === 'fa' ? 'بزن روی من تا شاد شی!' : 'Ready to Party! Tap Me!'}</span>
        </div>
      </div>

      {/* Interactive Controls & Language Selection Area */}
      <div className="w-full max-w-sm space-y-3.5">
        
        {/* Language Selector Card */}
        <div className="bg-white p-3 rounded-2xl border-[3.5px] border-[#160430] shadow-[4px_4px_0px_0px_#160430]">
          <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#160430] font-black mb-2">
            <NeonSparkle size={14} color="#FF007F" />
            <span>{language === 'fa' ? 'انتخاب زبان بازی' : 'SELECT LANGUAGE'}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1.5" dir="ltr">
            {languages.map(l => {
              const isSelected = language === l;
              return (
                <button 
                  key={l}
                  onClick={() => {
                    sound.playToggle();
                    onLanguageChange(l);
                  }}
                  className={`py-1.5 px-1 rounded-xl font-black text-[11px] transition-all border-2 border-[#160430] text-center ${
                    isSelected 
                    ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2E93] text-white shadow-[2px_2px_0px_0px_#160430] -translate-x-[1px] -translate-y-[1px]' 
                    : 'bg-[#F4E8FF]/60 text-[#160430] hover:bg-[#EBD2FF]'
                  }`}
                >
                  {NATIVE_LANGUAGE_NAMES[l]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* High Voltage Start Button */}
          <button 
            onClick={() => {
              sound.playStartGame();
              onNext();
            }}
            className="pixel-btn pixel-btn-pink w-full py-4 text-xl font-display uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <NeonGamepad size={26} color="#FFFFFF" />
            <span>{t.newGame}</span>
            <NeonLightning size={22} color="#FFE600" />
          </button>
          
          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button 
              onClick={() => {
                sound.playClick();
                onOpenHistory();
              }}
              className="pixel-btn pixel-btn-cyan py-3 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5"
            >
              <NeonTrophy size={18} color="#160430" glow={false} />
              <span>{t.history}</span>
            </button>

            <button 
              onClick={() => {
                sound.playClick();
                onOpenHelp();
              }}
              className="pixel-btn pixel-btn-yellow py-3 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5"
            >
              <NeonBook size={18} color="#160430" glow={false} />
              <span>{t.guide}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Version Tag */}
      <div className="mt-2 px-3 py-0.5 bg-[#160430] text-[#00F0FF] text-[9.5px] font-mono tracking-widest rounded-full border border-[#00F0FF]/30 flex items-center gap-1">
        <span>⚡</span>
        <span>PARTY & CO • SHOCK EDITION</span>
      </div>
    </div>
  );
};

export default IntroScreen;
