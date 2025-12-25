
import React from 'react';
import { GameSettings, TeamColor } from '../types';
import { COLORS_MAP } from '../constants';

interface Props {
  settings: GameSettings;
  onSave: (s: GameSettings) => void;
  onStart: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const PlayerNameScreen: React.FC<Props> = ({ settings, onSave, onStart, onBack, onOpenHelp }) => {
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

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">نام بازیکنان</h2>
        <button onClick={onOpenHelp} className="p-2 text-indigo-600 font-bold">راهنما</button>
      </div>

      <p className="text-slate-500 text-xs mb-4">یارها (هم‌تیمی‌ها) در دایره روبروی هم می‌نشینند. نوبت‌ها ساعتگرد است.</p>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {Array.from({ length: settings.playerCount }).map((_, i) => {
          const color = getTeamColor(i);
          const colorConfig = COLORS_MAP[color];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${colorConfig.bg}`}>
                {i + 1}
              </div>
              <input 
                type="text" 
                placeholder={`نام بازیکن ${i + 1}`}
                value={settings.playerNames[i]}
                onChange={(e) => updateName(i, e.target.value)}
                className="flex-1 p-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 py-4 text-slate-500 font-bold">بازگشت</button>
        <button 
          onClick={() => isReady && onStart()} 
          disabled={!isReady}
          className={`flex-[2] py-4 rounded-2xl shadow-lg font-bold transition-all ${
            isReady ? 'bg-indigo-600 text-white active:scale-95' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          شروع بازی
        </button>
      </div>
    </div>
  );
};

export default PlayerNameScreen;
