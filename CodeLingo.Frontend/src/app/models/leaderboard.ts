export interface LeaderboardDto {
  page: number;
  pageSize: number;
  totalEntries: number;
  totalPages: number;
  entries: LeaderboardEntryDto[];
  currentUserContext: CurrentUserContextDto;
  rankingRules: RankingRulesDto;
}

export interface LeaderboardEntryDto {
  userId: string;
  username: string;
  rank: number;
  score: number;
  accuracyPercentage: number;
  sessionCount: number;
  language: string;
  difficulty: string;
  isCurrentUser: boolean;
}

export interface CurrentUserContextDto {
  rank: number;
  score: number;
  accuracyPercentage: number;
  sessionCount: number;
  language: string;
  difficulty: string;
}

export interface RankingRulesDto {
  primary: string;
  secondary: string;
  tieBreak: string;
}
        