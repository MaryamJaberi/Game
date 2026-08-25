import React from 'react';
import { GameSettings } from '../types';
import { CATEGORIES } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { NeonCategoryIcon, NeonBook, NeonLightning } from '../components/NeonIcons';
import { sound } from '../soundManager';

interface Props {
  settings: GameSettings;
  onSave: (s: GameSettings) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const CategoryScreen: React.FC<Props> = ({ settings, onSave, onNext, onBack, onOpenHelp }) => {
  const t = TRANSLATIONS[settings.language];
  const isRTL = settings.language === 'fa' || settings.language === 'ar';
  
  const toggleCategory = (catKey: string) => {
    sound.playToggle();
    let selected = [...settings.selectedCategories];
    if (selected.includes(catKey)) {
      if (selected.length > 1) {
        selected = selected.filter(s => s !== catKey);
      }
    } else {
      selected.push(catKey);
    }
    onSave({ ...settings, selectedCategories: selected });
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 select-none overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Party & Co SHOCK YOU! gradient */}
      <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-[#7B2CBF] via-[#FF007F] to-[#FF2E93] text-white p-3.5 border-[3.5px] border-[#160430] rounded-2xl shadow-[4px_4px_0px_0px_#160430]">
        <div className="flex items-center gap-2">
          <NeonLightning size={22} color="#FFE600" />
          <h2 className="text-base md:text-lg font-black uppercase tracking-wider">
            {t.categories_title || t.categories.CAT_TITLE || 'Categories'}
          </h2>
        </div>
        <button 
          onClick={() => {
            sound.playClick();
            onOpenHelp();
          }} 
          className="px-3 py-1 bg-[#FFE600] hover:bg-yellow-300 text-[#160430] border-2 border-[#160430] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#160430] transition-colors flex items-center gap-1"
        >
          <NeonBook size={14} color="#160430" glow={false} />
          <span>{t.guide}</span>
        </button>
      </div>

      {/* High-Contrast Hint Pill */}
      <p className="text-[#160430] text-[11px] font-black mb-3 bg-white p-2.5 border-2 border-[#160430] rounded-xl shadow-[2px_2px_0px_0px_#160430] text-center flex items-center justify-center gap-1.5">
        <NeonLightning size={14} color="#FF007F" />
        <span>{t.categoryHint}</span>
      </p>

      {/* Categories Scrollable Container with Glowing Neon Outline Icons */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 pb-2">
        {Object.keys(CATEGORIES).map(catKey => {
          const isSelected = settings.selectedCategories.includes(catKey);
          const translatedName = t.categories[catKey] || catKey;
          
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => toggleCategory(catKey)}
              className={`w-full p-3 rounded-2xl border-[3.5px] border-[#160430] flex items-center justify-between transition-all ${
                isSelected
                ? 'bg-gradient-to-r from-[#FFF033] to-[#FFE600] text-[#160430] shadow-[4px_4px_0px_0px_#160430] -translate-x-0.5 -translate-y-0.5'
                : 'bg-white text-[#160430] shadow-[2px_2px_0px_0px_#160430] hover:bg-[#F9F0FF]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Glowing Neon Outline Icon (Image 2 style) */}
                <div className={`p-1.5 rounded-xl border-2 border-[#160430] ${isSelected ? 'bg-[#160430]' : 'bg-[#160430]'}`}>
                  <NeonCategoryIcon catKey={catKey} size={24} />
                </div>
                <span className="font-black text-sm uppercase">{translatedName}</span>
              </div>

              {/* High Voltage Shock Checkbox */}
              <div className={`w-7 h-7 border-2 border-[#160430] flex items-center justify-center rounded-xl shadow-[1px_1px_0px_0px_#160430] ${
                isSelected ? 'bg-[#160430]' : 'bg-white'
              }`}>
                {isSelected && (
                  <svg className="w-5 h-5 text-[#39FF14] drop-shadow-[0_0_4px_#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Decorative Mascot Green Buddy */}
      <div className="my-2 flex items-center justify-center gap-2">
        <TeamMascot color="GREEN" size={36} />
        <span className="text-[10.5px] text-[#160430] bg-white px-3 py-1 border-2 border-[#160430] rounded-xl font-black shadow-[2px_2px_0px_0px_#160430]">
          {settings.language === 'fa' ? '⚡ هرچی دسته‌ها متنوع‌تر، بازی مهیج‌تر!' : '⚡ Pick multiple categories for maximum thrills!'}
        </span>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-3 mt-1">
        <button 
          onClick={() => {
            sound.playClick();
            onBack();
          }} 
          className="pixel-btn pixel-btn-dark flex-1 py-3.5 text-sm font-black uppercase tracking-wider"
        >
          {t.back}
        </button>
        <button 
          onClick={() => {
            sound.playClick();
            onNext();
          }} 
          className="pixel-btn pixel-btn-pink flex-[2] py-3.5 text-base font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>{t.next}</span>
          <NeonLightning size={18} color="#FFE600" />
        </button>
      </div>
    </div>
  );
};

export default CategoryScreen;
