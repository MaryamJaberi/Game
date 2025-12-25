
import React from 'react';

interface Props {
  onNext: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

const IntroScreen: React.FC<Props> = ({ onNext, onOpenHistory, onOpenHelp }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 text-center bg-gradient-to-b from-indigo-600 to-indigo-800 text-white">
      <div className="mt-20">
        <h1 className="text-7xl font-bold mb-4 drop-shadow-lg">دُور</h1>
        <p className="text-xl opacity-90">بازی گروهی کلمات</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={onNext}
          className="bg-white text-indigo-800 font-bold py-4 px-8 rounded-2xl shadow-xl active:scale-95 transition-transform text-xl"
        >
          شروع بازی جدید
        </button>
        
        <button 
          onClick={onOpenHistory}
          className="bg-indigo-700/50 text-white font-semibold py-3 px-8 rounded-xl active:scale-95 transition-transform"
        >
          تاریخچه بازی‌ها
        </button>

        <button 
          onClick={onOpenHelp}
          className="text-indigo-200 text-sm hover:underline"
        >
          راهنمای بازی
        </button>
      </div>

      <div className="mb-8 text-indigo-300 text-xs">
        نسخه ۱.۰.۰
      </div>
    </div>
  );
};

export default IntroScreen;
