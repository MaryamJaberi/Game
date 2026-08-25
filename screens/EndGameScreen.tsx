import React, { useEffect } from 'react';
import { Team, Player, TeamColor, Language } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { NeonTrophy, NeonCrown, NeonLightning, NeonSparkle } from '../components/NeonIcons';
import { sound } from '../soundManager';

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
  const config = COLORS_MAP[winnerColor] || { bg: 'bg-[#00F0FF]', text: 'text-[#160430]', hex: '#00F0FF' };

  const isRTL = language === 'fa' || language === 'ar';

  useEffect(() => {
    sound.playWinner();
  }, []);

  function labelWinnerNames(teamId: number): string {
    return players.filter(p => p.teamId === teamId).map(p => p.name).join(' & ');
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-5 text-center select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Pool warning banner */}
      {isPoolExhausted && (
        <div className="mb-3 px-4 py-2 bg-[#FFE600] border-[2.5px] border-[#160430] text-[#160430] rounded-2xl font-black text-xs shadow-[2px_2px_0px_0px_#160430] flex items-center gap-2">
          <NeonLightning size={16} color="#160430" glow={false} />
          <span>{t.wordsFinished}</span>
        </div>
      )}

      {/* Dazzling Neon Trophy */}
      <div className="mb-3 relative animate-bounce">
        <div className="absolute -inset-3 bg-[#FFE600] rounded-full blur-xl opacity-40 animate-pulse"></div>
        <NeonTrophy size={80} color="#FFE600" />
      </div>

      {/* Victory Header Card with Party & Co SHOCK 3D Border */}
      <div className="pixel-card-shock bg-gradient-to-br from-[#1C002B] via-[#2D0658] to-[#160430] text-white p-5 w-full mb-3.5 border-[3.5px] border-[#160430] shadow-[5px_5px_0px_0px_#160430] rounded-3xl">
        <div className="flex items-center justify-center gap-2 mb-1">
          <NeonSparkle size={18} color="#00F0FF" />
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] via-[#FF007F] to-[#00F0FF]">
            {isTie ? t.tie : winners.length === 1 ? t.winner : t.winners}
          </h1>
          <NeonSparkle size={18} color="#FFE600" />
        </div>
        <p className="text-[11px] text-[#00F0FF] font-black uppercase tracking-widest mt-1">
          {language === 'fa' ? '✨ ماجراجویی با موفقیت به پایان رسید! ✨' : '✨ CHAMPIONS OF THE PARTY! ✨'}
        </p>
      </div>
      
      {/* Winning details card */}
      {!isTie && winners.length === 1 ? (
        <div 
          className="w-full bg-white p-5 rounded-3xl border-[3.5px] border-[#160430] shadow-[5px_5px_0px_0px_#160430] relative overflow-hidden"
          style={{ borderColor: config.hex }}
        >
          {/* Winner mascot sidemount */}
          <div className="absolute -right-2 top-0 opacity-20">
            <TeamMascot color={winnerColor} size={100} animate={false} />
          </div>

          <div 
            className={`text-xl font-black uppercase mb-3 ${config.text} py-2 px-5 rounded-2xl border-2 border-[#160430] inline-flex items-center gap-2 shadow-[3px_3px_0px_0px_#160430]`}
            style={{ backgroundColor: config.hex }}
          >
            <NeonCrown size={20} color="#160430" glow={false} />
            <span>{t.teamNames[winnerColor]}</span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-2">
            {players.filter(p => p.teamId === winners[0].id).map(p => (
              <span key={p.id} className="text-base sm:text-lg font-black text-[#160430] bg-[#F8EFFF] border-2 border-[#160430] px-4 py-2 rounded-xl w-11/12 shadow-[2px_2px_0px_0px_#160430] flex items-center justify-center gap-2">
                <NeonCrown size={16} color="#FFE600" glow={false} />
                <span>{p.name}</span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* TIED SCORE CARDS */
        <div className="bg-white p-4 rounded-3xl border-[3.5px] border-[#160430] shadow-[5px_5px_0px_0px_#160430] w-full space-y-3">
          <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.winners}</div>
          {winners.map(w => {
            const configW = COLORS_MAP[w.color] || { bg: 'bg-[#00F0FF]', text: 'text-[#160430]', hex: '#00F0FF' };
            return (
              <div 
                key={w.id} 
                className="p-3 rounded-2xl border-[2.5px] border-[#160430] text-[#160430] font-bold flex items-center justify-between shadow-[2px_2px_0px_0px_#160430]"
                style={{ borderLeftWidth: '6px', borderLeftColor: configW.hex }}
              >
                <div className="flex items-center gap-2">
                  <TeamMascot color={w.color} size={32} animate={false} />
                  <span className="font-black truncate text-sm">{labelWinnerNames(w.id)}</span>
                </div>
                <span className="text-[10px] bg-[#39FF14] text-[#160430] border border-[#160430] px-2 py-0.5 rounded-lg font-black">
                  MUTUAL SCORE
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Celebrating animated mascot */}
      <div className="my-3 flex flex-col items-center">
        <TeamMascot color="PARTY" size={80} className="animate-party-float" />
        <span className="text-[11px] text-[#160430] uppercase font-black tracking-widest mt-1 bg-white px-3 py-1 rounded-full border-2 border-[#160430] shadow-[2px_2px_0px_0px_#160430]">
          {language === 'fa' ? '🎈 تبریک به قهرمانان دورهمی!' : '🎉 GG WP! PARTY TIME!'}
        </span>
      </div>

      {/* Play Again button in neon pink */}
      <button 
        type="button"
        onClick={() => {
          sound.playClick();
          onRestart();
        }}
        className="pixel-btn pixel-btn-pink w-full py-4 text-base font-black uppercase tracking-wider text-white flex items-center justify-center gap-2"
      >
        <span>🔄 {t.returnMenu}</span>
        <NeonLightning size={20} color="#FFE600" />
      </button>

    </div>
  );
};

export default EndGameScreen;
