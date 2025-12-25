
import React from 'react';
import { GameHistoryEntry, TeamColor } from '../types';
import { COLORS_MAP } from '../constants';

interface Props {
  history: GameHistoryEntry[];
  onBack: () => void;
}

const HistoryScreen: React.FC<Props> = ({ history, onBack }) => {
  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">تاریخچه بازی‌ها</h2>
        <button onClick={onBack} className="p-2 text-indigo-600 font-bold">بازگشت</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {history.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <p>هنوز هیچ بازی‌ای انجام نشده است.</p>
          </div>
        ) : (
          history.map(entry => (
            <div key={entry.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-[10px] text-slate-400 mb-1">{entry.date}</div>
                <div className="text-slate-800 font-bold text-sm">
                  {entry.winnerNames.join(' و ')}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">
                  بازیکنان: {entry.players.join('، ')}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0 ${
                entry.winnerColor === 'TIE' ? 'bg-slate-400' : COLORS_MAP[entry.winnerColor as TeamColor].bg
              }`}>
                {entry.winnerColor === 'TIE' ? '=' : '🏆'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
