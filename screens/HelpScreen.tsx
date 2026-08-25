import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { sound } from '../soundManager';

interface Props {
  language: Language;
  onClose: () => void;
  initialSection?: string;
}

const HelpScreen: React.FC<Props> = ({ language, onClose, initialSection }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];
  const help = t.helpContent;
  const isRTL = language === 'fa' || language === 'ar';

  useEffect(() => {
    if (initialSection && scrollRef.current) {
      const element = document.getElementById(`help-${initialSection}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialSection]);

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  return (
    <div className="flex-1 flex flex-col bg-pixel-grid overflow-hidden select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Panel */}
      <div className="p-4 bg-black border-b-4 border-black flex items-center justify-between z-10 text-white shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <h2 className="text-lg font-black uppercase tracking-wider">{help.title || t.guide}</h2>
        </div>
        <button 
          onClick={handleClose} 
          className="w-9 h-9 flex items-center justify-center bg-[#ff007f] text-white border-2 border-black font-black hover:bg-pink-600 rounded-lg active:translate-y-0.5"
        >
          ✕
        </button>
      </div>

      {/* Rules content - rendered as instruction booklet pages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Intro Tip bubble */}
        <div className="bg-white p-3 border-4 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] flex items-center gap-3">
          <TeamMascot color="PARTY" size={44} />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] bg-cyan-400 border border-black px-2 py-0.5 rounded font-black uppercase">TIP FOR NOOBS</span>
            <p className="text-[10px] font-bold text-slate-700 leading-normal mt-1">
              {language === 'fa' ? 'قوانین را به دقت بخوانید تا برنده نبرد کلمات شوید!' : 'Pass the phone after every correct word. Avoid using forbidden gestures!'}
            </p>
          </div>
        </div>

        {/* Dynamic Sections */}
        {help.sections.map((section: any) => (
          <section 
            key={section.id} 
            id={`help-${section.id}`}
            className="bg-white p-4.5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden"
          >
            {/* Tag Badge */}
            <div className="bg-[#ffd200] border-2 border-black inline-block font-black text-black px-3 py-1 text-[11px] rounded-lg uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              📝 {section.title}
            </div>
            
            {/* Styled body with high visibility details */}
            <p className="text-xs font-bold text-slate-800 leading-relaxed whitespace-pre-line tracking-wide bg-slate-50 p-3 border border-slate-200 rounded-xl">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      {/* Footer Return Drawer */}
      <div className="p-4 bg-slate-100 border-t-4 border-black z-10 flex gap-4">
        <button 
          onClick={handleClose} 
          className="pixel-btn pixel-btn-pink w-full py-4 text-base font-black uppercase tracking-wider"
        >
          🕹️ {t.resume}
        </button>
      </div>
    </div>
  );
};

export default HelpScreen;
