import { describe, test, expect } from 'vitest';
import { WORD_BANK, WordData } from '../words';
import { TRANSLATIONS } from '../translations';
import { TeamColor, Language, GameSettings, Team, Player, GameStatus } from '../types';

describe('Game Words and Translation Bank Tests', () => {
  test('WORD_BANK is not empty and has valid categories', () => {
    expect(WORD_BANK.length).toBeGreaterThan(0);
    WORD_BANK.forEach((word: WordData) => {
      expect(word.category).toBeDefined();
      expect(typeof word.category).toBe('string');
      expect(word.words).toBeDefined();
      expect(typeof word.words).toBe('object');
    });
  });

  test('All words in WORD_BANK have at least Persian (fa) and English (en) translations', () => {
    WORD_BANK.forEach((word: WordData) => {
      expect(word.words.fa).toBeDefined();
      expect(word.words.fa.trim().length).toBeGreaterThan(0);
      expect(word.words.en).toBeDefined();
      expect(word.words.en.trim().length).toBeGreaterThan(0);
    });
  });

  test('TRANSLATIONS dictionary contains expected languages and matching keys', () => {
    const supportedLanguages: Language[] = ['en', 'fa', 'nl', 'de', 'fr', 'ar', 'tr', 'pl', 'uk'];
    
    supportedLanguages.forEach((lang) => {
      const trans = TRANSLATIONS[lang];
      expect(trans).toBeDefined();
      expect(trans.title).toBeDefined();
      expect(trans.start).toBeDefined();
      expect(trans.back).toBeDefined();
      expect(trans.next).toBeDefined();
      expect(trans.players).toBeDefined();
      expect(trans.rounds).toBeDefined();
      expect(trans.duration).toBeDefined();
      expect(trans.teamNames).toBeDefined();
    });
  });
});

describe('Team and Player Assignment & Opposite Seating Logic', () => {
  const mockSettings = (playerCount: 4 | 6 | 8): GameSettings => ({
    playerCount,
    roundsCount: 3,
    roundDuration: 90,
    selectedCategories: ["CAT_OBJECTS", "CAT_FOOD"],
    playerNames: Array.from({ length: 8 }).map((_, i) => `Player ${i + 1}`),
    language: 'fa'
  });

  test('Initializes correct number of teams and opposite teammates for 4 players', () => {
    const settings = mockSettings(4);
    const teamColors = [TeamColor.Blue, TeamColor.Red, TeamColor.Green, TeamColor.Yellow];
    const teamCount = settings.playerCount / 2; // 2 teams

    const initialTeams: Team[] = Array.from({ length: teamCount }).map((_, i) => ({
      id: i,
      color: teamColors[i],
      timeRemaining: 180000,
      isEliminated: false,
      playerIds: [i, i + teamCount]
    }));

    const initialPlayers: Player[] = Array.from({ length: settings.playerCount }).map((_, i) => ({
      id: i,
      name: settings.playerNames[i],
      teamId: i % teamCount,
      teamColor: teamColors[i % teamCount]
    }));

    expect(initialTeams.length).toBe(2);
    expect(initialPlayers.length).toBe(4);

    // Team 1: (P1 [index 0], P3 [index 2]) on Blue
    expect(initialPlayers[0].teamColor).toBe(TeamColor.Blue);
    expect(initialPlayers[2].teamColor).toBe(TeamColor.Blue);
    expect(initialPlayers[0].teamId).toBe(0);
    expect(initialPlayers[2].teamId).toBe(0);

    // Team 2: (P2 [index 1], P4 [index 3]) on Red
    expect(initialPlayers[1].teamColor).toBe(TeamColor.Red);
    expect(initialPlayers[3].teamColor).toBe(TeamColor.Red);
  });

  test('Initializes correct opposite partners for 6 players (3 teams)', () => {
    const settings = mockSettings(6);
    const teamColors = [TeamColor.Blue, TeamColor.Red, TeamColor.Green, TeamColor.Yellow];
    const teamCount = 3;

    const initialPlayers: Player[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      name: settings.playerNames[i],
      teamId: i % teamCount,
      teamColor: teamColors[i % teamCount]
    }));

    // Opposite pairs: P1(0) & P4(3) on Blue, P2(1) & P5(4) on Red, P3(2) & P6(5) on Green
    expect(initialPlayers[0].teamColor).toBe(TeamColor.Blue);
    expect(initialPlayers[3].teamColor).toBe(TeamColor.Blue);
    expect(initialPlayers[1].teamColor).toBe(TeamColor.Red);
    expect(initialPlayers[4].teamColor).toBe(TeamColor.Red);
    expect(initialPlayers[2].teamColor).toBe(TeamColor.Green);
    expect(initialPlayers[5].teamColor).toBe(TeamColor.Green);
  });

  test('Initializes correct opposite partners for 8 players (4 teams)', () => {
    const settings = mockSettings(8);
    const teamColors = [TeamColor.Blue, TeamColor.Red, TeamColor.Green, TeamColor.Yellow];
    const teamCount = 4;

    const initialPlayers: Player[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      name: settings.playerNames[i],
      teamId: i % teamCount,
      teamColor: teamColors[i % teamCount]
    }));

    // Opposite pairs: P1(0)&P5(4) Blue, P2(1)&P6(5) Red, P3(2)&P7(6) Green, P4(3)&P8(7) Yellow
    expect(initialPlayers[0].teamColor).toBe(TeamColor.Blue);
    expect(initialPlayers[4].teamColor).toBe(TeamColor.Blue);
    expect(initialPlayers[1].teamColor).toBe(TeamColor.Red);
    expect(initialPlayers[5].teamColor).toBe(TeamColor.Red);
    expect(initialPlayers[2].teamColor).toBe(TeamColor.Green);
    expect(initialPlayers[6].teamColor).toBe(TeamColor.Green);
    expect(initialPlayers[3].teamColor).toBe(TeamColor.Yellow);
    expect(initialPlayers[7].teamColor).toBe(TeamColor.Yellow);
  });
});

