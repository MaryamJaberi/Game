import React from 'react';
import { GameSettings } from '../types';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
import { NeonLightning, NeonBook, NeonSparkle, NeonVolume, NeonClock } from '../components/NeonIcons';
import { sound } from '../soundManager';

interface Props {
  settings: GameSettings;
  onSave: (s: GameSettings) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenHelp: () => void;
}

const SetupScreen: React.FC<Props> = ({ settings, onSave, onNext, onBack, onOpenHelp }) => {
  const t = TRANSLATIONS[settings.language];
  const isRTL = settings.language === 'fa' || settings.language === 'ar';
  
  const updateSettings = (key: keyof GameSettings, value: any) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header with Party & Co SHOCK YOU! styling */}
      <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-[#7B2CBF] via-[#FF007F] to-[#FF2E93] text-white p-3.5 border-[3.5px] border-[#160430] rounded-2xl shadow-[4px_4px_0px_0px_#160430]">
        <div className="flex items-center gap-2">
          <NeonLightning size={22} color="#FFE600" />
          <h2 className="text-base md:text-lg font-black uppercase tracking-wider">{t.setup}</h2>
        </div>
        <button 
          onClick={() => {
            sound.playClick();
            onOpenHelp();
          }} 
          className="px-3 py-1 bg-[#FFE600] hover:bg-yellow-300 text-[#160430] border-2 border-[#160430] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#160430] transition-colors flex items-center gap-1"
        >
          <NeonBook size={14} color="#160430" glow={false} />
          <span>{t.guide}</span>
        </button>
      </div>

      {/* Main Form Dashboard */}
      <div className="space-y-3.5 flex-1 overflow-y-auto pr-1 pb-2">
        
        {/* Player Count */}
        <section className="bg-white p-3.5 sm:p-4 border-[3.5px] border-[#160430] shadow-[4px_4px_0px_0px_#160430] rounded-2xl">
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-[#160430] text-xs font-black uppercase tracking-wider">{t.players}</label>
            <span className="text-[10px] bg-[#FFE600] border-2 border-[#160430] text-[#160430] px-2 py-0.5 rounded-lg font-black">
              ⚡ 1 VS 1 MODE
            </span>
          </div>
          <div className="flex gap-2">
            {[4, 6, 8].map(count => {
              const isSelected = settings.playerCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    sound.playToggle();
                    updateSettings('playerCount', count);
                  }}
                  className={`pixel-btn flex-1 py-2.5 flex flex-col items-center justify-center font-black transition-all ${
                    isSelected 
                    ? 'pixel-btn-lime text-[#160430]' 
                    : 'pixel-btn-dark text-[#00F0FF]'
                  }`}
                >
                  <span className="text-base font-black">{count} {t.players}</span>
                  <span className="text-[9px] font-bold opacity-90 uppercase">({count/2} Teams)</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Word Difficulty Levels */}
        <section className="bg-white p-3.5 sm:p-4 border-[3.5px] border-[#160430] shadow-[4px_4px_0px_0px_#160430] rounded-2xl">
          <div className="flex justify-between items-center mb-2.5">
            <div>
              <label className="text-[#160430] text-xs font-black uppercase tracking-wider block">
                {t.difficulty_title || (settings.language === 'fa' ? 'سطح سختی کلمات' : 'Word Difficulty')}
              </label>
              <span className="text-[10px] text-slate-600 font-bold">
                {t.difficulty_hint || (settings.language === 'fa' ? 'تک‌کلمه‌ای، ترکیبی یا ضرب‌المثل‌ها' : 'Choose word complexity')}
              </span>
            </div>
            <span className={`px-2.5 py-0.5 border-2 border-[#160430] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#160430] ${
              (settings.difficulty || 'easy') === 'easy' ? 'bg-[#39FF14] text-[#160430]' :
              settings.difficulty === 'medium' ? 'bg-[#FFE600] text-[#160430]' :
              settings.difficulty === 'hard' ? 'bg-[#FF1058] text-white' : 'bg-[#00F0FF] text-[#160430]'
            }`}>
              {(settings.difficulty || 'easy') === 'easy' ? (settings.language === 'fa' ? '🟢 آسان' : '🟢 Easy') :
               settings.difficulty === 'medium' ? (settings.language === 'fa' ? '🟡 متوسط' : '🟡 Medium') :
               settings.difficulty === 'hard' ? (settings.language === 'fa' ? '🔴 سخت' : '🔴 Hard') :
               (settings.language === 'fa' ? '🌈 ترکیبی' : '🌈 Mixed')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Easy */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'easy');
              }}
              className={`pixel-btn p-2.5 flex flex-col items-start justify-between text-start rounded-xl transition-all ${
                (settings.difficulty || 'easy') === 'easy'
                  ? 'pixel-btn-lime text-[#160430] ring-2 ring-[#160430]'
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <div className="flex items-center gap-1 w-full justify-between">
                <span className="font-black text-xs">🟢 {t.difficultyLevels?.easy || 'آسان'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/20 rounded font-black">L1</span>
              </div>
              <span className="text-[10px] opacity-90 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.easy || (settings.language === 'fa' ? 'تک‌کلمه‌ای' : 'Single Words')}
              </span>
            </button>

            {/* Medium */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'medium');
              }}
              className={`pixel-btn p-2.5 flex flex-col items-start justify-between text-start rounded-xl transition-all ${
                settings.difficulty === 'medium'
                  ? 'pixel-btn-yellow text-[#160430] ring-2 ring-[#160430]'
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <div className="flex items-center gap-1 w-full justify-between">
                <span className="font-black text-xs">🟡 {t.difficultyLevels?.medium || 'متوسط'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/20 rounded font-black">L2</span>
              </div>
              <span className="text-[10px] opacity-90 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.medium || (settings.language === 'fa' ? 'کلمات ترکیبی' : 'Compound 2-Words')}
              </span>
            </button>

            {/* Hard */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'hard');
              }}
              className={`pixel-btn p-2.5 flex flex-col items-start justify-between text-start rounded-xl transition-all ${
                settings.difficulty === 'hard'
                  ? 'pixel-btn-pink text-white ring-2 ring-[#160430]'
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <div className="flex items-center gap-1 w-full justify-between">
                <span className="font-black text-xs">🔴 {t.difficultyLevels?.hard || 'سخت'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/20 rounded font-black">L3</span>
              </div>
              <span className="text-[10px] opacity-90 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.hard || (settings.language === 'fa' ? 'عبارات و ضرب‌المثل‌ها' : 'Proverbs & Phrases')}
              </span>
            </button>

            {/* Mixed / All */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'all');
              }}
              className={`pixel-btn p-2.5 flex flex-col items-start justify-between text-start rounded-xl transition-all ${
                settings.difficulty === 'all'
                  ? 'pixel-btn-cyan text-[#160430] ring-2 ring-[#160430]'
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <div className="flex items-center gap-1 w-full justify-between">
                <span className="font-black text-xs">🌈 {t.difficultyLevels?.all || 'ترکیبی'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/20 rounded font-black">All</span>
              </div>
              <span className="text-[10px] opacity-90 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.all || (settings.language === 'fa' ? 'ترکیب همه سطوح' : 'All Tiers')}
              </span>
            </button>
          </div>
        </section>

        {/* Rounds Count Slider */}
        <section className="bg-white p-3.5 sm:p-4 border-[3.5px] border-[#160430] shadow-[4px_4px_0px_0px_#160430] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#160430] text-xs font-black uppercase tracking-wider">{t.rounds}</label>
            <span className="bg-[#FF007F] text-white px-3 py-0.5 border-2 border-[#160430] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#160430]">
              {settings.roundsCount} {t.round}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-slate-500">3</span>
            <input 
              type="range" min="3" max="10" step="1"
              value={settings.roundsCount}
              onChange={(e) => {
                sound.playClick();
                updateSettings('roundsCount', parseInt(e.target.value));
              }}
              className="w-full h-3 bg-[#F4E8FF] border-2 border-[#160430] rounded-lg appearance-none cursor-pointer accent-[#FF007F]"
              style={{ outline: 'none' }}
            />
            <span className="text-xs font-bold text-slate-500">10</span>
          </div>
        </section>

        {/* Round Duration Slider */}
        <section className="bg-white p-3.5 sm:p-4 border-[3.5px] border-[#160430] shadow-[4px_4px_0px_0px_#160430] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#160430] text-xs font-black uppercase tracking-wider">{t.duration}</label>
            <span className="bg-[#00F0FF] text-[#160430] px-3 py-0.5 border-2 border-[#160430] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#160430]">
              {settings.roundDuration} {t.seconds}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-slate-500">60s</span>
            <input 
              type="range" min="60" max="300" step="15"
              value={settings.roundDuration}
              onChange={(e) => {
                sound.playClick();
                updateSettings('roundDuration', parseInt(e.target.value));
              }}
              className="w-full h-3 bg-[#F4E8FF] border-2 border-[#160430] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              style={{ outline: 'none' }}
            />
            <span className="text-xs font-bold text-slate-500">300s</span>
          </div>
        </section>

        {/* Turn Transition Mode */}
        <section className="bg-white p-3.5 sm:p-4 border-[3.5px] border-[#160430] shadow-[4px_4px_0px_0px_#160430] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#160430] text-xs font-black uppercase tracking-wider">
              {settings.language === 'fa' ? 'حالت انتقال نوبت' : 'Turn Transition Mode'}
            </label>
            <span className="bg-[#FFE600] text-[#160430] px-2.5 py-0.5 border-2 border-[#160430] font-black text-[10px] rounded-xl shadow-[2px_2px_0px_0px_#160430]">
              {settings.passPhoneScreenEnabled
                ? (settings.language === 'fa' ? 'صفحه تحویل گوشی' : 'Pass-Phone Screen')
                : (settings.language === 'fa' ? 'سرعت بالا ⚡ (پیش‌فرض)' : 'Fast Hot-Potato ⚡')}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('passPhoneScreenEnabled', false);
              }}
              className={`pixel-btn py-2.5 px-2 text-xs font-black uppercase flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
                !settings.passPhoneScreenEnabled
                  ? 'pixel-btn-lime text-[#160430] ring-2 ring-[#160430]'
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <span className="text-sm">⚡</span>
              <span className="text-[11px] leading-tight">
                {settings.language === 'fa' ? 'شروع فوری (Hot Potato)' : 'Fast Hot-Potato'}
              </span>
              <span className="text-[9px] font-bold opacity-80">
                {settings.language === 'fa' ? '(پیش‌فرض - بدون معطلی)' : '(Default - Instant)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('passPhoneScreenEnabled', true);
              }}
              className={`pixel-btn py-2.5 px-2 text-xs font-black uppercase flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
                settings.passPhoneScreenEnabled
                  ? 'pixel-btn-cyan text-[#160430] ring-2 ring-[#160430]'
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <span className="text-sm">📱</span>
              <span className="text-[11px] leading-tight">
                {settings.language === 'fa' ? 'صفحه تحویل و آمادگی' : 'Pass-Phone Screen'}
              </span>
              <span className="text-[9px] font-bold opacity-80">
                {settings.language === 'fa' ? '(مخفی ماندن کلمه)' : '(Word Secrecy)'}
              </span>
            </button>
          </div>
        </section>

        {/* Sound & Music Effects */}
        <section className="bg-white p-3.5 sm:p-4 border-[3.5px] border-[#160430] shadow-[4px_4px_0px_0px_#160430] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#160430] text-xs font-black uppercase tracking-wider">
              {settings.language === 'fa' ? 'صدا و موسیقی هیجان‌انگیز' : 'Sound & Music'}
            </label>
            <span className={`px-2.5 py-0.5 border-2 border-[#160430] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#160430] ${
              settings.soundEnabled !== false ? 'bg-[#39FF14] text-[#160430]' : 'bg-slate-200 text-slate-700'
            }`}>
              {settings.soundEnabled !== false 
                ? (settings.language === 'fa' ? 'فعال 🔊' : 'ON 🔊') 
                : (settings.language === 'fa' ? 'بی‌صدا 🔇' : 'MUTED 🔇')}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                sound.setMuted(false);
                sound.playToggle();
                sound.startMenuBGM();
                updateSettings('soundEnabled', true);
              }}
              className={`pixel-btn flex-1 py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 rounded-xl ${
                settings.soundEnabled !== false 
                  ? 'pixel-btn-lime text-[#160430]' 
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <NeonVolume size={18} color="#160430" glow={false} />
              <span>{settings.language === 'fa' ? 'صدا وصل' : 'Sound ON'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.setMuted(true);
                updateSettings('soundEnabled', false);
              }}
              className={`pixel-btn flex-1 py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 rounded-xl ${
                settings.soundEnabled === false 
                  ? 'pixel-btn-pink text-white' 
                  : 'pixel-btn-dark text-[#00F0FF]'
              }`}
            >
              <NeonVolume size={18} color="#FF4A6E" glow={false} muted={true} />
              <span>{settings.language === 'fa' ? 'قطع صدا' : 'Muted'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Decorative Mascot Buddy */}
      <div className="my-2 flex items-center justify-center gap-2">
        <TeamMascot color="BLUE" size={36} />
        <p className="text-[10.5px] text-[#160430] bg-white px-3 py-1 border-2 border-[#160430] rounded-xl font-black shadow-[2px_2px_0px_0px_#160430]">
          {settings.language === 'fa' ? '⚡ تنظیمات را برای یک رقابت پرشور آماده کن!' : '⚡ Configure your match for maximum party fun!'}
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-3 mt-1">
        <button 
          onClick={() => {
            sound.playClick();
            onBack();
          }} 
          className="pixel-btn pixel-btn-dark flex-1 py-3.5 text-sm font-black uppercase tracking-wider"
        >
          {t.back}
        </button>
        <button 
          onClick={() => {
            sound.playStartGame();
            onNext();
          }} 
          className="pixel-btn pixel-btn-pink flex-[2] py-3.5 text-base font-black uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>{t.next}</span>
          <NeonLightning size={18} color="#FFE600" />
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
