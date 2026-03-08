/** A user's profile as surfaced to the studio UI. */
export interface Profile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  headline: string;
  bio: string;
  avatarUrl: string | null;
  tokensUsed: number;
}
