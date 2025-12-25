
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameSettings, GameStatus, GameHistoryEntry, Team, Player, TeamColor } from './types';
import { CATEGORIES, COLORS_MAP } from './constants';
import IntroScreen from './screens/IntroScreen';
import SetupScreen from './screens/SetupScreen';
import CategoryScreen from './screens/CategoryScreen';
import PlayerNameScreen from './screens/PlayerNameScreen';
import GameplayScreen from './screens/GameplayScreen';
import HistoryScreen from './screens/HistoryScreen';
import HelpScreen from './screens/HelpScreen';

const DEFAULT_SETTINGS: GameSettings = {
  playerCount: 4,
  roundsCount: 3,
  roundDuration: 90,
  selectedCategories: [Object.keys(CATEGORIES)[0]],
  playerNames: Array(8).fill('')
};

const App: React.FC = () => {
  // Navigation & UI State
  const [currentScreen, setCurrentScreen] = useState<'INTRO' | 'SETUP' | 'CATEGORIES' | 'PLAYERS' | 'GAME' | 'HISTORY' | 'HELP'>('INTRO');
  const [prevScreen, setPrevScreen] = useState<'INTRO' | 'SETUP' | 'CATEGORIES' | 'PLAYERS' | 'GAME' | 'HISTORY' | 'HELP'>('INTRO');
  const [activeHelpSection, setActiveHelpSection] = useState<string>('intro');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);

  // Core Gameplay State (LIFTED)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Setup);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [roundTimer, setRoundTimer] = useState(0);
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [swapCooldown, setSwapCooldown] = useState(20000);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const timerRef = useRef<number | null>(null);

  // Persistence
  useEffect(() => {
    const savedSettings = localStorage.getItem('dor_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsed,
        playerNames: Array.isArray(parsed.playerNames) ? [...parsed.playerNames, ...Array(8).fill('')].slice(0, 8) : DEFAULT_SETTINGS.playerNames
      });
    }
    const savedHistory = localStorage.getItem('dor_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dor_settings', JSON.stringify(newSettings));
  };

  const navigateTo = (screen: typeof currentScreen) => {
    setPrevScreen(currentScreen);
    setCurrentScreen(screen);
  };

  // Gameplay Logic Helpers
  const getNextWord = useCallback((list: string[], used: Set<string>) => {
    const available = list.filter(w => !used.has(w));
    const pool = available.length > 0 ? available : list; // Fallback to full list if exhausted
    const randomIndex = Math.floor(Math.random() * pool.length);
    const word = pool[randomIndex];
    
    setCurrentWord(word);
    setUsedWords(prev => new Set(prev).add(word));
    setSwapCooldown(20000);
  }, []);

  const initializeGame = () => {
    const teamColors = Object.values(TeamColor);
    const teamCount = settings.playerCount / 2;
    const totalGameTime = settings.roundsCount * settings.roundDuration * 1000;
    const timePerTeam = totalGameTime / teamCount;

    const initialTeams: Team[] = Array.from({ length: teamCount }).map((_, i) => ({
      id: i,
      color: teamColors[i],
      timeRemaining: timePerTeam,
      isEliminated: false,
      playerIds: [i, i + teamCount]
    }));

    const initialPlayers: Player[] = Array.from({ length: settings.playerCount }).map((_, i) => ({
      id: i,
      name: settings.playerNames[i],
      teamId: i % teamCount,
      teamColor: teamColors[i % teamCount]
    }));

    const allWords: string[] = [];
    settings.selectedCategories.forEach(cat => allWords.push(...CATEGORIES[cat]));

    setTeams(initialTeams);
    setPlayers(initialPlayers);
    setWordList(allWords);
    setUsedWords(new Set());
    setCurrentRound(1);
    setActivePlayerIndex(0);
    setRoundTimer(settings.roundDuration * 1000);
    setGameStatus(GameStatus.RoundStarting);
    navigateTo('GAME');
  };

  const handleResume = () => {
    // CRITICAL FIX: Resuming from any pause requires a new word and swap reset
    getNextWord(wordList, usedWords);
    setGameStatus(GameStatus.Playing);
  };

  const openHelp = (section: string) => {
    setActiveHelpSection(section);
    if (currentScreen === 'GAME') {
      setGameStatus(GameStatus.Help);
    }
    navigateTo('HELP');
  };

  const closeHelp = () => {
    if (prevScreen === 'GAME') {
      handleResume();
    }
    navigateTo(prevScreen);
  };

  // Master Timer Loop
  useEffect(() => {
    if (gameStatus === GameStatus.Playing) {
      timerRef.current = window.setInterval(() => {
        // Round Timer
        setRoundTimer(prev => {
          if (prev <= 10) {
            setGameStatus(GameStatus.RoundFinished);
            return 0;
          }
          return prev - 10;
        });

        // Team Timer
        const activePlayer = players[activePlayerIndex];
        if (activePlayer) {
          setTeams(prev => prev.map(t => {
            if (t.id === activePlayer.teamId && !t.isEliminated) {
              const newTime = t.timeRemaining - 10;
              if (newTime <= 0) {
                // Team Elimination logic handled in GameplayScreen component via status checks or here
                return { ...t, timeRemaining: 0 };
              }
              return { ...t, timeRemaining: newTime };
            }
            return t;
          }));
        }

        // Swap Cooldown
        setSwapCooldown(prev => Math.max(0, prev - 10));
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStatus, players, activePlayerIndex]);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 relative shadow-2xl flex flex-col overflow-hidden border-x border-slate-200">
      {currentScreen === 'INTRO' && (
        <IntroScreen 
          onNext={() => navigateTo('SETUP')} 
          onOpenHistory={() => navigateTo('HISTORY')} 
          onOpenHelp={() => openHelp('rules')} 
        />
      )}
      
      {currentScreen === 'SETUP' && (
        <SetupScreen 
          settings={settings} 
          onSave={saveSettings} 
          onNext={() => navigateTo('CATEGORIES')} 
          onBack={() => navigateTo('INTRO')}
          onOpenHelp={() => openHelp('setup')}
        />
      )}

      {currentScreen === 'CATEGORIES' && (
        <CategoryScreen 
          settings={settings} 
          onSave={saveSettings} 
          onNext={() => navigateTo('PLAYERS')} 
          onBack={() => navigateTo('SETUP')}
          onOpenHelp={() => openHelp('categories')}
        />
      )}

      {currentScreen === 'PLAYERS' && (
        <PlayerNameScreen 
          settings={settings} 
          onSave={saveSettings} 
          onStart={initializeGame} 
          onBack={() => navigateTo('CATEGORIES')}
          onOpenHelp={() => openHelp('players')}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameplayScreen 
          settings={settings}
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
          swapCooldown={swapCooldown}
          onGetNextWord={() => getNextWord(wordList, usedWords)}
          onResume={handleResume}
          onFinish={(entry) => {
            const updated = [entry, ...history].slice(0, 30);
            setHistory(updated);
            localStorage.setItem('dor_history', JSON.stringify(updated));
          }} 
          onExit={() => { setGameStatus(GameStatus.Setup); navigateTo('INTRO'); }}
          onOpenHelp={() => openHelp('gameplay')}
        />
      )}

      {currentScreen === 'HISTORY' && (
        <HistoryScreen 
          history={history} 
          onBack={() => navigateTo('INTRO')} 
        />
      )}

      {currentScreen === 'HELP' && (
        <HelpScreen 
          onClose={closeHelp} 
          initialSection={activeHelpSection}
        />
      )}
    </div>
  );
};

export default App;