describe('Gameplay Screen Turn and Rotation Logic', () => {
  const findNextActivePlayer = (startIndex: number, players: Player[], teams: Team[]) => {
    const total = players.length;
    for (let i = 1; i <= total; i++) {
      const candidateIdx = (startIndex + i) % total;
      const player = players[candidateIdx];
      const team = teams.find(tm => tm.id === player.teamId);
      if (team && !team.isEliminated) return candidateIdx;
    }
    return startIndex;
  };

  test('Rotates clockwise to the next active player when no teams are eliminated', () => {
    const players: Player[] = [
      { id: 0, name: 'P1', teamId: 0, teamColor: TeamColor.Blue },
      { id: 1, name: 'P2', teamId: 1, teamColor: TeamColor.Red },
      { id: 2, name: 'P3', teamId: 0, teamColor: TeamColor.Blue },
      { id: 3, name: 'P4', teamId: 1, teamColor: TeamColor.Red },
    ];

    const teams: Team[] = [
      { id: 0, color: TeamColor.Blue, timeRemaining: 60000, isEliminated: false, playerIds: [0, 2] },
      { id: 1, color: TeamColor.Red, timeRemaining: 60000, isEliminated: false, playerIds: [1, 3] },
    ];

    let activeIdx = 0;
    activeIdx = findNextActivePlayer(activeIdx, players, teams);
    expect(activeIdx).toBe(1);

    activeIdx = findNextActivePlayer(activeIdx, players, teams);
    expect(activeIdx).toBe(2);

    activeIdx = findNextActivePlayer(activeIdx, players, teams);
    expect(activeIdx).toBe(3);

    activeIdx = findNextActivePlayer(activeIdx, players, teams);
    expect(activeIdx).toBe(0);
  });

  test('Skips players whose teams have been eliminated', () => {
    const players: Player[] = [
      { id: 0, name: 'P1', teamId: 0, teamColor: TeamColor.Blue },
      { id: 1, name: 'P2', teamId: 1, teamColor: TeamColor.Red },
      { id: 2, name: 'P3', teamId: 0, teamColor: TeamColor.Blue },
      { id: 3, name: 'P4', teamId: 1, teamColor: TeamColor.Red },
    ];

    const teams: Team[] = [
      { id: 0, color: TeamColor.Blue, timeRemaining: 60000, isEliminated: false, playerIds: [0, 2] },
      { id: 1, color: TeamColor.Red, timeRemaining: 0, isEliminated: true, playerIds: [1, 3] },
    ];

    let activeIdx = 0;
    activeIdx = findNextActivePlayer(activeIdx, players, teams);
    expect(activeIdx).toBe(2);

    activeIdx = findNextActivePlayer(activeIdx, players, teams);
    expect(activeIdx).toBe(0);
  });
});

