
import React from 'react';
import { GameSettings } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  settings: GameSettings;
  onSave: (s: GameSettings) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const CategoryScreen: React.FC<Props> = ({ settings, onSave, onNext, onBack, onOpenHelp }) => {
  const toggleCategory = (cat: string) => {
    let selected = [...settings.selectedCategories];
    if (selected.includes(cat)) {
      if (selected.length > 1) {
        selected = selected.filter(s => s !== cat);
      }
    } else {
      selected.push(cat);
    }
    onSave({ ...settings, selectedCategories: selected });
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">انتخاب دسته‌بندی</h2>
        <button onClick={onOpenHelp} className="p-2 text-indigo-600 font-bold">راهنما</button>
      </div>

      <p className="text-slate-500 text-xs mb-4">حداقل یک دسته را انتخاب کنید. کلمات به صورت تصادفی از این دسته‌ها انتخاب می‌شوند.</p>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {Object.keys(CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
              settings.selectedCategories.includes(cat)
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <span className="font-bold">{cat}</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
              settings.selectedCategories.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'
            }`}>
              {settings.selectedCategories.includes(cat) && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 py-4 text-slate-500 font-bold">بازگشت</button>
        <button onClick={onNext} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl shadow-lg font-bold">مرحله بعد</button>
      </div>
    </div>
  );
};

export default CategoryScreen;
