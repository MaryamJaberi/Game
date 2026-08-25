import React from 'react';
import { GameSettings } from '../types';
import { CATEGORIES } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';

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

  // Fun category emojis mapping to match pixel feeling
  const CATEGORY_EMOJIS: Record<string, string> = {
    "CAT_OBJECTS": "🔑 Objects",
    "CAT_FOOD": "🍕 Food",
    "CAT_ANIMALS": "🦁 Animals",
    "CAT_JOBS": "👨‍⚕️ Jobs",
    "CAT_PLACES": "🗺️ Places",
    "CAT_VEHICLES": "🚗 Vehicles",
    "CAT_FEELINGS": "🎭 Feelings",
    "CAT_SPORTS": "⚽ Sports",
    "CAT_TECH": "💻 Tech",
    "CAT_ENTERTAINMENT": "🎬 Movies",
    "CAT_ADJECTIVES": "🏷️ Words"
  };

  const getEmojiAndName = (catKey: string) => {
    const raw = CATEGORY_EMOJIS[catKey] || "📦 Items";
    const emoji = raw.split(" ")[0];
    const translatedName = t.categories[catKey] || catKey;
    return { emoji, name: translatedName };
  };

  return (
    <div className="flex-1 flex flex-col p-5 select-none overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-black text-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#00d2ff]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗂️</span>
          <h2 className="text-lg font-bold uppercase tracking-wider">{t.categories_title || t.categories.CAT_TITLE || 'Categories'}</h2>
        </div>
        <button 
          onClick={onOpenHelp} 
          className="px-3 py-1 bg-[#00d2ff] text-black border-2 border-black font-bold text-xs rounded hover:bg-cyan-400 transition-colors"
        >
          {t.guide}
        </button>
      </div>

      <p className="text-slate-700 text-[11px] font-bold mb-4 bg-white/80 p-2.5 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] text-center">
        💡 {t.categoryHint}
      </p>

      {/* Categories Scrollable Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-2">
        {Object.keys(CATEGORIES).map(catKey => {
          const isSelected = settings.selectedCategories.includes(catKey);
          const { emoji, name } = getEmojiAndName(catKey);
          
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => toggleCategory(catKey)}
              className={`w-full p-3.5 rounded-2xl border-4 border-black flex items-center justify-between transition-all ${
                isSelected
                ? 'bg-[#ffd200] text-black shadow-[4px_4px_0px_0px_#000000] -translate-x-0.5 -translate-y-0.5'
                : 'bg-white text-slate-800 shadow-[2px_2px_0px_0px_#000000] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{emoji}</span>
                <span className="font-black text-sm uppercase">{name}</span>
              </div>

              {/* Pixel Checkbox */}
              <div className={`w-6 h-6 border-2 border-black flex items-center justify-center rounded-lg shadow-[1px_1px_0px_0px_#000000] ${
                isSelected ? 'bg-black' : 'bg-white'
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-[#39ff14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Decorative Mascot Green Buddy */}
      <div className="my-2.5 flex items-center justify-center gap-2">
        <TeamMascot color="GREEN" size={38} />
        <span className="text-[10px] text-slate-600 bg-white/75 px-3 py-1 border border-black rounded-lg font-bold">
          {settings.language === 'fa' ? '🥦 هرچی دسته‌بندی بیشتر، کلمات جذاب‌تر!' : '🍀 Choose multiple categories for infinite replayability!'}
        </span>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-4 mt-2">
        <button 
          onClick={onBack} 
          className="pixel-btn pixel-btn-dark flex-1 py-3.5 text-sm font-bold uppercase tracking-wider"
        >
          {t.back}
        </button>
        <button 
          onClick={onNext} 
          className="pixel-btn pixel-btn-pink flex-[2] py-3.5 text-base font-black uppercase tracking-wider"
        >
          {t.next} ⚽
        </button>
      </div>
    </div>
  );
};

export default CategoryScreen;
