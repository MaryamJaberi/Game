import React from 'react';
import { GameSettings } from '../types';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';

interface Props {
  settings: GameSettings;
  onSave: (s: GameSettings) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const SetupScreen: React.FC<Props> = ({ settings, onSave, onNext, onBack, onOpenHelp }) => {
  const t = TRANSLATIONS[settings.language];
  const isRTL = settings.language === 'fa' || settings.language === 'ar';
  
  const updateSettings = (key: keyof GameSettings, value: any) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <div className="flex-1 flex flex-col p-5 select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-black text-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#ff007f]">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
          <h2 className="text-lg font-bold uppercase tracking-wider">{t.setup}</h2>
        </div>
        <button 
          onClick={onOpenHelp} 
          className="px-3 py-1 bg-[#ff007f] text-white border-2 border-black font-bold text-xs rounded hover:bg-pink-600 transition-colors"
        >
          {t.guide}
        </button>
      </div>

      {/* Main Form Dashboard */}
      <div className="space-y-6 flex-1">
        
        {/* Player Count */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <label className="text-black text-xs font-black uppercase tracking-wider">{t.players}</label>
            <span className="text-[10px] bg-slate-100 border border-black px-2 py-0.5 rounded font-bold">1 VS 1 MODE</span>
          </div>
          <div className="flex gap-2.5">
            {[4, 6, 8].map(count => {
              const isSelected = settings.playerCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => updateSettings('playerCount', count)}
                  className={`pixel-btn flex-1 py-2.5 flex flex-col items-center justify-center font-bold transition-all ${
                    isSelected 
                    ? 'pixel-btn-lime border-4 text-black' 
                    : 'pixel-btn-dark border-4 text-slate-300'
                  }`}
                >
                  <span className="text-base font-black">{count} {t.players}</span>
                  <span className="text-[9px] font-bold opacity-80 uppercase">({count/2} Teams)</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Rounds Count Slider */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-black text-xs font-black uppercase tracking-wider">{t.rounds}</label>
            <span className="bg-[#ff007f] text-white px-3 py-1 border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_0px_#000000]">
              {settings.roundsCount} {t.round}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-slate-400">3</span>
            <input 
              type="range" min="3" max="10" step="1"
              value={settings.roundsCount}
              onChange={(e) => updateSettings('roundsCount', parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-[#ff007f]"
              style={{ outline: 'none' }}
            />
            <span className="text-xs font-bold text-slate-400">10</span>
          </div>
        </section>

        {/* Round Duration Slider */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-black text-xs font-black uppercase tracking-wider">{t.duration}</label>
            <span className="bg-[#00d2ff] text-black px-3 py-0.5 border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_0px_#000000]">
              {settings.roundDuration} {t.seconds}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-slate-400">60s</span>
            <input 
              type="range" min="60" max="300" step="15"
              value={settings.roundDuration}
              onChange={(e) => updateSettings('roundDuration', parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-[#00d2ff]"
              style={{ outline: 'none' }}
            />
            <span className="text-xs font-bold text-slate-400">300s</span>
          </div>
        </section>
      </div>

      {/* Decorative Mascot Buddy */}
      <div className="my-3 flex items-center justify-center gap-2">
        <TeamMascot color="BLUE" size={40} className="opacity-95" />
        <p className="text-[10px] text-slate-600 bg-white/75 px-3 py-1 border border-black rounded-lg font-bold shadow-[1px_1px_0px_0px_#000000]">
          {settings.language === 'fa' ? '🕹️ سطح آسان تا سخت را تنظیم کنید!' : '🎮 Set the rounds count and timer!'}
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-4 mt-4">
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
          {t.next} 🚀
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
