import React from 'react';
import { GameSettings } from '../types';
import { TRANSLATIONS } from '../translations';
import { TeamMascot } from '../components/Mascots';
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
    <div className="flex-1 flex flex-col p-5 select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-black text-white p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_#ff007f]">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
          <h2 className="text-lg font-bold uppercase tracking-wider">{t.setup}</h2>
        </div>
        <button 
          onClick={() => {
            sound.playClick();
            onOpenHelp();
          }} 
          className="px-3 py-1 bg-[#ff007f] text-white border-2 border-black font-bold text-xs rounded hover:bg-pink-600 transition-colors"
        >
          {t.guide}
        </button>
      </div>

      {/* Main Form Dashboard */}
      <div className="space-y-6 flex-1">
        
        {/* Player Count */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <label className="text-black text-xs font-black uppercase tracking-wider">{t.players}</label>
            <span className="text-[10px] bg-slate-100 border border-black px-2 py-0.5 rounded font-bold">1 VS 1 MODE</span>
          </div>
          <div className="flex gap-2.5">
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
                  className={`pixel-btn flex-1 py-2.5 flex flex-col items-center justify-center font-bold transition-all ${
                    isSelected 
                    ? 'pixel-btn-lime border-4 text-black' 
                    : 'pixel-btn-dark border-4 text-slate-300'
                  }`}
                >
                  <span className="text-base font-black">{count} {t.players}</span>
                  <span className="text-[9px] font-bold opacity-80 uppercase">({count/2} Teams)</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Word Difficulty Levels (سه سطح سختی کلمات) */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <div>
              <label className="text-black text-xs font-black uppercase tracking-wider block">
                {t.difficulty_title || (settings.language === 'fa' ? 'سطح سختی کلمات' : 'Word Difficulty')}
              </label>
              <span className="text-[10px] text-slate-500 font-bold">
                {t.difficulty_hint || (settings.language === 'fa' ? 'تک‌کلمه‌ای، ترکیبی یا ضرب‌المثل‌ها' : 'Choose word complexity')}
              </span>
            </div>
            <span className={`px-2.5 py-0.5 border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_0px_#000000] ${
              (settings.difficulty || 'easy') === 'easy' ? 'bg-[#9CFF57] text-black' :
              settings.difficulty === 'medium' ? 'bg-[#FFD447] text-black' :
              settings.difficulty === 'hard' ? 'bg-[#FF6363] text-white' : 'bg-[#43D9FF] text-black'
            }`}>
              {(settings.difficulty || 'easy') === 'easy' ? (settings.language === 'fa' ? '🟢 آسان' : '🟢 Easy') :
               settings.difficulty === 'medium' ? (settings.language === 'fa' ? '🟡 متوسط' : '🟡 Medium') :
               settings.difficulty === 'hard' ? (settings.language === 'fa' ? '🔴 سخت' : '🔴 Hard') :
               (settings.language === 'fa' ? '🌈 ترکیبی' : '🌈 Mixed')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Easy */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'easy');
              }}
              className={`pixel-btn p-3 flex flex-col items-start justify-between text-start rounded-xl transition-all border-3 border-black ${
                (settings.difficulty || 'easy') === 'easy'
                  ? 'pixel-btn-lime text-black border-4 ring-2 ring-black shadow-[3px_3px_0px_0px_#000000]'
                  : 'pixel-btn-dark text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full justify-between">
                <span className="font-black text-xs md:text-sm">🟢 {t.difficultyLevels?.easy || 'آسان'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/10 rounded font-black">Level 1</span>
              </div>
              <span className="text-[10px] opacity-80 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.easy || (settings.language === 'fa' ? 'تک‌کلمه‌ای (لیوان، یخچال...)' : 'Single Words')}
              </span>
            </button>

            {/* Medium */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'medium');
              }}
              className={`pixel-btn p-3 flex flex-col items-start justify-between text-start rounded-xl transition-all border-3 border-black ${
                settings.difficulty === 'medium'
                  ? 'pixel-btn-yellow text-black border-4 ring-2 ring-black shadow-[3px_3px_0px_0px_#000000]'
                  : 'pixel-btn-dark text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full justify-between">
                <span className="font-black text-xs md:text-sm">🟡 {t.difficultyLevels?.medium || 'متوسط'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/10 rounded font-black">Level 2</span>
              </div>
              <span className="text-[10px] opacity-80 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.medium || (settings.language === 'fa' ? 'کلمات ترکیبی ۲ کلمه‌ای' : 'Compound 2-Words')}
              </span>
            </button>

            {/* Hard */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'hard');
              }}
              className={`pixel-btn p-3 flex flex-col items-start justify-between text-start rounded-xl transition-all border-3 border-black ${
                settings.difficulty === 'hard'
                  ? 'pixel-btn-pink text-white border-4 ring-2 ring-black shadow-[3px_3px_0px_0px_#000000]'
                  : 'pixel-btn-dark text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full justify-between">
                <span className="font-black text-xs md:text-sm">🔴 {t.difficultyLevels?.hard || 'سخت'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/20 rounded font-black">Level 3</span>
              </div>
              <span className="text-[10px] opacity-90 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.hard || (settings.language === 'fa' ? 'ضرب‌المثل‌ها و عبارات ۳+ کلمه‌ای' : 'Proverbs & Phrases')}
              </span>
            </button>

            {/* Mixed / All */}
            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('difficulty', 'all');
              }}
              className={`pixel-btn p-3 flex flex-col items-start justify-between text-start rounded-xl transition-all border-3 border-black ${
                settings.difficulty === 'all'
                  ? 'pixel-btn-cyan text-black border-4 ring-2 ring-black shadow-[3px_3px_0px_0px_#000000]'
                  : 'pixel-btn-dark text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full justify-between">
                <span className="font-black text-xs md:text-sm">🌈 {t.difficultyLevels?.all || 'ترکیبی'}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-black/10 rounded font-black">All</span>
              </div>
              <span className="text-[10px] opacity-80 mt-1 font-bold leading-tight">
                {t.difficultyDescs?.all || (settings.language === 'fa' ? 'ترکیب تصادفی همه سطوح' : 'All Difficulty Tiers')}
              </span>
            </button>
          </div>
        </section>

        {/* Rounds Count Slider */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-black text-xs font-black uppercase tracking-wider">{t.rounds}</label>
            <span className="bg-[#ff007f] text-white px-3 py-1 border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_0px_#000000]">
              {settings.roundsCount} {t.round}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-slate-400">3</span>
            <input 
              type="range" min="3" max="10" step="1"
              value={settings.roundsCount}
              onChange={(e) => {
                sound.playClick();
                updateSettings('roundsCount', parseInt(e.target.value));
              }}
              className="w-full h-3 bg-slate-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-[#ff007f]"
              style={{ outline: 'none' }}
            />
            <span className="text-xs font-bold text-slate-400">10</span>
          </div>
        </section>

        {/* Round Duration Slider */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-black text-xs font-black uppercase tracking-wider">{t.duration}</label>
            <span className="bg-[#00d2ff] text-black px-3 py-0.5 border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_0px_#000000]">
              {settings.roundDuration} {t.seconds}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-slate-400">60s</span>
            <input 
              type="range" min="60" max="300" step="15"
              value={settings.roundDuration}
              onChange={(e) => {
                sound.playClick();
                updateSettings('roundDuration', parseInt(e.target.value));
              }}
              className="w-full h-3 bg-slate-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-[#00d2ff]"
              style={{ outline: 'none' }}
            />
            <span className="text-xs font-bold text-slate-400">300s</span>
          </div>
        </section>

        {/* Turn Transition Mode (Fast vs Pass-Phone screen) */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-black text-xs font-black uppercase tracking-wider">
              {settings.language === 'fa' ? 'حالت انتقال نوبت' : 'Turn Transition Mode'}
            </label>
            <span className="bg-[#FFD447] text-black px-2.5 py-0.5 border-2 border-black font-bold text-[10px] rounded-lg shadow-[2px_2px_0px_0px_#000000]">
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
              className={`pixel-btn py-2.5 px-2 text-xs font-black uppercase flex flex-col items-center justify-center gap-1 border-3 border-black rounded-xl transition-all ${
                !settings.passPhoneScreenEnabled
                  ? 'pixel-btn-lime text-black border-4 ring-2 ring-black'
                  : 'pixel-btn-dark text-slate-400'
              }`}
            >
              <span className="text-sm">⚡</span>
              <span className="text-[11px] leading-tight">
                {settings.language === 'fa' ? 'شروع فوری (Hot Potato)' : 'Fast Hot-Potato'}
              </span>
              <span className="text-[9px] font-bold opacity-75">
                {settings.language === 'fa' ? '(پیش‌فرض - بدون معطلی)' : '(Default - Instant)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playToggle();
                updateSettings('passPhoneScreenEnabled', true);
              }}
              className={`pixel-btn py-2.5 px-2 text-xs font-black uppercase flex flex-col items-center justify-center gap-1 border-3 border-black rounded-xl transition-all ${
                settings.passPhoneScreenEnabled
                  ? 'pixel-btn-cyan text-black border-4 ring-2 ring-black'
                  : 'pixel-btn-dark text-slate-400'
              }`}
            >
              <span className="text-sm">📱</span>
              <span className="text-[11px] leading-tight">
                {settings.language === 'fa' ? 'صفحه تحویل و آمادگی' : 'Pass-Phone Screen'}
              </span>
              <span className="text-[9px] font-bold opacity-75">
                {settings.language === 'fa' ? '(مخفی ماندن کلمه)' : '(Word Secrecy Screen)'}
              </span>
            </button>
          </div>
          
          <p className="text-[10px] text-slate-500 font-bold mt-2 leading-relaxed">
            {settings.language === 'fa'
              ? '💡 در حالت سریع به محض حدس درست نوبت عوض می‌شود. در حالت تحویل گوشی، کلمه تا زدن «من آماده‌ام» مخفی می‌ماند.'
              : '💡 Fast mode immediately opens the next word. Pass-phone mode hides the word behind an "I am ready" button.'}
          </p>
        </section>

        {/* Sound & Music Effects */}
        <section className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000000] rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-black text-xs font-black uppercase tracking-wider">
              {settings.language === 'fa' ? 'صدا و موسیقی هیجان‌انگیز' : 'Sound & Music'}
            </label>
            <span className={`px-2.5 py-0.5 border-2 border-black font-bold text-xs rounded-lg shadow-[2px_2px_0px_0px_#000000] ${
              settings.soundEnabled !== false ? 'bg-[#9CFF57] text-black' : 'bg-slate-300 text-slate-700'
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
              className={`pixel-btn flex-1 py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 border-3 border-black rounded-xl ${
                settings.soundEnabled !== false 
                  ? 'pixel-btn-lime text-black border-4' 
                  : 'pixel-btn-dark text-slate-400'
              }`}
            >
              <span>🔊</span>
              <span>{settings.language === 'fa' ? 'صدا وصل' : 'Sound ON'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.setMuted(true);
                updateSettings('soundEnabled', false);
              }}
              className={`pixel-btn flex-1 py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 border-3 border-black rounded-xl ${
                settings.soundEnabled === false 
                  ? 'pixel-btn-pink text-white border-4' 
                  : 'pixel-btn-dark text-slate-400'
              }`}
            >
              <span>🔇</span>
              <span>{settings.language === 'fa' ? 'قطع صدا' : 'Muted'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-bold mt-2">
            {settings.language === 'fa' 
              ? '🎵 شامل ریتم پرهیجان، صدای تیک‌تاک و بوق هشدار ۵ ثانیه آخر'
              : '🎵 Includes dynamic music, countdown ticks, and 5s urgent siren'}
          </p>
        </section>
      </div>

      {/* Decorative Mascot Buddy */}
      <div className="my-3 flex items-center justify-center gap-2">
        <TeamMascot color="BLUE" size={40} className="opacity-95" />
        <p className="text-[10px] text-slate-600 bg-white/75 px-3 py-1 border border-black rounded-lg font-bold shadow-[1px_1px_0px_0px_#000000]">
          {settings.language === 'fa' ? '🕹️ سطح آسان تا سخت را تنظیم کنید!' : '🎮 Set the rounds count and timer!'}
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex gap-4 mt-4">
        <button 
          onClick={() => {
            sound.playClick();
            onBack();
          }} 
          className="pixel-btn pixel-btn-dark flex-1 py-3.5 text-sm font-bold uppercase tracking-wider"
        >
          {t.back}
        </button>
        <button 
          onClick={() => {
            sound.playStartGame();
            onNext();
          }} 
          className="pixel-btn pixel-btn-pink flex-[2] py-3.5 text-base font-black uppercase tracking-wider"
        >
          {t.next} 🚀
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
