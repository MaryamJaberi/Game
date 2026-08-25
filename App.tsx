import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameSettings, GameStatus, GameHistoryEntry, Team, Player, TeamColor } from './types';
import { COLORS_MAP } from './constants';
import { WORD_BANK } from './words';
import IntroScreen from './screens/IntroScreen';
import SetupScreen from './screens/SetupScreen';
import CategoryScreen from './screens/CategoryScreen';
import PlayerNameScreen from './screens/PlayerNameScreen';
import SeatingConfirmScreen from './screens/SeatingConfirmScreen';
import GameplayScreen from './screens/GameplayScreen';
import HistoryScreen from './screens/HistoryScreen';
import HelpScreen from './screens/HelpScreen';
import { sound } from './soundManager';

const DEFAULT_SETTINGS: GameSettings = {
  playerCount: 4,
  roundsCount: 3,
  roundDuration: 90,
  difficulty: 'easy',
  selectedCategories: ["CAT_OBJECTS", "CAT_ANIMALS", "CAT_FOOD"],
  playerNames: Array(8).fill(''),
  language: 'fa',
  passPhoneScreenEnabled: false,
  soundEnabled: true
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'INTRO' | 'SETUP' | 'CATEGORIES' | 'PLAYERS' | 'SEATING_CONFIRM' | 'GAME' | 'HISTORY' | 'HELP'>('INTRO');
  const [prevScreen, setPrevScreen] = useState<'INTRO' | 'SETUP' | 'CATEGORIES' | 'PLAYERS' | 'SEATING_CONFIRM' | 'GAME' | 'HISTORY' | 'HELP'>('INTRO');
  const [activeHelpSection, setActiveHelpSection] = useState<string>('intro');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);

  // Gameplay State (Strict 11 Status State Machine)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Setup);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [roundTimer, setRoundTimer] = useState(0);
  
  // SESSION WORD POOL: Shuffled once per match initialization
  const [shuffledPool, setShuffledPool] = useState<number[]>([]);
  const [poolPointer, setPoolPointer] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordDifficulty, setCurrentWordDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [swapCooldown, setSwapCooldown] = useState(20000);
  const [isPoolExhausted, setIsPoolExhausted] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('dor_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        // Fallback to default
      }
    }
    const savedHistory = localStorage.getItem('dor_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  useEffect(() => {
    const isSoundOn = settings.soundEnabled ?? true;
    sound.setSoundEnabled(isSoundOn);
    if (isSoundOn && currentScreen !== 'GAME') {
      sound.startMenuBGM();
    } else if (currentScreen === 'GAME') {
      sound.stopMenuBGM();
    }
  }, [settings.soundEnabled, currentScreen]);

  const saveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dor_settings', JSON.stringify(newSettings));
  };

  /**
   * Word Selection from single shuffled session pool
   */
  const getNextWord = useCallback(() => {
    setPoolPointer(currentPtr => {
      if (currentPtr >= shuffledPool.length) {
        setIsPoolExhausted(true);
        setGameStatus(GameStatus.WordExhaustion);
        return currentPtr;
      }

      const wordIdx = shuffledPool[currentPtr];
      const wordData = WORD_BANK[wordIdx];
      
      if (wordData) {
        setCurrentWord(wordData.words[settings.language] || wordData.words['en']);
        setCurrentWordDifficulty(wordData.difficulty || 'easy');
      }
      
      setSwapCooldown(20000);
      return currentPtr + 1;
    });
  }, [shuffledPool, settings.language]);

  /**
   * Prepares Teams, Seating, and Word Bank, then shows SEATING_CONFIRM
   */
  const prepareGameSeating = () => {
    const teamColors = [TeamColor.Blue, TeamColor.Red, TeamColor.Green, TeamColor.Yellow];
    const teamCount = settings.playerCount / 2;
    const totalGameTime = settings.roundsCount * settings.roundDuration * 1000;
    const timePerTeam = totalGameTime / teamCount;

    // Team 1: (P1, P_opposite), Team 2: (P2, P_opposite), etc.
    const initialTeams: Team[] = Array.from({ length: teamCount }).map((_, i) => ({
      id: i,
      color: teamColors[i],
      timeRemaining: timePerTeam,
      isEliminated: false,
      playerIds: [i, i + teamCount]
    }));

    const initialPlayers: Player[] = Array.from({ length: settings.playerCount }).map((_, i) => {
      const teamId = i % teamCount;
      const defaultName = settings.language === 'fa' ? `بازیکن ${i + 1}` : `Player ${i + 1}`;
      return {
        id: i,
        name: settings.playerNames[i]?.trim() || defaultName,
        teamId: teamId,
        teamColor: teamColors[teamId]
      };
    });

    // 1. Calculate pool of words filtered by selected categories AND chosen difficulty level
    const targetDifficulty = settings.difficulty || 'easy';
    let relevantPoolIndices = WORD_BANK
      .map((w, i) => {
        const catMatch = settings.selectedCategories.includes(w.category);
        const diffMatch = targetDifficulty === 'all' || w.difficulty === targetDifficulty;
        return (catMatch && diffMatch) ? i : -1;
      })
      .filter(i => i !== -1);
    
    // Fallback: If no words match the combination, relax category constraint
    if (relevantPoolIndices.length === 0) {
      relevantPoolIndices = WORD_BANK
        .map((w, i) => (targetDifficulty === 'all' || w.difficulty === targetDifficulty ? i : -1))
        .filter(i => i !== -1);
    }
    // Ultimate fallback: All words
    if (relevantPoolIndices.length === 0) {
      relevantPoolIndices = WORD_BANK.map((_, i) => i);
    }
    
    // 2. Shuffle once for the whole match
    const sessionPool = [...relevantPoolIndices].sort(() => Math.random() - 0.5);
    
    setShuffledPool(sessionPool);
    setPoolPointer(0);
    setIsPoolExhausted(false);
    
    setTeams(initialTeams);
    setPlayers(initialPlayers);
    setCurrentRound(1);
    setActivePlayerIndex(0);
    setRoundTimer(settings.roundDuration * 1000);

    // Initial word peek
    if (sessionPool.length > 0) {
      const firstWordData = WORD_BANK[sessionPool[0]];
      if (firstWordData) {
        setCurrentWord(firstWordData.words[settings.language] || firstWordData.words['en']);
        setCurrentWordDifficulty(firstWordData.difficulty || 'easy');
      }
      setPoolPointer(1);
    }

    setGameStatus(GameStatus.SeatingConfirm);
    setCurrentScreen('SEATING_CONFIRM');
  };

  /**
   * Start Round 1 after Seating Confirmation
   */
  const startConfirmedGame = () => {
    setGameStatus(GameStatus.ActiveTurn);
    setCurrentScreen('GAME');
  };

  const handleResume = () => {
    getNextWord();
    setGameStatus(prev => prev === GameStatus.WinnerScreen || prev === GameStatus.GameEnded ? prev : GameStatus.ActiveTurn);
  };

  const openHelp = (section: string) => {
    setActiveHelpSection(section);
    if (currentScreen === 'GAME') setGameStatus(GameStatus.Paused);
    setPrevScreen(currentScreen);
    setCurrentScreen('HELP');
  };

  const closeHelp = () => {
    setCurrentScreen(prevScreen);
    if (prevScreen === 'GAME') {
      handleResume();
    }
  };

  // High-precision Millisecond Timer loop for ACTIVE_TURN
  useEffect(() => {
    if (gameStatus === GameStatus.ActiveTurn) {
      timerRef.current = window.setInterval(() => {
        // Decrement Round Timer
        setRoundTimer(prev => {
          if (prev <= 10) {
            setGameStatus(GameStatus.RoundEnded);
            return 0;
          }
          return prev - 10;
        });

        // Decrement Active Team Timer ONLY
        const activePlayer = players[activePlayerIndex];
        if (activePlayer) {
          setTeams(prev => prev.map(t => {
            if (t.id === activePlayer.teamId && !t.isEliminated) {
              const newTime = t.timeRemaining - 10;
              return { ...t, timeRemaining: Math.max(0, newTime) };
            }
            return t;
          }));
        }

        // Decrement Swap Cooldown
        setSwapCooldown(prev => Math.max(0, prev - 10));
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => { 
      if (timerRef.current) clearInterval(timerRef.current); 
    };
  }, [gameStatus, players, activePlayerIndex]);

  const isRTL = settings.language === 'fa' || settings.language === 'ar';

  return (
    <div 
      className="h-[100dvh] min-h-[100dvh] md:h-auto md:min-h-[880px] md:max-h-[95vh] md:my-4 max-w-md mx-auto bg-pixel-grid relative flex flex-col overflow-hidden border-0 md:border-[5px] md:border-[#241c48] shadow-2xl md:shadow-[8px_8px_0px_0px_#241c48] rounded-none md:rounded-[28px] pt-safe pb-safe"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. SPLASH / INTRO */}
      {currentScreen === 'INTRO' && (
        <IntroScreen 
          language={settings.language}
          onLanguageChange={(l) => saveSettings({...settings, language: l})}
          onNext={() => { setGameStatus(GameStatus.Setup); setCurrentScreen('SETUP'); }} 
          onOpenHistory={() => setCurrentScreen('HISTORY')} 
          onOpenHelp={() => openHelp('rules')} 
        />
      )}
      
      {/* 2. SETUP */}
      {currentScreen === 'SETUP' && (
        <SetupScreen 
          settings={settings} 
          onSave={saveSettings} 
          onNext={() => setCurrentScreen('CATEGORIES')} 
          onBack={() => { setGameStatus(GameStatus.Splash); setCurrentScreen('INTRO'); }}
          onOpenHelp={() => openHelp('setup')}
        />
      )}

      {/* CATEGORIES */}
      {currentScreen === 'CATEGORIES' && (
        <CategoryScreen 
          settings={settings} 
          onSave={saveSettings} 
          onNext={() => setCurrentScreen('PLAYERS')} 
          onBack={() => setCurrentScreen('SETUP')}
          onOpenHelp={() => openHelp('categories')}
        />
      )}

      {/* PLAYERS */}
      {currentScreen === 'PLAYERS' && (
        <PlayerNameScreen 
          settings={settings} 
          onSave={saveSettings} 
          onStart={prepareGameSeating} 
          onBack={() => setCurrentScreen('CATEGORIES')}
          onOpenHelp={() => openHelp('players')}
        />
      )}

      {/* 3. SEATING_CONFIRM */}
      {currentScreen === 'SEATING_CONFIRM' && (
        <SeatingConfirmScreen
          settings={settings}
          teams={teams}
          players={players}
          onConfirm={startConfirmedGame}
          onBack={() => setCurrentScreen('PLAYERS')}
          onOpenHelp={() => openHelp('seating')}
        />
      )}

      {/* 4. ACTIVE GAMEPLAY (ACTIVE_TURN, PAUSED, ROUND_ENDED, TEAM_ELIMINATED, WORD_EXHAUSTION, GAME_ENDED, WINNER_SCREEN) */}
      {currentScreen === 'GAME' && (
        <GameplayScreen 
          settings={settings}
          onUpdateSettings={saveSettings}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          teams={teams}
          setTeams={setTeams}
          players={players}
          currentRound={currentRound}
          setCurrentRound={setCurrentRound}
          activePlayerIndex={activePlayerIndex}
          setActivePlayerIndex={setActivePlayerIndex}
          roundTimer={roundTimer}
          setRoundTimer={setRoundTimer}
          currentWord={currentWord}
          currentWordDifficulty={currentWordDifficulty}
          setCurrentWord={setCurrentWord}
          swapCooldown={swapCooldown}
          onGetNextWord={getNextWord}
          onResume={handleResume}
          isPoolExhausted={isPoolExhausted}
          onFinish={(entry) => {
            const updated = [entry, ...history].slice(0, 30);
            setHistory(updated);
            localStorage.setItem('dor_history', JSON.stringify(updated));
          }} 
          onExit={() => { setGameStatus(GameStatus.Setup); setCurrentScreen('INTRO'); }}
          onOpenHelp={() => openHelp('gameplay')}
        />
      )}

      {/* MATCH HISTORY */}
      {currentScreen === 'HISTORY' && (
        <HistoryScreen 
          language={settings.language}
          history={history} 
          onBack={() => setCurrentScreen('INTRO')} 
        />
      )}

      {/* RULES / HELP GUIDE */}
      {currentScreen === 'HELP' && (
        <HelpScreen 
          language={settings.language}
          onClose={closeHelp} 
          initialSection={activeHelpSection}
        />
      )}
    </div>
  );
};

export default App;
