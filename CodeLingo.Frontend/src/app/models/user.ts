export interface User {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

export interface UserStatistics {
  totalQuestionsAnswered: number;
  accuracy: number;
  currentStreak: number;
  rank: number;
}

export interface ProfileUpdateRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

export interface UserStats {
  userId: string;
  totalScore: number;
  accuracyPercentage: number;
  sessionCount: number;
  historicalProgress: HistoricalProgress;
  languageBreakdown: LanguageBreakdown;
  difficultyBreakdown: DifficultyBreakdown;
  timeBasedStats: TimeBasedStats;
}

export interface HistoricalProgress {
  sessions: SessionHistory[];
}

export interface SessionHistory {
  sessionId: string;
  date: string;
  score: number;
  accuracy: number;
  language: string;
  difficulty: string;
}

export interface LanguageBreakdown {
  items: LanguageBreakdownItem[];
}

export interface LanguageBreakdownItem {
  language: string;
  totalScore: number;
  accuracyPercentage: number;
  sessionCount: number;
}

export interface DifficultyBreakdown {
  items: DifficultyBreakdownItem[];
}

export interface DifficultyBreakdownItem {
  difficulty: string;
  totalScore: number;
  accuracyPercentage: number;
  sessionCount: number;
}

export interface TimeBasedStats {
  daily: TimeBasedStat;
  weekly: TimeBasedStat;
  monthly: TimeBasedStat;
}

export interface TimeBasedStat {
  score: number;
}