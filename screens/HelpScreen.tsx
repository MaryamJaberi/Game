import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { NeonBook, NeonLightning, NeonSparkle } from '../components/NeonIcons';
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
      <div className="p-3.5 bg-gradient-to-r from-[#7B2CBF] via-[#FF007F] to-[#FF2E93] border-b-4 border-[#160430] flex items-center justify-between z-10 text-white shadow-[0px_3px_0px_0px_#160430]">
        <div className="flex items-center gap-2">
          <NeonBook size={22} color="#FFE600" />
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">{help.title || t.guide}</h2>
        </div>
        <button 
          onClick={handleClose} 
          className="w-9 h-9 flex items-center justify-center bg-[#FFE600] hover:bg-yellow-300 text-[#160430] border-2 border-[#160430] font-black rounded-xl active:translate-y-0.5 shadow-[2px_2px_0px_0px_#160430]"
        >
          ✕
        </button>
      </div>

      {/* Rules content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5">
        
        {/* Intro Tip bubble */}
        <div className="bg-white p-3.5 border-[3px] border-[#160430] rounded-2xl shadow-[3px_3px_0px_0px_#160430] flex items-center gap-3">
          <TeamMascot color="PARTY" size={44} />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] bg-[#FFE600] text-[#160430] border border-[#160430] px-2 py-0.5 rounded-lg font-black uppercase shadow-xs flex items-center gap-1 w-fit">
              <NeonLightning size={12} color="#160430" glow={false} />
              <span>{language === 'fa' ? 'نکته طلایی بازی' : 'PARTY TIP'}</span>
            </span>
            <p className="text-[11px] font-black text-[#160430] leading-normal mt-1">
              {language === 'fa' ? 'کلمه را به یارتان برسانید و بدون اتلاف وقت گوشی را به نفر بعد بدهید!' : 'Pass the phone after every correct word. Avoid using forbidden gestures!'}
            </p>
          </div>
        </div>

        {/* Dynamic Sections */}
        {help.sections.map((section: any) => (
          <section 
            key={section.id} 
            id={`help-${section.id}`}
            className="bg-white p-4 rounded-2xl border-[3px] border-[#160430] shadow-[4px_4px_0px_0px_#160430] relative overflow-hidden"
          >
            {/* Tag Badge */}
            <div className="bg-[#00F0FF] border-2 border-[#160430] inline-flex items-center gap-1.5 font-black text-[#160430] px-3 py-1 text-xs rounded-xl uppercase shadow-[2px_2px_0px_0px_#160430] mb-2.5">
              <NeonSparkle size={14} color="#160430" glow={false} />
              <span>{section.title}</span>
            </div>
            
            {/* Styled body */}
            <p className="text-xs font-bold text-[#160430] leading-relaxed whitespace-pre-line tracking-wide bg-[#F8EFFF] p-3 border border-[#160430]/20 rounded-xl">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      {/* Footer Return Drawer */}
      <div className="p-3.5 bg-white border-t-4 border-[#160430] z-10 flex gap-4">
        <button 
          onClick={handleClose} 
          className="pixel-btn pixel-btn-pink w-full py-3.5 text-base font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>{t.resume}</span>
          <NeonLightning size={18} color="#FFE600" />
        </button>
      </div>
    </div>
  );
};

export default HelpScreen;
