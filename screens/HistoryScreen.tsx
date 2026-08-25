import React from 'react';
import { GameHistoryEntry, TeamColor, Language } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { NeonTrophy, NeonCrown, NeonLightning } from '../components/NeonIcons';
import { sound } from '../soundManager';

interface Props {
  language: Language;
  history: GameHistoryEntry[];
  onBack: () => void;
}

const HistoryScreen: React.FC<Props> = ({ language, history, onBack }) => {
  const t = TRANSLATIONS[language];
  const isRTL = language === 'fa' || language === 'ar';

  return (
    <div className="flex-1 flex flex-col bg-pixel-grid overflow-hidden select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Panel */}
      <div className="p-3.5 bg-gradient-to-r from-[#7B2CBF] via-[#FF007F] to-[#FF2E93] border-b-4 border-[#160430] flex items-center justify-between z-10 text-white shadow-[0px_3px_0px_0px_#160430]">
        <div className="flex items-center gap-2">
          <NeonTrophy size={22} color="#FFE600" />
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">{t.history}</h2>
        </div>
        <button 
          onClick={() => {
            sound.playClick();
            onBack();
          }} 
          className="w-16 h-9 flex items-center justify-center bg-[#FFE600] hover:bg-yellow-300 text-[#160430] border-2 border-[#160430] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#160430] active:translate-y-0.5"
        >
          {t.back}
        </button>
      </div>

      {/* Scores Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          /* Empty scoreboard state */
          <div className="flex flex-col items-center justify-center py-14 text-center space-y-4">
            <div className="animate-party-float">
              <TeamMascot color={TeamColor.Yellow} size={100} />
            </div>
            <div className="bg-white p-4 border-[3px] border-[#160430] rounded-2xl shadow-[3px_3px_0px_0px_#160430] max-w-xs">
              <span className="text-[10px] bg-[#FFE600] border border-[#160430] px-2 py-0.5 rounded-lg font-black uppercase text-[#160430]">
                ⚡ NO GAMES YET
              </span>
              <p className="text-xs font-black text-slate-600 mt-2">
                {t.noHistory || 'No games found in this session yet.'}
              </p>
            </div>
          </div>
        ) : (
          /* High scores list */
          history.map(entry => {
            const hasColorMatch = entry.winnerColor !== 'TIE';
            const winnerBg = hasColorMatch ? COLORS_MAP[entry.winnerColor as TeamColor]?.bg : 'bg-slate-400';
            const winnerHex = hasColorMatch ? COLORS_MAP[entry.winnerColor as TeamColor]?.hex : '#94a3b8';

            return (
              <div 
                key={entry.id} 
                className="bg-white p-3.5 rounded-2xl border-[3px] border-[#160430] shadow-[3px_3px_0px_0px_#160430] flex items-center justify-between gap-3 relative transition-all hover:scale-[1.01]"
              >
                {/* Score listing details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-slate-500 tracking-wider mb-1 uppercase">
                    📅 {entry.date}
                  </div>
                  <div className="text-[#160430] font-black text-sm uppercase tracking-tight flex items-center gap-1.5">
                    <NeonCrown size={16} color="#FFE600" glow={false} />
                    <span className="truncate">{entry.winnerNames.join(' & ')}</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 truncate mt-1">
                    {t.players}: {entry.players.join(', ')}
                  </div>
                </div>

                {/* Shield badge */}
                <div 
                  className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-[2px_2px_0px_0px_#160430] border-2 border-[#160430] flex-shrink-0 ${winnerBg}`}
                  style={{ backgroundColor: winnerHex }}
                >
                  <NeonTrophy size={18} color="#160430" glow={false} />
                  <span className="text-[8px] text-[#160430] font-black tracking-tighter uppercase leading-none mt-0.5">
                    {entry.winnerColor === 'TIE' ? 'TIE' : entry.winnerColor.slice(0, 4)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Return footer tab */}
      <div className="p-3.5 bg-white border-t-4 border-[#160430] z-10">
        <button 
          onClick={() => {
            sound.playClick();
            onBack();
          }} 
          className="pixel-btn pixel-btn-dark w-full py-3.5 text-base font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>{t.back}</span>
          <NeonLightning size={18} color="#00F0FF" />
        </button>
      </div>
    </div>
  );
};

export default HistoryScreen;
