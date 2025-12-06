export interface User {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

export interface ProfileUpdateRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}
