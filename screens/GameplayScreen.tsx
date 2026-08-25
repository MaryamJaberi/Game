import React, { useEffect, useState, useRef } from 'react';
import { GameSettings, GameStatus, Team, Player, GameHistoryEntry, TeamColor } from '../types';
import { COLORS_MAP, UI_COLORS } from '../constants';
import { TRANSLATIONS } from '../translations';
import PlayerCircle from '../components/PlayerCircle';
import TimerDisplay from '../components/TimerDisplay';
import Modal from '../components/Modal';
import EndGameScreen from './EndGameScreen';
import { TeamMascot } from '../components/Mascots';

interface UndoSnapshot {
  activePlayerIndex: number;
  word: string;
  roundTimer: number;
  teams: Team[];
}

interface Props {
  settings: GameSettings;
  gameStatus: GameStatus;
  setGameStatus: (s: GameStatus) => void;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  players: Player[];
  currentRound: number;
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;
  activePlayerIndex: number;
  setActivePlayerIndex: (i: number) => void;
  roundTimer: number;
  setRoundTimer: (t: number) => void;
  currentWord: string;
  setCurrentWord?: (w: string) => void;
  swapCooldown: number;
  onGetNextWord: () => void;
  onResume: () => void;
  isPoolExhausted: boolean;
  onFinish: (entry: GameHistoryEntry) => void;
  onExit: () => void;
  onOpenHelp: () => void;
}

