
import React, { useEffect, useState } from 'react';
import { GameSettings, GameStatus, Team, Player, GameHistoryEntry, TeamColor } from '../types';
import { COLORS_MAP } from '../constants';
import PlayerCircle from '../components/PlayerCircle';
import TimerDisplay from '../components/TimerDisplay';
import Modal from '../components/Modal';
import EndGameScreen from './EndGameScreen';

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
  swapCooldown: number;
  onGetNextWord: () => void;
  onResume: () => void;
  onFinish: (entry: GameHistoryEntry) => void;
  onExit: () => void;
  onOpenHelp: () => void;
}

const GameplayScreen: React.FC<Props> = ({ 
  settings, gameStatus, setGameStatus, teams, setTeams, players, 
  currentRound, setCurrentRound, activePlayerIndex, setActivePlayerIndex, 
  roundTimer, setRoundTimer, currentWord, swapCooldown, 
  onGetNextWord, onResume, onFinish, onExit, onOpenHelp 
}) => {
  const [message, setMessage] = useState<{ title: string, body: string } | null>(null);

  const vibrate = (ms: number | number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(ms);
  };

  const findNextActivePlayer = (startIndex: number) => {
    const total = players.length;
    for (let i = 1; i <= total; i++) {
      const candidateIdx = (startIndex + i) % total;
      const player = players[candidateIdx];
      const team = teams.find(t => t.id === player.teamId);
      if (team && !team.isEliminated) return candidateIdx;
    }
    return startIndex;
  };

  const handleWordGuessed = () => {
    if (gameStatus !== GameStatus.Playing) return;
    vibrate(50);
    const nextIdx = findNextActivePlayer(activePlayerIndex);
    setActivePlayerIndex(nextIdx);
    onGetNextWord();
  };

  const handleSwapWord = () => {
    if (swapCooldown <= 0) {
      vibrate(100);
      onGetNextWord();
    }
  };

  // Check for Team Elimination
  useEffect(() => {
    if (gameStatus !== GameStatus.Playing) return;
    const activePlayer = players[activePlayerIndex];
    const activeTeam = teams.find(t => t.id === activePlayer.teamId);

    if (activeTeam && activeTeam.timeRemaining <= 0 && !activeTeam.isEliminated) {
      vibrate([200, 100, 200]);
      const updatedTeams = teams.map(t => t.id === activeTeam.id ? { ...t, isEliminated: true, timeRemaining: 0 } : t);
      setTeams(updatedTeams);

      const remaining = updatedTeams.filter(t => !t.isEliminated);
      if (remaining.length <= 1) {
        setGameStatus(GameStatus.GameOver);
      } else {
        const nextIdx = findNextActivePlayer(activePlayerIndex);
        setActivePlayerIndex(nextIdx);
        onGetNextWord();
        setMessage({
          title: "حذف تیم!",
          body: `زمان تیم شما به پایان رسید و از بازی حذف شدید.`
        });
      }
    }
  }, [teams, gameStatus]);

  // Handle Game Over Finalization
  useEffect(() => {
    if (gameStatus === GameStatus.GameOver) {
      const remainingTeams = teams.filter(t => !t.isEliminated);
      const maxTime = Math.max(...remainingTeams.map(t => t.timeRemaining));
      const winners = remainingTeams.filter(t => t.timeRemaining === maxTime);
      const winnerNames = players.filter(p => winners.some(w => w.id === p.teamId)).map(p => p.name);
      
      onFinish({
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('fa-IR'),
        players: players.map(p => p.name),
        winnerColor: winners.length === 1 ? winners[0].color : 'TIE',
        winnerNames: winnerNames
      });
    }
  }, [gameStatus]);

  if (gameStatus === GameStatus.GameOver) {
    const remainingTeams = teams.filter(t => !t.isEliminated);
    const maxTime = Math.max(...remainingTeams.map(t => t.timeRemaining));
    const winners = remainingTeams.filter(t => t.timeRemaining === maxTime);
    return <EndGameScreen winners={winners} players={players} onRestart={onExit} />;
  }

  const activePlayer = players[activePlayerIndex];
  const activeTeam = activePlayer ? teams.find(t => t.id === activePlayer.teamId) : null;
  const activeColor = activeTeam ? COLORS_MAP[activeTeam.color] : { bg: 'bg-slate-400', text: 'text-white' };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden relative">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10 border-b border-slate-200">
        <TimerDisplay ms={roundTimer} label={`دُور ${currentRound} از ${settings.roundsCount}`} size="md" active colorClass="text-indigo-600" />
        <div className="flex items-center gap-1">
          <button onClick={onOpenHelp} className="p-2 text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button onClick={() => setGameStatus(GameStatus.Paused)} className="p-2 text-slate-400">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-6 overflow-y-auto">
        {/* Teams Status / Timers */}
        <div className="w-full grid grid-cols-2 gap-3 mb-4">
          {teams.map(t => (
            <div 
              key={t.id} 
              className={`p-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                t.isEliminated ? 'opacity-20 grayscale scale-95' : 
                activeTeam?.id === t.id ? `border-${COLORS_MAP[t.color].bg.split('-')[1]}-500 bg-white shadow-lg -translate-y-1` : 
                'bg-white/40 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${COLORS_MAP[t.color].bg}`}></div>
                <span className="text-[10px] font-bold text-slate-400">تیم {t.color === TeamColor.Blue ? 'آبی' : t.color === TeamColor.Red ? 'قرمز' : t.color === TeamColor.Green ? 'سبز' : 'زرد'}</span>
              </div>
              <TimerDisplay ms={t.timeRemaining} size="sm" active={activeTeam?.id === t.id} colorClass={activeTeam?.id === t.id ? 'text-slate-900' : 'text-slate-500'} />
            </div>
          ))}
        </div>

        <div className="my-2">
          <PlayerCircle players={players} activeIndex={activePlayerIndex} eliminatedTeamIds={teams.filter(t => t.isEliminated).map(t => t.id)} />
        </div>

        <div className="w-full text-center space-y-6">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[11px] mb-1 font-bold">نوبت بازیکن فعلی</span>
            <div className={`px-8 py-3 rounded-2xl font-black text-xl shadow-xl transition-all duration-300 ${activeColor.bg} ${activeColor.text}`}>
              {activePlayer?.name}
            </div>
          </div>

          <div className="relative group">
            <div className={`absolute -inset-1 rounded-[45px] blur-xl opacity-20 transition-all duration-500 ${activeColor.bg}`}></div>
            <div className="bg-white rounded-[40px] shadow-2xl p-8 w-full min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden border border-slate-100">
              {gameStatus === GameStatus.Playing ? (
                <>
                  <h3 className="text-5xl font-black text-slate-800 leading-tight mb-4 select-none">
                    {currentWord}
                  </h3>
                  <button onClick={handleWordGuessed} className="absolute inset-0 w-full h-full opacity-0 z-10" />
                  <div className="text-slate-300 text-xs animate-pulse">لمس برای حدس درست</div>
                </>
              ) : (
                <button 
                  onClick={() => { onGetNextWord(); setGameStatus(GameStatus.Playing); }}
                  className="bg-indigo-600 text-white px-12 py-6 rounded-3xl text-3xl font-black shadow-2xl active:scale-95 transition-all"
                >
                  بزن بریم!
                </button>
              )}
            </div>
          </div>

          {gameStatus === GameStatus.Playing && (
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={handleSwapWord}
                disabled={swapCooldown > 0}
                className={`w-full max-w-[220px] py-4 rounded-2xl font-black text-lg transition-all relative overflow-hidden shadow-md active:scale-95 ${
                  swapCooldown <= 0 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                <span className="relative z-10">تعویض کلمه</span>
                {swapCooldown > 0 && (
                  <div 
                    className="absolute right-0 top-0 h-full bg-slate-300 transition-all ease-linear"
                    style={{ width: `${(swapCooldown / 20000) * 100}%` }} // Anchored right, decreases left to right
                  ></div>
                )}
              </button>
              {swapCooldown > 0 && <span className="text-[11px] text-slate-400 font-bold">تعویض مجدد تا {Math.ceil(swapCooldown / 1000)}ث دیگر</span>}
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Round Transition Overlay */}
      {gameStatus === GameStatus.RoundFinished && (
        <div className="fixed inset-0 bg-indigo-900/95 flex flex-col items-center justify-center text-white p-8 text-center z-[60] animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-3xl font-black mb-2">دور {currentRound} به پایان رسید</h2>
          <p className="text-lg mb-12 opacity-80 leading-relaxed">وقت دُور تمام شد.<br/>برای ادامه رقابت گوشی را به نفر بعدی بدهید.</p>
          <button 
            onClick={() => {
              setCurrentRound(r => r + 1);
              setRoundTimer(settings.roundDuration * 1000);
              onResume();
            }}
            className="bg-white text-indigo-900 px-16 py-5 rounded-3xl font-black text-2xl shadow-2xl active:scale-95 transition-transform"
          >
            شروع دور بعدی
          </button>
        </div>
      )}

      {gameStatus === GameStatus.Paused && (
        <Modal 
          title="توقف بازی"
          body="بازی متوقف شد. برای ادامه رقابت دکمه زیر را بزنید."
          actions={[
            { label: 'ادامه بازی', onClick: onResume, primary: true },
            { label: 'خروج از بازی', onClick: onExit, danger: true }
          ]}
        />
      )}

      {message && (
        <Modal title={message.title} body={message.body} actions={[{ label: 'فهمیدم', onClick: () => setMessage(null), primary: true }]} />
      )}
    </div>
  );
};

export default GameplayScreen;
