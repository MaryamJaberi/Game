import React, { useEffect, useState, useRef } from 'react';
import { GameSettings, GameStatus, Team, Player, GameHistoryEntry } from '../types';
import { COLORS_MAP } from '../constants';
import { TRANSLATIONS } from '../translations';
import PlayerCircle from '../components/PlayerCircle';
import TimerDisplay from '../components/TimerDisplay';
import Modal from '../components/Modal';
import EndGameScreen from './EndGameScreen';
import { TeamMascot } from '../components/Mascots';
import { NeonLightning, NeonSparkle, NeonVolume, NeonBook } from '../components/NeonIcons';
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
          sound.playUrgentTick(currentSec);
          vibrate([70, 30]);
        } else if (currentSec > 5) {
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

  // Turn advance on Correct guess
  const handleWordGuessed = () => {
    if (gameStatus !== GameStatus.ActiveTurn) return;

    sound.playCorrect();
    vibrate([50, 40, 50]);

    const nextIdx = findNextActivePlayer(activePlayerIndex);
    setActivePlayerIndex(nextIdx);

    if (settings.passPhoneScreenEnabled) {
      setGameStatus(GameStatus.PassPhone);
      return;
    }

    const nextPlayer = players[nextIdx];
    if (nextPlayer) {
      setTurnFlash({ playerName: nextPlayer.name, teamColor: nextPlayer.teamColor });
      if (turnFlashTimeoutRef.current) clearTimeout(turnFlashTimeoutRef.current);
      turnFlashTimeoutRef.current = window.setTimeout(() => setTurnFlash(null), 1500);
    }

    setUndoSnapshot({
      activePlayerIndex,
      word: currentWord,
      roundTimer,
      teams: JSON.parse(JSON.stringify(teams))
    });
    setUndoTimeLeft(3);

    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    undoIntervalRef.current = window.setInterval(() => {
      setUndoTimeLeft(prev => {
        if (prev <= 1) {
          if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    onGetNextWord();
  };

  // Undo previous guess
  const handleUndo = () => {
    if (!undoSnapshot) return;
    sound.playClick();

    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    setActivePlayerIndex(undoSnapshot.activePlayerIndex);
    setTeams(undoSnapshot.teams);
    setRoundTimer(undoSnapshot.roundTimer);

    setUndoSnapshot(null);
    setUndoTimeLeft(0);
    setTurnFlash(null);
  };

  // Swap word action
  const handleSwapWord = () => {
    if (swapCooldown > 0 || gameStatus !== GameStatus.ActiveTurn) return;
    sound.playClick();
    onGetNextWord();
  };

  // Handle Round End & Time-out Eliminations
  const handleRoundEnd = () => {
    sound.playRoundEnd();

    const losingPlayer = players[activePlayerIndex];
    if (!losingPlayer) return;

    const losingTeamId = losingPlayer.teamId;
    const losingTeam = teams.find(t => t.id === losingTeamId);
    if (!losingTeam) return;

    const penaltyMs = 30000;
    const updatedTime = Math.max(0, losingTeam.timeRemaining - penaltyMs);
    const isNowEliminated = updatedTime <= 0;

    const updatedTeams = teams.map(t => {
      if (t.id === losingTeamId) {
        return {
          ...t,
          timeRemaining: updatedTime,
          isEliminated: isNowEliminated,
          score: t.score + 1
        };
      }
      return t;
    });

    setTeams(updatedTeams);

    const activeTeams = updatedTeams.filter(t => !t.isEliminated);
    const isLastRound = currentRound >= settings.roundsCount;

    if (activeTeams.length <= 1 || isLastRound) {
      setGameStatus(GameStatus.GameOver);
      return;
    }

    if (isNowEliminated) {
      setEliminatedTeamName(t.teamNames[losingTeam.color] || losingTeam.color);
      setGameStatus(GameStatus.TeamEliminated);
    } else {
      setGameStatus(GameStatus.RoundEnded);
    }
  };

  // Watch round timer reaching 0
  useEffect(() => {
    if (roundTimer <= 0 && gameStatus === GameStatus.ActiveTurn) {
      handleRoundEnd();
    }
  }, [roundTimer, gameStatus]);

  // Round transition start
  const handleStartNextRound = () => {
    sound.playStartGame();
    setCurrentRound(prev => prev + 1);
    setRoundTimer(settings.roundDuration * 1000);
    
    const nextIdx = findNextActivePlayer(activePlayerIndex);
    setActivePlayerIndex(nextIdx);
    onGetNextWord();
    setGameStatus(GameStatus.ActiveTurn);
  };

  // If Game Over, render final scoreboard
  if (gameStatus === GameStatus.GameOver) {
    return (
      <EndGameScreen 
        settings={settings}
        teams={teams}
        players={players}
        onFinish={onFinish}
        onRestart={onExit}
      />
    );
  }

  const activePlayer = players[activePlayerIndex];
  const activeTeam = activePlayer ? teams.find(tm => tm.id === activePlayer.teamId) : null;
  const activeColor = activeTeam ? COLORS_MAP[activeTeam.color] : { bg: 'bg-[#00F0FF]', text: 'text-[#160430]', hex: '#00F0FF', surface: '#001D3D', border: '#00F0FF' };
  
  // Opposite seated teammate
  const teammate = activePlayer ? players.find(p => p.teamId === activePlayer.teamId && p.id !== activePlayer.id) : null;

  const secondsRemaining = Math.floor(roundTimer / 1000);
  const isUrgentTime = secondsRemaining <= 5 && secondsRemaining > 0;

  return (
    <div className="flex-1 flex flex-col bg-pixel-grid overflow-hidden relative select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header Panel - Party & Co SHOCK YOU! styling */}
      <div className={`p-3 border-b-4 border-[#160430] flex items-center justify-between z-10 text-white shadow-[0px_4px_0px_0px_#160430] transition-colors duration-200 ${
        isUrgentTime ? 'bg-gradient-to-r from-[#FF007F] via-[#FF1058] to-[#FF2A6D] animate-pulse' : 'bg-gradient-to-r from-[#240A42] via-[#3B0764] to-[#160430]'
      }`}>
        <TimerDisplay 
          ms={roundTimer} 
          label={`${t.round} ${currentRound} ${t.of} ${settings.roundsCount}`} 
          size="md" 
          active={gameStatus === GameStatus.ActiveTurn} 
        />
        
        {/* Urgent 5-Second Warning Badge */}
        {isUrgentTime && (
          <div className="bg-[#FFE600] text-[#160430] px-2.5 py-1 rounded-xl border-2 border-[#160430] font-black text-[11px] animate-bounce tracking-wider shadow-[2px_2px_0px_0px_#160430] flex items-center gap-1">
            <NeonLightning size={14} color="#160430" glow={false} />
            <span>{secondsRemaining}s!</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {/* Sound Mute/Unmute Quick Toggle */}
          <button 
            type="button"
            onClick={toggleSound} 
            className={`w-9 h-9 flex items-center justify-center border-2 border-[#160430] rounded-xl shadow-[2px_2px_0px_0px_#160430] font-bold active:translate-y-0.5 transition-transform ${
              settings.soundEnabled !== false ? 'bg-[#39FF14] text-[#160430]' : 'bg-[#160430] text-[#FF1058]'
            }`}
            title={settings.soundEnabled !== false ? 'Mute Sound' : 'Enable Sound'}
            aria-label="Sound Toggle"
          >
            <NeonVolume size={18} color={settings.soundEnabled !== false ? '#160430' : '#FF1058'} glow={false} muted={settings.soundEnabled === false} />
          </button>

          {/* Help Button */}
          <button 
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }} 
            className="w-9 h-9 flex items-center justify-center bg-white text-[#160430] border-2 border-[#160430] rounded-xl shadow-[2px_2px_0px_0px_#160430] hover:bg-[#F4E8FF] font-bold active:translate-y-0.5 transition-transform"
            aria-label="Help"
          >
            <NeonBook size={18} color="#160430" glow={false} />
          </button>

          {/* Pause Button */}
          <button 
            type="button"
            onClick={() => {
              sound.playClick();
              setGameStatus(GameStatus.Paused);
            }} 
            className="w-9 h-9 flex items-center justify-center bg-[#FF007F] hover:bg-[#FF2E93] text-white border-2 border-[#160430] rounded-xl shadow-[2px_2px_0px_0px_#160430] font-bold active:translate-y-0.5 transition-transform"
            aria-label="Pause"
          >
            ⏸️
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-3.5 overflow-y-auto space-y-2">
        
        {/* Team Tiles grid */}
        <div className="w-full grid grid-cols-2 gap-2 mt-0.5">
          {teams.map(tm => {
            const isTurn = activeTeam?.id === tm.id && gameStatus === GameStatus.ActiveTurn;
            const config = COLORS_MAP[tm.color] || { bg: 'bg-[#00F0FF]', hex: '#00F0FF', surface: '#001D3D', border: '#00F0FF' };
            
            return (
              <div 
                key={tm.id} 
                className={`p-2 rounded-2xl border-[3px] border-[#160430] flex items-center gap-2 relative transition-all duration-200 ${
                  tm.isEliminated 
                    ? 'opacity-35 bg-slate-200 grayscale line-through' 
                    : isTurn
                      ? 'bg-white shadow-[3px_3px_0px_0px_#160430] -translate-y-0.5 ring-2 ring-[#160430]' 
                      : 'bg-white/95'
                }`}
                style={isTurn ? { borderColor: config.hex } : {}}
              >
                <div className="flex-shrink-0">
                  <TeamMascot color={tm.color} size={32} animate={isTurn} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate leading-none">
                    {t.teamNames[tm.color]}
                  </div>
                  <div className="font-mono text-xs font-black text-[#160430] leading-normal tabular-nums">
                    {Math.max(0, Math.floor(tm.timeRemaining / 1000))}s
                  </div>
                </div>
                {/* Glowing turn indicator */}
                {isTurn && (
                  <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39FF14]"></span>
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

        {/* Floating Turn Flash Banner */}
        {turnFlash && (
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-[#FFE600] text-[#160430] border-2 border-[#160430] p-2 rounded-xl text-center shadow-[3px_3px_0px_0px_#160430] flex items-center justify-center gap-2">
              <NeonLightning size={16} color="#160430" glow={false} />
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
        <div className="w-full text-center space-y-2.5 max-w-sm mx-auto animate-in fade-in duration-100">
          
          {/* Active Player & Undo Header */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className={`px-3.5 py-1 rounded-full font-black text-xs uppercase border-2 border-[#160430] tracking-wide shadow-[2px_2px_0px_0px_#160430] flex items-center gap-1.5 ${activeColor.bg} ${activeColor.text}`}>
              <NeonLightning size={14} color="#160430" glow={false} />
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
                className="pixel-btn bg-[#FF1058] text-white px-3 py-1 text-[11px] font-black uppercase tracking-wider border-2 border-[#160430] rounded-full shadow-[2px_2px_0px_0px_#160430] flex items-center gap-1 animate-pulse"
              >
                <span>↩️</span>
                <span>{language === 'fa' ? 'لغو حدس' : 'Undo'}</span>
              </button>
            )}
          </div>

          {/* Word Card (Immediate Tap-To-Guess) with Party & Co SHOCK 3D Border */}
          <div className={`relative w-full rounded-2xl border-[3.5px] border-[#160430] bg-white shadow-[5px_5px_0px_0px_#160430] overflow-hidden transition-all duration-150 ${
            isUrgentTime ? 'ring-4 ring-[#FF007F]' : ''
          }`}>
            {/* Awning Striped Canopy */}
            <div className="h-4 bg-repeat-x flex border-b-2 border-[#160430] select-none">
              <div className="flex-1 bg-[#00F0FF]"></div>
              <div className="flex-1 bg-[#FF1058]"></div>
              <div className="flex-1 bg-[#39FF14]"></div>
              <div className="flex-1 bg-[#FFE600]"></div>
              <div className="flex-1 bg-[#FF007F]"></div>
              <div className="flex-1 bg-[#7B2CBF]"></div>
            </div>

            {/* Word Display */}
            <div 
              onClick={handleWordGuessed}
              className="p-4 pb-3 min-h-[130px] flex flex-col items-center justify-center relative cursor-pointer active:scale-95 transition-transform"
            >
              {/* Difficulty Level Pill */}
              {currentWordDifficulty && (
                <div className="mb-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#160430] shadow-[1px_1px_0px_0px_#160430] ${
                    currentWordDifficulty === 'easy' 
                      ? 'bg-[#39FF14] text-[#160430]' 
                      : currentWordDifficulty === 'medium' 
                        ? 'bg-[#FFE600] text-[#160430]' 
                        : 'bg-[#FF1058] text-white'
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
                className={`font-black text-[#160430] leading-tight uppercase select-none text-center drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.1)] filter ${
                  currentWord.length > 30 
                    ? 'text-lg md:text-xl' 
                    : currentWord.length > 18 
                      ? 'text-xl md:text-2xl' 
                      : currentWord.length > 10 
                        ? 'text-2xl md:text-3xl' 
                        : 'text-3xl md:text-4xl'
                }`}
                style={{ wordBreak: 'break-word', fontFamily: 'Vazirmatn, sans-serif' }}
              >
                {currentWord}
              </h3>
              <div className="text-[10px] text-[#FF007F] tracking-wider mt-1 opacity-90 font-black flex items-center gap-1">
                <span>👈</span>
                <span>{language === 'fa' ? 'برای ثبت حدس درست و شروع نوبت بعد ضربه بزنید' : 'TAP TO GUESS & PASS TURN'}</span>
              </div>
            </div>

            {/* Teammate Guide Bar */}
            <div className="bg-[#F8EFFF] p-1.5 border-t-2 border-[#160430] text-center flex items-center justify-center gap-1.5 text-[#160430]">
              <NeonLightning size={12} color="#FF007F" />
              <span className="text-[10px] font-black">
                {teammate 
                  ? (language === 'fa' ? `توضیح بده برای ${teammate.name} (روبروی شما)` : `Explain to ${teammate.name} (across table)`)
                  : (language === 'fa' ? 'کلمه را برای یارتان توضیح دهید' : 'Explain word to teammate')}
              </span>
            </div>
          </div>

          {/* Action Buttons: Correct (Lime #39FF14) & Swap (Cyan #00F0FF) */}
          <div className="flex flex-col items-center w-full mx-auto space-y-2 pt-0.5">
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {/* Guess Correct Button */}
              <button
                type="button"
                onClick={handleWordGuessed}
                className="pixel-btn pixel-btn-lime py-3.5 flex items-center justify-center gap-1.5 font-black text-sm uppercase tracking-wider text-[#160430] active:translate-y-1"
              >
                <span className="text-base font-black">✓</span> 
                <span>{language === 'fa' ? 'درسته! (نفر بعد)' : 'CORRECT ❯'}</span>
              </button>

              {/* Swap / Change Word Button */}
              <button
                type="button"
                onClick={handleSwapWord}
                disabled={swapCooldown > 0}
                className={`pixel-btn ${swapCooldown <= 0 ? 'pixel-btn-cyan' : 'disabled'} py-3.5 flex items-center justify-center gap-1.5 font-black text-xs uppercase tracking-wider`}
              >
                <span>✖</span> 
                <span>{t.swap}</span>
              </button>
            </div>

            {/* Swap Cooldown Bar */}
            {swapCooldown > 0 && (
              <div className="w-full bg-[#160430] p-2 rounded-xl border-2 border-[#160430] shadow-[2px_2px_0px_0px_#160430] text-center flex items-center justify-between px-3">
                <span className="text-[10px] text-white font-bold">
                  ⏳ {t.swapReady.replace('{n}', Math.ceil(swapCooldown/1000).toString())}
                </span>
                <div className="w-1/2 h-2.5 bg-[#2B0952] border border-white/40 rounded-full relative overflow-hidden" dir="ltr">
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#00F0FF] transition-all ease-linear"
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
        <div className="fixed inset-0 bg-[#160430]/95 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center z-[60] animate-in fade-in duration-200">
          <div className="pixel-card-shock bg-gradient-to-br from-[#1C002B] via-[#2D0658] to-[#160430] p-6 max-w-sm w-full mx-auto text-center border-[3.5px] border-[#160430] shadow-[6px_6px_0px_0px_#00F0FF] relative">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 animate-party-float border-2 border-white/20">
              <TeamMascot color={activePlayer ? activePlayer.teamColor : "PARTY"} size={86} />
            </div>

            <div className="text-xs uppercase tracking-widest font-black text-[#00F0FF] mb-1 flex items-center justify-center gap-1">
              <NeonLightning size={16} color="#00F0FF" />
              <span>{language === 'fa' ? 'گوشی را تحویل دهید' : 'PASS THE DEVICE'}</span>
            </div>

            <h2 className="text-2xl font-black mb-2 font-display uppercase text-white">
              {activePlayer ? activePlayer.name : ''}
            </h2>

            <p className="text-xs text-white/90 font-bold mb-5 leading-relaxed bg-[#160430] p-3 rounded-xl border border-white/10">
              {language === 'fa'
                ? 'گوشی را به این بازیکن تحویل دهید. برای دیدن کلمه دکمه آماده‌ام را لمس کنید.'
                : 'Hand device to this player. Tap "I Am Ready" to reveal word.'}
            </p>

            <button
              onClick={() => {
                sound.playStartGame();
                onGetNextWord();
                setGameStatus(GameStatus.ActiveTurn);
              }}
              className="pixel-btn pixel-btn-lime w-full py-4 text-base font-black uppercase tracking-wider text-[#160430] flex items-center justify-center gap-2"
            >
              <span>{language === 'fa' ? 'من آماده‌ام ❯' : 'I AM READY ❯'}</span>
              <NeonLightning size={20} color="#160430" glow={false} />
            </button>
          </div>
        </div>
      )}

      {/* PAUSED MODAL */}
      {gameStatus === GameStatus.Paused && (
        <Modal 
          isOpen={true} 
          onClose={() => setGameStatus(GameStatus.ActiveTurn)}
          title={t.paused}
        >
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-700">
              {language === 'fa' ? 'بازی متوقف شد. برای ادامه روی دکمه زیر کلیک کنید.' : 'Game is paused. Ready to continue?'}
            </p>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => {
                  sound.playClick();
                  setGameStatus(GameStatus.ActiveTurn);
                  onResume();
                }}
                className="pixel-btn pixel-btn-lime w-full py-3 text-sm font-black uppercase text-[#160430]"
              >
                ▶️ {t.resume}
              </button>
              <button 
                onClick={() => {
                  sound.playClick();
                  onExit();
                }}
                className="pixel-btn pixel-btn-dark w-full py-3 text-xs font-black uppercase"
              >
                🚪 {t.quitGame}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ROUND END MODAL */}
      {gameStatus === GameStatus.RoundEnded && (
        <Modal
          isOpen={true}
          onClose={handleStartNextRound}
          title={`${t.round} ${currentRound} ${t.roundOver}`}
        >
          <div className="space-y-4 text-center">
            <div className="p-3 bg-[#FFE600] text-[#160430] rounded-2xl border-2 border-[#160430] font-black text-xs shadow-[2px_2px_0px_0px_#160430]">
              ⏰ {language === 'fa' ? 'زمان این دور تمام شد! ۳۰ ثانیه از تیم بازنده کسر گردید.' : 'Time is up! 30s penalty deducted from losing team.'}
            </div>

            {/* Scoreboard table */}
            <div className="space-y-2 my-3">
              {teams.map(team => {
                const config = COLORS_MAP[team.color];
                return (
                  <div key={team.id} className="flex items-center justify-between p-2.5 bg-slate-50 border-2 border-[#160430] rounded-xl">
                    <div className="flex items-center gap-2">
                      <TeamMascot color={team.color} size={24} animate={false} />
                      <span className="font-black text-xs uppercase" style={{ color: config.hex }}>
                        {t.teamNames[team.color]}
                      </span>
                    </div>
                    <span className="font-mono font-black text-xs text-[#160430]">
                      {Math.max(0, Math.floor(team.timeRemaining / 1000))}s
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleStartNextRound}
              className="pixel-btn pixel-btn-pink w-full py-3.5 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>{language === 'fa' ? `شروع دور ${currentRound + 1}` : `Start Round ${currentRound + 1}`}</span>
              <NeonLightning size={18} color="#FFE600" />
            </button>
          </div>
        </Modal>
      )}

      {/* TEAM ELIMINATED MODAL */}
      {gameStatus === GameStatus.TeamEliminated && (
        <Modal
          isOpen={true}
          onClose={handleStartNextRound}
          title={language === 'fa' ? 'تیم حذف شد!' : 'Team Eliminated!'}
        >
          <div className="space-y-4 text-center">
            <div className="p-3 bg-[#FF1058] text-white rounded-2xl border-2 border-[#160430] font-black text-xs shadow-[2px_2px_0px_0px_#160430]">
              💀 {language === 'fa' ? `زمان تیم ${eliminatedTeamName} به پایان رسید و حذف شد!` : `Team ${eliminatedTeamName} ran out of time!`}
            </div>

            <button
              onClick={handleStartNextRound}
              className="pixel-btn pixel-btn-lime w-full py-3.5 text-sm font-black uppercase tracking-wider text-[#160430] flex items-center justify-center gap-2"
            >
              <span>{language === 'fa' ? 'ادامه بازی با تیم‌های باقی‌مانده' : 'Continue Match'}</span>
              <NeonLightning size={18} color="#160430" glow={false} />
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default GameplayScreen;
