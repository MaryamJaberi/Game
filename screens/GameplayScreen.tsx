import React, { useEffect, useState, useRef } from 'react';
import { GameSettings, GameStatus, Team, Player, GameHistoryEntry } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import PlayerCircle from '../components/PlayerCircle';
import TimerDisplay from '../components/TimerDisplay';
import Modal from '../components/Modal';
import EndGameScreen from './EndGameScreen';
import { TeamMascot } from '../components/Mascots';
import { sound } from '../soundManager';

interface UndoSnapshot {
  activePlayerIndex: number;
  word: string;
  roundTimer: number;
  teams: Team[];
}

interface Props {
  settings: GameSettings;
  onUpdateSettings?: (s: GameSettings) => void;
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
  currentWordDifficulty?: 'easy' | 'medium' | 'hard';
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
  settings, onUpdateSettings, gameStatus, setGameStatus, teams, setTeams, players, 
  currentRound, setCurrentRound, activePlayerIndex, setActivePlayerIndex, 
  roundTimer, setRoundTimer, currentWord, currentWordDifficulty, swapCooldown, 
  onGetNextWord, onResume, isPoolExhausted, onFinish, onExit, onOpenHelp 
}) => {
  const t = TRANSLATIONS[settings.language];
  const language = settings.language;
  const isRTL = language === 'fa' || language === 'ar';

  // Floating Undo state (non-blocking undo banner during real-time gameplay)
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);
  const [undoTimeLeft, setUndoTimeLeft] = useState<number>(0);
  const undoIntervalRef = useRef<number | null>(null);

  // Turn Change Flash Banner (instant visual cue for the next player)
  const [turnFlash, setTurnFlash] = useState<{ playerName: string; teamColor: string } | null>(null);
  const turnFlashTimeoutRef = useRef<number | null>(null);

  // Elimination message state
  const [eliminatedTeamName, setEliminatedTeamName] = useState<string>('');

  // Audio countdown tracking
  const lastSecondRef = useRef<number>(-1);

  const vibrate = (ms: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Synchronize sound manager mute status with settings
  useEffect(() => {
    sound.setMuted(settings.soundEnabled === false);
  }, [settings.soundEnabled]);

  const toggleSound = () => {
    const newSoundState = settings.soundEnabled === false;
    sound.setMuted(!newSoundState);
    if (newSoundState) {
      sound.playClick();
    }
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, soundEnabled: newSoundState });
    }
  };

  // Start / Stop dynamic BGM on active turn
  useEffect(() => {
    if (gameStatus === GameStatus.ActiveTurn) {
      const seconds = Math.ceil(roundTimer / 1000);
      sound.startGameplayBGM(seconds);
    } else {
      sound.stopBGM();
    }

    return () => {
      sound.stopBGM();
    };
  }, [gameStatus]);

  // Audio Tick & 5-Second Urgent Siren Loop
  useEffect(() => {
    if (gameStatus === GameStatus.ActiveTurn) {
      const currentSec = Math.floor(roundTimer / 1000);
      if (currentSec !== lastSecondRef.current && currentSec >= 0) {
        lastSecondRef.current = currentSec;

        if (currentSec <= 5 && currentSec > 0) {
          // Urgent countdown alarm in last 5 seconds
          sound.playUrgentTick(currentSec);
          vibrate([70, 30]);
        } else if (currentSec > 5) {
          // Normal rhythm tick
          sound.playTick();
        } else if (currentSec === 0) {
          sound.playRoundEnd();
          vibrate([200, 100, 200]);
        }
      }
    }
  }, [roundTimer, gameStatus]);

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

  // Turn advance on Correct guess (Hot-Potato by default or optional Pass-Phone Screen)
  const handleWordGuessed = () => {
    if (gameStatus !== GameStatus.ActiveTurn) return;

    // 1. Play exciting victory chime and vibration
    sound.playCorrect();
    vibrate([50, 40, 50]);

    // 2. Rotate to next active player
    const nextIdx = findNextActivePlayer(activePlayerIndex);
    setActivePlayerIndex(nextIdx);

    // If user enabled the optional Pass-Phone ready screen:
    if (settings.passPhoneScreenEnabled) {
      setGameStatus(GameStatus.PassPhone);
      return;
    }

    // Default: FAST Hot-Potato mode!
    // 3. Capture snapshot for the non-blocking floating Undo button
    const snapshot: UndoSnapshot = {
      activePlayerIndex,
      word: currentWord,
      roundTimer,
      teams: JSON.parse(JSON.stringify(teams))
    };
    setUndoSnapshot(snapshot);
    setUndoTimeLeft(2500); // 2.5s window to undo accidental taps

    // 4. Fetch next word immediately so the next player sees it instantly
    onGetNextWord();

    // 5. Flash exciting "Next Player's Turn!" banner
    const nextPlayer = players[nextIdx];
    if (nextPlayer) {
      setTurnFlash({
        playerName: nextPlayer.name,
        teamColor: nextPlayer.teamColor
      });
      if (turnFlashTimeoutRef.current) clearTimeout(turnFlashTimeoutRef.current);
      turnFlashTimeoutRef.current = window.setTimeout(() => {
        setTurnFlash(null);
      }, 1600);
    }
  };

  // Undo button clicked (if tapped accidentally)
  const handleUndo = () => {
    if (!undoSnapshot) return;
    sound.playClick();
    vibrate([40, 40, 40]);

    setActivePlayerIndex(undoSnapshot.activePlayerIndex);
    setRoundTimer(undoSnapshot.roundTimer);
    setTeams(undoSnapshot.teams);
    setUndoSnapshot(null);
    setUndoTimeLeft(0);
  };

  // Floating Undo Countdown timer
  useEffect(() => {
    if (undoTimeLeft > 0) {
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
  }, [undoTimeLeft]);

  // Swap / Change Word
  const handleSwapWord = () => {
    if (swapCooldown <= 0 && gameStatus === GameStatus.ActiveTurn) {
      sound.playSwap();
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
      sound.playRoundEnd();
      vibrate([200, 100, 200]);
      const updatedTeams = teams.map(tm => 
        tm.id === activeTeam.id ? { ...tm, isEliminated: true, timeRemaining: 0 } : tm
      );
      setTeams(updatedTeams);
      setEliminatedTeamName(t.teamNames[activeTeam.color]);

      const remaining = updatedTeams.filter(tm => !tm.isEliminated);
      if (remaining.length <= 1) {
        sound.playVictory();
        setGameStatus(GameStatus.WinnerScreen);
      } else {
        setGameStatus(GameStatus.TeamEliminated);
      }
    }
  }, [teams, gameStatus, activePlayerIndex]);

  // Check for Pool Exhaustion
  useEffect(() => {
    if (isPoolExhausted && gameStatus !== GameStatus.WinnerScreen && gameStatus !== GameStatus.GameEnded) {
      sound.playRoundEnd();
      setGameStatus(GameStatus.WordExhaustion);
    }
  }, [isPoolExhausted, gameStatus]);

  // Save history on Game Over / Winner Screen
  useEffect(() => {
    if (gameStatus === GameStatus.WinnerScreen || gameStatus === GameStatus.GameEnded) {
      sound.playVictory();
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

  // WINNER_SCREEN / GAME_ENDED
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

  const secondsRemaining = Math.floor(roundTimer / 1000);
  const isUrgentTime = secondsRemaining <= 5 && secondsRemaining > 0;

  return (
    <div className="flex-1 flex flex-col bg-pixel-grid overflow-hidden relative select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header Panel */}
      <div className={`p-3.5 border-b-4 border-[#181425] flex items-center justify-between z-10 text-white shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] transition-colors duration-200 ${
        isUrgentTime ? 'bg-[#FF007F] animate-pulse' : 'bg-[#17142C]'
      }`}>
        <TimerDisplay 
          ms={roundTimer} 
          label={`${t.round} ${currentRound} ${t.of} ${settings.roundsCount}`} 
          size="md" 
          active={gameStatus === GameStatus.ActiveTurn} 
        />
        
        {/* Urgent 5-Second Warning Badge */}
        {isUrgentTime && (
          <div className="bg-[#FFD447] text-black px-2.5 py-1 rounded-lg border-2 border-black font-black text-[11px] animate-bounce tracking-wider shadow-[2px_2px_0px_0px_#000000]">
            ⚡ {secondsRemaining}s! ⚡
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Sound Mute/Unmute Quick Toggle */}
          <button 
            type="button"
            onClick={toggleSound} 
            className={`w-10 h-10 flex items-center justify-center border-2 border-[#181425] rounded-xl shadow-[2px_2px_0px_0px_#000000] font-bold active:translate-y-0.5 transition-transform ${
              settings.soundEnabled !== false ? 'bg-[#9CFF57] text-black hover:bg-lime-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            title={settings.soundEnabled !== false ? 'Mute Sound' : 'Enable Sound'}
            aria-label="Sound Toggle"
          >
            {settings.soundEnabled !== false ? '🔊' : '🔇'}
          </button>

          {/* Help Button */}
          <button 
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }} 
            className="w-10 h-10 flex items-center justify-center bg-white text-black border-2 border-[#181425] rounded-xl shadow-[2px_2px_0px_0px_#FF007F] hover:bg-slate-100 font-bold active:translate-y-0.5 transition-transform"
            aria-label="Help"
          >
            ❓
          </button>

          {/* Pause Button */}
          <button 
            type="button"
            onClick={() => {
              sound.playClick();
              setGameStatus(GameStatus.Paused);
            }} 
            className="w-10 h-10 flex items-center justify-center bg-[#FF007F] text-white border-2 border-[#181425] rounded-xl shadow-[2px_2px_0px_0px_#000000] hover:bg-pink-600 font-bold active:translate-y-0.5 transition-transform"
            aria-label="Pause"
          >
            ⏸️
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 overflow-y-auto space-y-2.5">
        
        {/* Team Tiles grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 mt-0.5">
          {teams.map(tm => {
            const isTurn = activeTeam?.id === tm.id && gameStatus === GameStatus.ActiveTurn;
            const config = COLORS_MAP[tm.color] || { bg: 'bg-slate-400', hex: '#64748b', surface: '#1E3A5F', border: '#4AA8FF' };
            
            return (
              <div 
                key={tm.id} 
                className={`p-2.5 rounded-2xl border-4 border-[#181425] flex items-center gap-2 relative transition-all duration-200 ${
                  tm.isEliminated 
                    ? 'opacity-35 bg-slate-300 grayscale line-through' 
                    : isTurn
                      ? 'bg-white shadow-[4px_4px_0px_0px_#000000] -translate-y-0.5 ring-2 ring-black' 
                      : 'bg-white/80'
                }`}
                style={isTurn ? { borderColor: config.hex } : {}}
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
                {/* Glowing turn indicator */}
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

        {/* Floating Turn Flash Banner (Instant High-Octane Hand-off Cue) */}
        {turnFlash && (
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-[#FFD447] text-black border-3 border-black p-2 rounded-xl text-center shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center gap-2">
              <span className="text-base animate-bounce">⚡</span>
              <span className="font-black text-xs uppercase tracking-wide">
                {language === 'fa' 
                  ? `گوشی رو بده به: ${turnFlash.playerName}!` 
                  : `Pass to: ${turnFlash.playerName}!`}
              </span>
              <span className="text-base animate-bounce">📱</span>
            </div>
          </div>
        )}

        {/* ACTIVE GAMEPLAY WORD + GUESSING & PASSING CONTROLS */}
        <div className="w-full text-center space-y-3 max-w-sm mx-auto animate-in fade-in duration-100">
          
          {/* Active Player & Undo Header */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className={`px-4 py-1.5 rounded-full font-black text-xs uppercase border-2 border-[#181425] tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 ${activeColor.bg} ${activeColor.text}`}>
              <span>👉</span>
              <span>{activePlayer?.name}</span>
              {teammate && (
                <span className="opacity-90 text-[10px] font-bold">
                  ({language === 'fa' ? `یار: ${teammate.name}` : `Partner: ${teammate.name}`})
                </span>
              )}
            </div>

            {/* Non-blocking Undo Chip */}
            {undoTimeLeft > 0 && undoSnapshot && (
              <button
                type="button"
                onClick={handleUndo}
                className="pixel-btn bg-[#FF6B6B] text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1 animate-pulse"
              >
                <span>↩️</span>
                <span>{language === 'fa' ? 'لغو حدس' : 'Undo'}</span>
              </button>
            )}
          </div>

          {/* Word Card (Immediate Tap-To-Guess) */}
          <div className={`relative w-full rounded-2xl border-4 border-[#181425] bg-white shadow-[6px_6px_0px_0px_#000000] overflow-hidden transition-all duration-150 ${
            isUrgentTime ? 'ring-4 ring-[#FF007F]' : ''
          }`}>
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
            <div 
              onClick={handleWordGuessed}
              className="p-5 pb-4 min-h-[140px] flex flex-col items-center justify-center relative cursor-pointer active:scale-95 transition-transform"
            >
              {/* Difficulty Level Pill */}
              {currentWordDifficulty && (
                <div className="mb-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-black shadow-[1px_1px_0px_0px_#000000] ${
                    currentWordDifficulty === 'easy' 
                      ? 'bg-[#9CFF57] text-black' 
                      : currentWordDifficulty === 'medium' 
                        ? 'bg-[#FFD447] text-black' 
                        : 'bg-[#FF6363] text-white'
                  }`}>
                    <span>{currentWordDifficulty === 'easy' ? '🟢' : currentWordDifficulty === 'medium' ? '🟡' : '🔴'}</span>
                    <span>
                      {currentWordDifficulty === 'easy' 
                        ? (language === 'fa' ? 'سطح ۱: آسان' : 'Level 1: Easy')
                        : currentWordDifficulty === 'medium'
                          ? (language === 'fa' ? 'سطح ۲: متوسط' : 'Level 2: Medium')
                          : (language === 'fa' ? 'سطح ۳: سخت' : 'Level 3: Hard')}
                    </span>
                  </span>
                </div>
              )}

              <h3 
                className={`font-black text-black leading-tight uppercase select-none text-center drop-shadow-[2.5px_2.5px_0px_rgba(0,0,0,0.15)] filter ${
                  currentWord.length > 30 
                    ? 'text-xl md:text-2xl' 
                    : currentWord.length > 18 
                      ? 'text-2xl md:text-3xl' 
                      : currentWord.length > 10 
                        ? 'text-3xl md:text-4xl' 
                        : 'text-4xl md:text-5xl'
                }`}
                style={{ wordBreak: 'break-word', fontFamily: 'Vazirmatn, sans-serif' }}
              >
                {currentWord}
              </h3>
              <div className="text-[10px] text-[#FF007F] tracking-widest mt-1.5 opacity-80 font-black flex items-center gap-1">
                <span>👈</span>
                <span>{language === 'fa' ? 'برای ثبت حدس درست و شروع نوبت بعد ضربه بزنید' : 'TAP TO GUESS & PASS TURN'}</span>
              </div>
            </div>

            {/* Teammate Guide Bar */}
            <div className="bg-slate-100 p-2 border-t-2 border-slate-200 text-center flex items-center justify-center gap-1.5 text-slate-700">
              <span className="text-xs">🎯</span>
              <span className="text-[10px] font-bold">
                {teammate 
                  ? (language === 'fa' ? `توضیح بده برای ${teammate.name} (روبروی شما)` : `Explain to ${teammate.name} (across table)`)
                  : (language === 'fa' ? 'کلمه را برای یارتان توضیح دهید' : 'Explain word to teammate')}
              </span>
            </div>
          </div>

          {/* Action Buttons: Correct (Lime #9CFF57) & Swap (Cyan #43D9FF) */}
          <div className="flex flex-col items-center w-full mx-auto space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Guess Correct Button */}
              <button
                type="button"
                onClick={handleWordGuessed}
                className="pixel-btn pixel-btn-lime py-4 flex items-center justify-center gap-1.5 font-black text-base uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black border-4 border-[#181425] active:translate-y-1"
              >
                <span className="text-lg">✓</span> 
                <span>{language === 'fa' ? 'درسته! (نفر بعد)' : 'CORRECT ❯'}</span>
              </button>

              {/* Swap / Change Word Button */}
              <button
                type="button"
                onClick={handleSwapWord}
                disabled={swapCooldown > 0}
                className={`pixel-btn ${swapCooldown <= 0 ? 'pixel-btn-cyan' : 'disabled'} py-4 flex items-center justify-center gap-1.5 font-black text-sm uppercase tracking-wider border-4 border-[#181425]`}
              >
                <span>✖</span> 
                <span>{t.swap}</span>
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
      </div>

      {/* PASS_PHONE: Optional Secrecy & Phone Handover Screen */}
      {gameStatus === GameStatus.PassPhone && (
        <div className="fixed inset-0 bg-[#17142C]/95 flex flex-col items-center justify-center text-white p-6 text-center z-[60] animate-in fade-in duration-300">
          <div className="pixel-card-neon bg-[#241B3D] p-6 max-w-sm w-full mx-auto text-center border-4 border-[#181425] shadow-[8px_8px_0px_0px_#4AA8FF] relative">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 animate-party-float">
              <TeamMascot color={activePlayer ? activePlayer.teamColor : "PARTY"} size={90} />
            </div>

            <div className="text-xs uppercase tracking-widest font-black text-cyan-300 mb-1">
              📱 {language === 'fa' ? 'گوشی را تحویل دهید' : 'PASS THE DEVICE'}
            </div>

            <h2 className="text-2xl font-black mb-2 font-display uppercase text-white">
              {activePlayer ? activePlayer.name : ''}
            </h2>

            <div className="bg-black/40 border-2 border-white/20 p-3 rounded-xl mb-5 text-xs text-slate-200 leading-relaxed font-bold">
              {teammate ? (
                <span>
                  {language === 'fa' 
                    ? `🎯 یار شما: ${teammate.name} (روبروی شما نشسته است)` 
                    : `🎯 Your Teammate: ${teammate.name}`}
                </span>
              ) : (
                <span>{language === 'fa' ? 'کلمه برای شما آماده است!' : 'Your word is ready!'}</span>
              )}
            </div>

            <button 
              type="button"
              onClick={() => {
                sound.playStartGame();
                onGetNextWord();
                setGameStatus(GameStatus.ActiveTurn);
              }}
              className="pixel-btn pixel-btn-lime w-full py-4 text-lg font-black uppercase tracking-wider text-black border-4 border-black"
            >
              🚀 {language === 'fa' ? 'من آماده‌ام! نمایش کلمه' : 'I AM READY! ❯'}
            </button>
          </div>
        </div>
      )}

      {/* ROUND_ENDED: Round transition screen */}
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

      {/* TEAM_ELIMINATED: Notice */}
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
              setGameStatus(GameStatus.ActiveTurn);
            }, 
            primary: true 
          }]} 
        />
      )}

      {/* WORD_EXHAUSTION: Notice */}
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

      {/* PAUSED: Modal */}
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
