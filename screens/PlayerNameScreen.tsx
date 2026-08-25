import React from 'react';
import { GameSettings, TeamColor } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';

interface Props {
  settings: GameSettings;
  onSave: (s: GameSettings) => void;
  onStart: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const PlayerNameScreen: React.FC<Props> = ({ settings, onSave, onStart, onBack, onOpenHelp }) => {
  const t = TRANSLATIONS[settings.language];
  const isRTL = settings.language === 'fa' || settings.language === 'ar';
  
  const getTeamColor = (index: number): TeamColor => {
    const teamIndex = index % (settings.playerCount / 2);
    return Object.values(TeamColor)[teamIndex];
  };

  const updateName = (index: number, name: string) => {
    const names = [...settings.playerNames];
    names[index] = name;
    onSave({ ...settings, playerNames: names });
  };

  const isReady = settings.playerNames.slice(0, settings.playerCount).every(n => n.trim().length > 0);

  // Local names for team colors
  const labelColorText = (color: TeamColor) => {
    return t.teamNames[color] || color;
  };

  return (
    <div className="flex-1 flex flex-col p-5 select-none overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-black text-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#ff007f]">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚔️</span>
          <h2 className="text-lg font-bold uppercase tracking-wider">{t.playerNames}</h2>
        </div>
        <button 
          onClick={onOpenHelp} 
          className="px-3 py-1 bg-[#ff007f] text-white border-2 border-black font-bold text-xs rounded hover:bg-pink-600 transition-colors"
        >
          {t.guide}
        </button>
      </div>

      <p className="text-slate-700 text-[11px] font-bold mb-4 bg-white/80 p-2 border-2 border-black rounded-lg text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        👥 {t.namesHint}
      </p>

      {/* Players Input Form */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-2">
        {Array.from({ length: settings.playerCount }).map((_, i) => {
          const color = getTeamColor(i);
          const colorConfig = COLORS_MAP[color];
          
          return (
            <div key={i} className="flex items-center gap-3 bg-white p-3 border-4 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000000]">
              {/* Mascot & Number Badge */}
              <div className="flex flex-col items-center justify-center flex-shrink-0">
                <TeamMascot color={color} size={42} animate={false} />
                <div className={`mt-0.5 px-2 py-0.5 rounded text-[8px] font-black border border-black text-white ${colorConfig.bg} shadow-[1px_1px_0px_0px_#0] uppercase`}>
                  #{i + 1} {labelColorText(color)}
                </div>
              </div>

              {/* Name Input Box */}
              <input 
                type="text" 
                maxLength={12}
                placeholder={`${t.players} ${i + 1}`}
                value={settings.playerNames[i]}
                onChange={(e) => updateName(i, e.target.value)}
                className="flex-1 p-3 bg-slate-50 border-2 border-black rounded-xl focus:bg-white focus:outline-none transition-all font-bold text-sm text-slate-800"
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-3">
        <button 
          onClick={onBack} 
          className="pixel-btn pixel-btn-dark flex-1 py-3.5 text-sm font-bold uppercase tracking-wider"
        >
          {t.back}
        </button>
        <button 
          onClick={() => isReady && onStart()} 
          disabled={!isReady}
          className={`pixel-btn flex-[2] py-3.5 text-base font-black uppercase tracking-wider ${
            isReady ? 'pixel-btn-lime' : 'disabled'
          }`}
        >
          🚀 {t.start}
        </button>
      </div>
    </div>
  );
};

export default PlayerNameScreen;
