import React from 'react';
import { Team, Player, TeamColor, Language } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';

interface Props {
  winners: Team[];
  players: Player[];
  onRestart: () => void;
  language: Language;
  isPoolExhausted?: boolean;
}

const EndGameScreen: React.FC<Props> = ({ winners, players, onRestart, language, isPoolExhausted }) => {
  const t = TRANSLATIONS[language];
  const isTie = winners.length > 1;
  const winnerColor = winners[0]?.color || TeamColor.Blue;
  const config = COLORS_MAP[winnerColor] || { bg: 'bg-indigo-600', text: 'text-white' };

  const isRTL = language === 'fa' || language === 'ar';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Pool warning banner */}
      {isPoolExhausted && (
        <div className="mb-4 px-4 py-2 bg-yellow-100 border-4 border-black text-black rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
           ⚠️ <span>{t.wordsFinished}</span>
        </div>
      )}

      {/* Dazzling Trophy Icon wrapper */}
      <div className="mb-6 relative animate-bounce">
        <div className="absolute -inset-2 bg-yellow-300 rounded-full blur opacity-35 animate-pulse"></div>
        <svg className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-[5px_5px_0px_#000000] relative" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          <circle cx="10" cy="8" r="4" fill="#000" />
          <circle cx="10" cy="8" r="2.5" fill="#ffd200" />
        </svg>
      </div>

      {/* Victory Header Card */}
      <div className="pixel-card-neon bg-[#190040] text-white p-5 w-full mb-6">
        <h1 className="text-3xl font-black font-display uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">
          🏆 {isTie ? t.tie : winners.length === 1 ? t.winner : t.winners} 🏆
        </h1>
        <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest mt-1">
          {language === 'fa' ? 'ماجراجویی به پایان رسید!' : 'THE ADVENTURE COMPLETED!'}
        </p>
      </div>
      
      {/* Winning details card, double bordered in winner's team accent color */}
      {!isTie && winners.length === 1 ? (
        <div 
          className="w-full bg-white p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
          style={{ borderColor: config.hex }}
        >
          {/* Winner mascot sidemount */}
          <div className="absolute -right-2 top-0 opacity-15">
            <TeamMascot color={winnerColor} size={100} animate={false} />
          </div>

          <div className={`text-2xl font-black uppercase mb-3 ${config.text} bg-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] py-2.5 px-4 rounded-xl border-2 border-black inline-block`}>
            {t.teamNames[winnerColor]}
          </div>

          <div className="flex flex-col items-center gap-1.5 mt-2">
            {players.filter(p => p.teamId === winners[0].id).map(p => (
              <span key={p.id} className="text-lg font-black text-slate-800 bg-slate-50 border-2 border-slate-200 px-4 py-1.5 rounded-lg w-10/12">
                👑 {p.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* TIED SCORE CARDS */
        <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#0] w-full space-y-4">
          <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.winners}</div>
          {winners.map(w => {
            const configW = COLORS_MAP[w.color] || { bg: 'bg-indigo-600', text: 'text-white' };
            return (
              <div 
                key={w.id} 
                className="p-3.5 rounded-xl border-4 border-black text-black font-bold flex items-center justify-between"
                style={{ borderColor: configW.hex }}
              >
                <div className="flex items-center gap-2">
                  <TeamMascot color={w.color} size={30} animate={false} />
                  <span className="font-black truncate">{labelWinnerNames(w.id)}</span>
                </div>
                <span className="text-[10.5px] bg-[#39ff14] border border-black px-2 py-0.5 rounded font-bold">MUTUAL SCORE</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Celebrating animated mascot blob */}
      <div className="my-5 flex flex-col items-center">
        <TeamMascot color="PARTY" size={80} className="animate-party-float" />
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
          {language === 'fa' ? '🎈 تبریک به قهرمانان!' : '🎉 GG WP! PARTY TIME!'}
        </span>
      </div>

      {/* Play Again button in neon pink */}
      <button 
        type="button"
        onClick={onRestart}
        className="pixel-btn pixel-btn-pink w-full py-4 text-lg font-black uppercase tracking-wider"
      >
        🔄 {t.returnMenu}
      </button>

    </div>
  );

  // Helper routine to format winner names
  function labelWinnerNames(teamId: number): string {
    return players.filter(p => p.teamId === teamId).map(p => p.name).join(' & ');
  }
};

export default EndGameScreen;
