
export enum TeamColor {
  Blue = 'BLUE',
  Red = 'RED',
  Green = 'GREEN',
  Yellow = 'YELLOW'
}

export interface Player {
  id: number;
  name: string;
  teamId: number;
  teamColor: TeamColor;
}

export interface Team {
  id: number;
  color: TeamColor;
  timeRemaining: number; // milliseconds
  isEliminated: boolean;
  playerIds: number[];
}

export interface GameSettings {
  playerCount: 4 | 6 | 8;
  roundsCount: number;
  roundDuration: number; // seconds
  selectedCategories: string[];
  playerNames: string[];
}

export interface GameHistoryEntry {
  id: string;
  date: string;
  players: string[];
  winnerColor: TeamColor | 'TIE';
  winnerNames: string[];
}

export enum GameStatus {
  Setup = 'SETUP',
  RoundStarting = 'ROUND_STARTING',
  Playing = 'PLAYING',
  Paused = 'PAUSED',
  Help = 'HELP',
  RoundFinished = 'ROUND_FINISHED',
  GameOver = 'GAME_OVER'
}