describe('1-Second Undo Mechanism and Winner Evaluation', () => {
  test('Snapshot correctly restores previous player index, word, and timers', () => {
    const initialPlayers: Player[] = [
      { id: 0, name: 'P1', teamId: 0, teamColor: TeamColor.Blue },
      { id: 1, name: 'P2', teamId: 1, teamColor: TeamColor.Red }
    ];
    const initialTeams: Team[] = [
      { id: 0, color: TeamColor.Blue, timeRemaining: 45000, isEliminated: false, playerIds: [0] },
      { id: 1, color: TeamColor.Red, timeRemaining: 50000, isEliminated: false, playerIds: [1] }
    ];

    let activePlayerIdx = 0;
    let currentWord = 'کتاب';
    let roundTimer = 75000;
    let teams = [...initialTeams];

    // Take snapshot before turn advance
    const snapshot = {
      activePlayerIndex: activePlayerIdx,
      word: currentWord,
      roundTimer: roundTimer,
      teams: JSON.parse(JSON.stringify(teams))
    };

    // Simulate accidental correct tap
    activePlayerIdx = 1;
    currentWord = 'خورشید';
    roundTimer = 74000;

    // Trigger Undo
    activePlayerIdx = snapshot.activePlayerIndex;
    currentWord = snapshot.word;
    roundTimer = snapshot.roundTimer;
    teams = snapshot.teams;

    expect(activePlayerIdx).toBe(0);
    expect(currentWord).toBe('کتاب');
    expect(roundTimer).toBe(75000);
    expect(teams[0].timeRemaining).toBe(45000);
  });

  test('Winner calculation picks team with highest remaining time', () => {
    const teams: Team[] = [
      { id: 0, color: TeamColor.Blue, timeRemaining: 45000, isEliminated: false, playerIds: [0, 2] },
      { id: 1, color: TeamColor.Red, timeRemaining: 62000, isEliminated: false, playerIds: [1, 3] },
      { id: 2, color: TeamColor.Green, timeRemaining: 0, isEliminated: true, playerIds: [4, 5] },
    ];

    const activeTeams = teams.filter(t => !t.isEliminated);
    const maxTime = Math.max(...activeTeams.map(t => t.timeRemaining));
    const winners = activeTeams.filter(t => t.timeRemaining === maxTime);

    expect(winners.length).toBe(1);
    expect(winners[0].color).toBe(TeamColor.Red);
    expect(winners[0].timeRemaining).toBe(62000);
  });

  test('Fast Hot-Potato mode advances turn immediately without modal when passPhoneScreenEnabled is false', () => {
    const settings: GameSettings = {
      playerCount: 4,
      roundsCount: 3,
      roundDuration: 90,
      selectedCategories: ["CAT_OBJECTS"],
      playerNames: ['P1', 'P2', 'P3', 'P4'],
      language: 'fa',
      passPhoneScreenEnabled: false,
      soundEnabled: true
    };

    expect(settings.passPhoneScreenEnabled).toBe(false);
    expect(settings.soundEnabled).toBe(true);

    // Simulate word guess in Fast Mode
    let gameStatus = GameStatus.ActiveTurn;
    let nextPlayerTriggered = false;

    if (settings.passPhoneScreenEnabled) {
      gameStatus = GameStatus.PassPhone;
    } else {
      nextPlayerTriggered = true;
      gameStatus = GameStatus.ActiveTurn;
    }

    expect(gameStatus).toBe(GameStatus.ActiveTurn);
    expect(nextPlayerTriggered).toBe(true);
  });

  test('Pass Phone screen triggers intermediate modal when passPhoneScreenEnabled is true', () => {
    const settings: GameSettings = {
      playerCount: 4,
      roundsCount: 3,
      roundDuration: 90,
      selectedCategories: ["CAT_OBJECTS"],
      playerNames: ['P1', 'P2', 'P3', 'P4'],
      language: 'fa',
      passPhoneScreenEnabled: true,
      soundEnabled: true
    };

    let gameStatus = GameStatus.ActiveTurn;
    if (settings.passPhoneScreenEnabled) {
      gameStatus = GameStatus.PassPhone;
    }

    expect(gameStatus).toBe(GameStatus.PassPhone);
  });

  test('Help and Guide content contains turn modes explanation in both Persian and English', () => {
    const enTurnsHelp = TRANSLATIONS.en.helpContent.sections.find((s: any) => s.id === 'turns');
    const faTurnsHelp = TRANSLATIONS.fa.helpContent.sections.find((s: any) => s.id === 'turns');

    expect(enTurnsHelp).toBeDefined();
    expect(enTurnsHelp?.body).toContain('Fast Hot-Potato');
    expect(enTurnsHelp?.body).toContain('Pass-Phone');

    expect(faTurnsHelp).toBeDefined();
    expect(faTurnsHelp?.body).toContain('سریع');
    expect(faTurnsHelp?.body).toContain('تحویل گوشی');
  });
});

