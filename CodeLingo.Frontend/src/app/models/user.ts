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
