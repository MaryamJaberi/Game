
import React from 'react';
import { GameSettings } from '../types';

interface Props {
  settings: GameSettings;
  onSave: (s: GameSettings) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const SetupScreen: React.FC<Props> = ({ settings, onSave, onNext, onBack, onOpenHelp }) => {
  const updateSettings = (key: keyof GameSettings, value: any) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">تنظیمات اولیه</h2>
        <button onClick={onOpenHelp} className="p-2 text-indigo-600 font-bold">راهنما</button>
      </div>

      <div className="space-y-8 flex-1">
        {/* Player Count */}
        <section>
          <label className="block text-slate-600 mb-3 text-sm font-semibold">تعداد بازیکنان</label>
          <div className="flex gap-2">
            {[4, 6, 8].map(count => (
              <button
                key={count}
                onClick={() => updateSettings('playerCount', count)}
                className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
                  settings.playerCount === count 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                {count} نفر
                <div className="text-[10px] font-normal opacity-70">({count/2} تیم)</div>
              </button>
            ))}
          </div>
        </section>

        {/* Rounds Count */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-slate-600 text-sm font-semibold">تعداد دورها</label>
            <span className="text-indigo-600 font-bold">{settings.roundsCount} دور</span>
          </div>
          <input 
            type="range" min="3" max="10" step="1"
            value={settings.roundsCount}
            onChange={(e) => updateSettings('roundsCount', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </section>

        {/* Round Duration */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-slate-600 text-sm font-semibold">زمان هر دور</label>
            <span className="text-indigo-600 font-bold">{settings.roundDuration} ثانیه</span>
          </div>
          <input 
            type="range" min="60" max="300" step="15"
            value={settings.roundDuration}
            onChange={(e) => updateSettings('roundDuration', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="text-[11px] text-slate-400 mt-2 text-center">
            زمان کل تیم: {Math.floor((settings.roundsCount * settings.roundDuration) / (settings.playerCount / 2))} ثانیه
          </div>
        </section>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex-1 py-4 text-slate-500 font-bold">بازگشت</button>
        <button onClick={onNext} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl shadow-lg font-bold">مرحله بعد</button>
      </div>
    </div>
  );
};

export default SetupScreen;