const GameplayScreen: React.FC<Props> = ({ 
  settings, gameStatus, setGameStatus, teams, setTeams, players, 
  currentRound, setCurrentRound, activePlayerIndex, setActivePlayerIndex, 
  roundTimer, setRoundTimer, currentWord, swapCooldown, 
  onGetNextWord, onResume, isPoolExhausted, onFinish, onExit, onOpenHelp 
}) => {
  const t = TRANSLATIONS[settings.language];
  const language = settings.language;
  const isRTL = language === 'fa' || language === 'ar';

  // 1-Second Undo Window State
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);
  const [undoTimeLeft, setUndoTimeLeft] = useState<number>(0);
  const undoIntervalRef = useRef<number | null>(null);

  // Elimination message state
  const [eliminatedTeamName, setEliminatedTeamName] = useState<string>('');

  const vibrate = (ms: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const findNextActivePlayer = (startIndex: number) => {
    const total = players.length;
    for (let i = 1; i <= total; i++) {
      const candidateIdx = (startIndex + i) % total;
      const player = players[candidateIdx];
      const team = teams.find(tm => tm.id === player.teamId);
      if (team && !team.isEliminated) return candidateIdx;
    }
    return startIndex;
  };

  // Turn advance on Correct
  const handleWordGuessed = () => {
    if (gameStatus !== GameStatus.ActiveTurn) return;
    vibrate(60);

    // 1. Capture snapshot for 1-Second Undo Window
    const snapshot: UndoSnapshot = {
      activePlayerIndex,
      word: currentWord,
      roundTimer,
      teams: JSON.parse(JSON.stringify(teams))
    };
    setUndoSnapshot(snapshot);
    setUndoTimeLeft(1000);

    // 2. Fetch next word in background (DO NOT reveal on screen until Ready CTA is tapped)
    onGetNextWord();

    // 3. Rotate to next active player
    const nextIdx = findNextActivePlayer(activePlayerIndex);
    setActivePlayerIndex(nextIdx);

    // 4. Move to PASS_PHONE state (Word Secrecy Constraint strictly enforced)
    setGameStatus(GameStatus.PassPhone);
  };

  // Undo Button clicked within the 1-second window
  const handleUndo = () => {
    if (!undoSnapshot) return;
    vibrate([40, 40, 40]);

    // Restore previous turn state
    setActivePlayerIndex(undoSnapshot.activePlayerIndex);
    setRoundTimer(undoSnapshot.roundTimer);
    setTeams(undoSnapshot.teams);
    setUndoSnapshot(null);
    setUndoTimeLeft(0);

    // Return to ACTIVE_TURN for the previous player
    setGameStatus(GameStatus.ActiveTurn);
  };

  // Countdown timer for the 1-Second Undo Window
  useEffect(() => {
    if (gameStatus === GameStatus.PassPhone && undoTimeLeft > 0) {
      undoIntervalRef.current = window.setInterval(() => {
        setUndoTimeLeft(prev => {
          if (prev <= 50) {
            if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
            setUndoSnapshot(null);
            return 0;
          }
          return prev - 50;
        });
      }, 50);
    } else {
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    }

    return () => {
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    };
  }, [gameStatus, undoTimeLeft]);

  // Ready button tapped by next player on PASS_PHONE screen
  const handleReadyToPlay = () => {
    vibrate(80);
    setUndoSnapshot(null);
    setUndoTimeLeft(0);
    setGameStatus(GameStatus.ActiveTurn);
  };

  // Swap / Change Word
  const handleSwapWord = () => {
    if (swapCooldown <= 0 && gameStatus === GameStatus.ActiveTurn) {
      vibrate(100);
      onGetNextWord();
    }
  };

  // Check for Team Elimination
  useEffect(() => {
    if (gameStatus !== GameStatus.ActiveTurn) return;
    const activePlayer = players[activePlayerIndex];
    const activeTeam = activePlayer ? teams.find(tm => tm.id === activePlayer.teamId) : null;

    if (activeTeam && activeTeam.timeRemaining <= 0 && !activeTeam.isEliminated) {
      vibrate([200, 100, 200]);
      const updatedTeams = teams.map(tm => 
        tm.id === activeTeam.id ? { ...tm, isEliminated: true, timeRemaining: 0 } : tm
      );
      setTeams(updatedTeams);
      setEliminatedTeamName(t.teamNames[activeTeam.color]);

      const remaining = updatedTeams.filter(tm => !tm.isEliminated);
      if (remaining.length <= 1) {
        setGameStatus(GameStatus.WinnerScreen);
      } else {
        setGameStatus(GameStatus.TeamEliminated);
      }
    }
  }, [teams, gameStatus, activePlayerIndex]);

  // Check for Pool Exhaustion
  useEffect(() => {
    if (isPoolExhausted && gameStatus !== GameStatus.WinnerScreen && gameStatus !== GameStatus.GameEnded) {
      setGameStatus(GameStatus.WordExhaustion);
    }
  }, [isPoolExhausted, gameStatus]);

  // Save history on Game Over / Winner Screen
  useEffect(() => {
    if (gameStatus === GameStatus.WinnerScreen || gameStatus === GameStatus.GameEnded) {
      const remainingTeams = teams.filter(tm => !tm.isEliminated);
      const maxTime = Math.max(...remainingTeams.map(tm => tm.timeRemaining), 0);
      const winners = remainingTeams.filter(tm => tm.timeRemaining === maxTime);
      const winnerNames = players.filter(p => winners.some(w => w.id === p.teamId)).map(p => p.name);
      
      onFinish({
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(settings.language),
        players: players.map(p => p.name),
        winnerColor: winners.length === 1 ? winners[0].color : 'TIE',
        winnerNames: winnerNames,
        language: settings.language
      });
    }
  }, [gameStatus]);

  // 11. WINNER_SCREEN / GAME_ENDED
  if (gameStatus === GameStatus.WinnerScreen || gameStatus === GameStatus.GameEnded) {
    const remainingTeams = teams.filter(tm => !tm.isEliminated);
    const maxTime = Math.max(...remainingTeams.map(tm => tm.timeRemaining), 0);
    const winners = remainingTeams.filter(tm => tm.timeRemaining === maxTime);
    return (
      <EndGameScreen 
        winners={winners.length > 0 ? winners : teams} 
        players={players} 
        onRestart={onExit} 
        language={settings.language} 
        isPoolExhausted={isPoolExhausted} 
      />
    );
  }

  const activePlayer = players[activePlayerIndex];
  const activeTeam = activePlayer ? teams.find(tm => tm.id === activePlayer.teamId) : null;
  const activeColor = activeTeam ? COLORS_MAP[activeTeam.color] : { bg: 'bg-[#4AA8FF]', text: 'text-white', hex: '#4AA8FF', surface: '#1E3A5F', border: '#4AA8FF' };
  
  // Opposite seated teammate
  const teammate = activePlayer ? players.find(p => p.teamId === activePlayer.teamId && p.id !== activePlayer.id) : null;

  return (
    <div className="flex-1 flex flex-col bg-pixel-grid overflow-hidden relative select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header Panel */}
      <div className="bg-[#17142C] p-3.5 border-b-4 border-[#181425] flex items-center justify-between z-10 text-white shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <TimerDisplay 
          ms={roundTimer} 
          label={`${t.round} ${currentRound} ${t.of} ${settings.roundsCount}`} 
          size="md" 
          active={gameStatus === GameStatus.ActiveTurn} 
        />
        <div className="flex items-center gap-2">
          {/* Help Button */}
          <button 
            type="button"
            onClick={onOpenHelp} 
            className="w-10 h-10 flex items-center justify-center bg-white text-black border-2 border-[#181425] rounded-xl shadow-[2px_2px_0px_0px_#FF007F] hover:bg-slate-100 font-bold active:translate-y-0.5 transition-transform"
            aria-label="Help"
          >
            ❓
          </button>
          {/* Pause Button */}
          <button 
            type="button"
            onClick={() => setGameStatus(GameStatus.Paused)} 
            className="w-10 h-10 flex items-center justify-center bg-[#FF007F] text-white border-2 border-[#181425] rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:bg-pink-600 font-bold active:translate-y-0.5 transition-transform"
            aria-label="Pause"
          >
            ⏸️
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 overflow-y-auto space-y-3">
        
        {/* Team Tiles grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 mt-0.5">
          {teams.map(tm => {
            const isTurn = activeTeam?.id === tm.id && gameStatus === GameStatus.ActiveTurn;
            const isTarget = activeTeam?.id === tm.id && gameStatus === GameStatus.PassPhone;
            const config = COLORS_MAP[tm.color] || { bg: 'bg-slate-400', hex: '#64748b', surface: '#1E3A5F', border: '#4AA8FF' };
            
            return (
              <div 
                key={tm.id} 
                className={`p-2.5 rounded-2xl border-4 border-[#181425] flex items-center gap-2 relative transition-all duration-300 ${
                  tm.isEliminated 
                    ? 'opacity-35 bg-slate-300 grayscale line-through' 
                    : isTurn || isTarget
                      ? 'bg-white shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5' 
                      : 'bg-white/80'
                }`}
                style={(isTurn || isTarget) ? { borderColor: config.hex } : {}}
              >
                <div className="flex-shrink-0">
                  <TeamMascot color={tm.color} size={36} animate={isTurn} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate leading-none">
                    {t.teamNames[tm.color]}
                  </div>
                  <div className="font-mono text-xs font-black text-slate-900 leading-normal tabular-nums">
                    {Math.max(0, Math.floor(tm.timeRemaining / 1000))}s
                  </div>
                </div>
                {/* Glowing indicator */}
                {isTurn && (
                  <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9CFF57] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9CFF57]"></span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Players layout Circle */}
        <div className="shrink-0 scale-90 md:scale-95 my-0.5">
          <PlayerCircle 
            players={players} 
            activeIndex={activePlayerIndex} 
            eliminatedTeamIds={teams.filter(tm => tm.isEliminated).map(tm => tm.id)} 
          />
        </div>

        {/* 5. PASS_PHONE SCREEN: Strict Word Secrecy Constraint */}
        {gameStatus === GameStatus.PassPhone && (
          <div className="w-full max-w-sm mx-auto space-y-3 animate-in fade-in zoom-in-95 duration-200">
            {/* 1-Second Undo Window Banner */}
            {undoTimeLeft > 0 && undoSnapshot && (
              <div className="bg-[#17142C] p-2.5 rounded-2xl border-4 border-[#181425] shadow-[4px_4px_0px_0px_#FF6B6B] flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <span className="text-base animate-spin" style={{ animationDuration: '2s' }}>⏳</span>
                  <span className="text-[11px] font-black text-white uppercase">
                    {language === 'fa' ? 'امکان بازگشت حدس' : 'Undo Window'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="pixel-btn bg-[#FF6B6B] text-white px-4 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black rounded-lg"
                >
                  ↩️ {language === 'fa' ? 'لغو حدس (Undo)' : 'UNDO'}
                </button>
              </div>
            )}

            {/* Pass Device Card */}
            <div className="pixel-card bg-white p-5 text-center border-4 border-[#181425] shadow-[6px_6px_0px_0px_#000000] rounded-2xl relative overflow-hidden">
              {/* Canopy */}
              <div className="h-4 bg-repeat-x flex border-b-3 border-[#181425] -mt-5 -mx-5 mb-4">
                <div className="flex-1 bg-[#4AA8FF]"></div>
                <div className="flex-1 bg-[#FF6363]"></div>
                <div className="flex-1 bg-[#6CFF7D]"></div>
                <div className="flex-1 bg-[#FFD447]"></div>
              </div>

              <div className="text-2xl mb-1 animate-bounce">📱</div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {t.passPhone}
              </span>

              {/* Next Player Plate */}
              <div className="my-2 flex flex-col items-center justify-center">
                <TeamMascot color={activeTeam?.color} size={64} animate={true} />
                <div className={`mt-2 px-6 py-2 rounded-2xl font-black text-lg uppercase border-3 border-[#181425] shadow-[3px_3px_0px_0px_#000000] ${activeColor.bg} ${activeColor.text}`}>
                  {activePlayer?.name}
                </div>
                {teammate && (
                  <p className="text-[11px] font-bold text-slate-600 mt-2 bg-slate-100 px-3 py-1 border border-black rounded-lg">
                    {language === 'fa' 
                      ? `🎯 کلمه را برای ${teammate.name} (روبروی شما) توضیح دهید`
                      : `🎯 Explain word to ${teammate.name} (across from you)`}
                  </p>
                )}
              </div>

              {/* Word Secrecy Notice */}
              <div className="text-[10px] text-slate-400 font-bold bg-slate-50 p-2 border border-slate-200 rounded-lg my-2">
                🔒 {language === 'fa' ? 'کلمه بعد از فشردن دکمه «آماده‌ام» نمایش داده می‌شود' : 'Word is hidden until Ready is tapped'}
              </div>

              {/* Ready CTA Button */}
              <button 
                type="button"
                onClick={handleReadyToPlay}
                className="pixel-btn pixel-btn-lime w-full py-4 text-lg font-black uppercase tracking-wider text-black border-4 border-[#181425] shadow-[4px_4px_0px_0px_#000000]"
              >
                🚀 {language === 'fa' ? 'من آماده‌ام!' : "I'M READY!"}
              </button>
            </div>
          </div>
        )}

        {/* 4. ACTIVE_TURN SCREEN: Active Word + Guessing & Passing Controls */}
        {gameStatus === GameStatus.ActiveTurn && (
          <div className="w-full text-center space-y-3 max-w-sm mx-auto animate-in fade-in duration-150">
            
            {/* Active Player Plate */}
            <div className="flex flex-col items-center">
              <div className={`px-5 py-1 rounded-full font-black text-xs uppercase border-2 border-[#181425] tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${activeColor.bg} ${activeColor.text}`}>
                👉 {activePlayer?.name}
              </div>
            </div>

            {/* Word Card */}
            <div className="relative w-full rounded-2xl border-4 border-[#181425] bg-white shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
              {/* Awning Striped Canopy */}
              <div className="h-5 bg-repeat-x flex border-b-3 border-[#181425] select-none">
                <div className="flex-1 bg-[#4AA8FF]"></div>
                <div className="flex-1 bg-[#FF6363]"></div>
                <div className="flex-1 bg-[#6CFF7D]"></div>
                <div className="flex-1 bg-[#FFD447]"></div>
                <div className="flex-1 bg-[#FF007F]"></div>
                <div className="flex-1 bg-[#43D9FF]"></div>
              </div>

              {/* Word Display */}
              <div className="p-6 pb-4 min-h-[140px] flex flex-col items-center justify-center relative">
                <h3 
                  onClick={handleWordGuessed}
                  className="text-4xl md:text-5xl font-black text-black leading-tight cursor-pointer uppercase select-none active:scale-95 transition-all text-center drop-shadow-[2.5px_2.5px_0px_rgba(0,0,0,0.15)] filter"
                  style={{ wordBreak: 'break-word', fontFamily: 'Vazirmatn, sans-serif' }}
                >
                  {currentWord}
                  <div className="text-[10px] text-[#FF007F] tracking-widest mt-1 opacity-80 font-bold">
                    {language === 'fa' ? '👈 برای ثبت حدس درست ضربه بزنید' : '👈 TAP HERE TO CORRECT'}
                  </div>
                </h3>
              </div>

              {/* Category tag at bottom */}
              <div className="bg-slate-100 p-2 border-t-2 border-slate-200 text-center flex items-center justify-center gap-1.5">
                <span className="text-xs">🔑</span>
                <span className="text-[10px] uppercase font-black text-slate-600 tracking-wider">
                  {language === 'fa' ? 'دسته‌بندی فعال' : 'Active Category'}
                </span>
              </div>
            </div>

            {/* Action Buttons: Correct (Lime #9CFF57) & Swap (Cyan #43D9FF) */}
            <div className="flex flex-col items-center w-full mx-auto space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3 w-full">
                {/* Guess Correct Button */}
                <button
                  type="button"
                  onClick={handleWordGuessed}
                  className="pixel-btn pixel-btn-lime py-3.5 flex items-center justify-center gap-1 font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black border-4 border-[#181425]"
                >
                  <span>✓</span> {language === 'fa' ? 'درسته!' : 'CORRECT'}
                </button>

                {/* Swap / Change Word Button */}
                <button
                  type="button"
                  onClick={handleSwapWord}
                  disabled={swapCooldown > 0}
                  className={`pixel-btn ${swapCooldown <= 0 ? 'pixel-btn-cyan' : 'disabled'} py-3.5 flex items-center justify-center gap-1 font-black text-sm uppercase tracking-wider border-4 border-[#181425]`}
                >
                  <span>✖</span> {t.swap}
                </button>
              </div>

              {/* Swap Cooldown Bar */}
              {swapCooldown > 0 && (
                <div className="w-full bg-[#17142C] p-2 rounded-xl border-2 border-[#181425] shadow-[2px_2px_0px_0px_#000000] text-center flex items-center justify-between px-3">
                  <span className="text-[10px] text-white font-bold">
                    ⏳ {t.swapReady.replace('{n}', Math.ceil(swapCooldown/1000).toString())}
                  </span>
                  <div className="w-1/2 h-2.5 bg-slate-800 border border-white rounded relative overflow-hidden" dir="ltr">
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#43D9FF] transition-all ease-linear"
                      style={{ width: `${(swapCooldown / 20000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 7. ROUND_ENDED: Round transition screen */}
      {gameStatus === GameStatus.RoundEnded && (
        <div className="fixed inset-0 bg-[#17142C]/95 flex flex-col items-center justify-center text-white p-6 text-center z-[60] animate-in fade-in duration-300">
          <div className="pixel-card-neon bg-[#241B3D] p-8 max-w-xs mx-auto text-center border-4 border-[#181425] shadow-[10px_10px_0px_0px_#FF007F] relative">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-party-float">
              <TeamMascot color="PARTY" size={80} />
            </div>

            <h2 className="text-2xl font-black mb-1 font-display tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-300">
              🔔 {t.roundEnded.replace('{n}', currentRound.toString())} 🔔
            </h2>
            <p className="text-xs mb-6 font-bold text-cyan-300 antialiased leading-relaxed">
              {t.passPhone}
            </p>

            <button 
              type="button"
              onClick={() => {
                if (currentRound < settings.roundsCount) {
                  setCurrentRound(r => r + 1);
                  setRoundTimer(settings.roundDuration * 1000);
                  onResume();
                } else {
                  setGameStatus(GameStatus.WinnerScreen);
                }
              }}
              className="pixel-btn pixel-btn-pink w-full py-4 text-lg font-black uppercase tracking-wider"
            >
              🎮 {t.nextRound}
            </button>
          </div>
        </div>
      )}

      {/* 8. TEAM_ELIMINATED: Notice */}
      {gameStatus === GameStatus.TeamEliminated && (
        <Modal 
          title={`💥 ${t.eliminated}`} 
          body={`${eliminatedTeamName} - ${t.teamEliminated}`} 
          actions={[{ 
            label: t.resume, 
            onClick: () => {
              const nextIdx = findNextActivePlayer(activePlayerIndex);
              setActivePlayerIndex(nextIdx);
              onGetNextWord();
              setGameStatus(GameStatus.PassPhone);
            }, 
            primary: true 
          }]} 
        />
      )}

      {/* 9. WORD_EXHAUSTION: Notice */}
      {gameStatus === GameStatus.WordExhaustion && (
        <Modal 
          title="⚠️ کلمات تمام شدند" 
          body={t.wordsFinished} 
          actions={[{ 
            label: "مشاهده نتایج نهایی", 
            onClick: () => setGameStatus(GameStatus.WinnerScreen), 
            primary: true 
          }]} 
        />
      )}

      {/* 6. PAUSED: Modal */}
      {gameStatus === GameStatus.Paused && (
        <Modal 
          title={t.paused}
          body={t.subtitle}
          actions={[
            { label: t.resume, onClick: onResume, primary: true },
            { label: t.exit, onClick: onExit, danger: true }
          ]}
        />
      )}
    </div>
  );
};

export default GameplayScreen;
