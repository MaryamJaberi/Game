import React from 'react';
import { GameHistoryEntry, TeamColor, Language } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
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
      <div className="p-4 bg-black border-b-4 border-black flex items-center justify-between z-10 text-white shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <h2 className="text-lg font-black uppercase tracking-wider">{t.history}</h2>
        </div>
        <button 
          onClick={() => {
            sound.playClick();
            onBack();
          }} 
          className="w-16 h-9 flex items-center justify-center bg-[#00d2ff] hover:bg-cyan-400 text-black border-2 border-black font-black text-xs rounded-lg active:translate-y-0.5"
        >
          {t.back}
        </button>
      </div>

      {/* Scores Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {history.length === 0 ? (
          /* Empty scoreboard state with sad yellow dorky mascot */
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="animate-party-float">
              <TeamMascot color={TeamColor.Yellow} size={110} />
            </div>
            <div className="bg-white p-4 border-4 border-black rounded-2xl shadow-[3px_3px_0px_0px_#0] max-w-xs">
              <span className="text-[10px] bg-slate-100 border border-black px-2 py-0.5 rounded font-black uppercase">NO DATA REGISTERED</span>
              <p className="text-xs font-bold text-slate-500 mt-2">
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
                className="bg-white p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_#0] flex items-center justify-between gap-3 relative transition-all hover:scale-[1.01]"
              >
                {/* Score listing details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono text-slate-400 tracking-wider mb-1 uppercase">
                    📅 {entry.date}
                  </div>
                  <div className="text-slate-800 font-black text-sm uppercase tracking-tight flex items-center gap-1">
                    👑 <span className="truncate">{entry.winnerNames.join(' & ')}</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 truncate mt-1">
                    {t.players}: {entry.players.join(', ')}
                  </div>
                </div>

                {/* Shield badge */}
                <div 
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex-shrink-0 ${winnerBg}`}
                  style={{ backgroundColor: winnerHex }}
                >
                  <span className="text-lg">🏆</span>
                  <span className="text-[7px] text-white/90 font-black tracking-tighter uppercase leading-none">
                    {entry.winnerColor === 'TIE' ? 'TIE' : entry.winnerColor.slice(0, 4)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Return footer tab */}
      <div className="p-4 bg-slate-100 border-t-4 border-black z-10">
        <button 
          onClick={() => {
            sound.playClick();
            onBack();
          }} 
          className="pixel-btn pixel-btn-dark w-full py-4 text-base font-black uppercase tracking-wider"
        >
          🎮 {t.back}
        </button>
      </div>
    </div>
  );
};

export default HistoryScreen;
