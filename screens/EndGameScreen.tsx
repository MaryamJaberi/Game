
import React from 'react';
import { Team, Player, TeamColor } from '../types';
import { COLORS_MAP } from '../constants';

interface Props {
  winners: Team[];
  players: Player[];
  onRestart: () => void;
}

const EndGameScreen: React.FC<Props> = ({ winners, players, onRestart }) => {
  const isTie = winners.length > 1;
  const winnerColor = winners[0]?.color || TeamColor.Blue;
  const config = COLORS_MAP[winnerColor];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-indigo-50">
      <div className="mb-10 animate-bounce">
        <svg className="w-24 h-24 text-amber-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>

      <h1 className="text-4xl font-black text-indigo-900 mb-2">
        {isTie ? "بازی مساوی شد!" : "برنده بازی مشخص شد!"}
      </h1>
      
      {!isTie && (
        <div className={`mt-6 p-6 rounded-3xl shadow-xl ${config.bg} ${config.text} w-full`}>
          <div className="text-sm opacity-80 mb-2">تیم قهرمان</div>
          <div className="text-3xl font-black mb-4">تیم {winnerColor === TeamColor.Blue ? 'آبی' : winnerColor === TeamColor.Red ? 'قرمز' : winnerColor === TeamColor.Green ? 'سبز' : 'زرد'}</div>
          <div className="flex flex-col gap-1">
            {players.filter(p => p.teamId === winners[0].id).map(p => (
              <span key={p.id} className="text-xl font-bold">{p.name}</span>
            ))}
          </div>
        </div>
      )}

      {isTie && (
        <div className="space-y-4 w-full">
          {winners.map(w => (
            <div key={w.id} className={`${COLORS_MAP[w.color].bg} ${COLORS_MAP[w.color].text} p-4 rounded-2xl shadow-md`}>
              <span className="font-bold">{players.filter(p => p.teamId === w.id).map(p => p.name).join(' و ')}</span>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={onRestart}
        className="mt-12 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-transform w-full"
      >
        بازگشت به منو
      </button>
    </div>
  );
};

export default EndGameScreen;
