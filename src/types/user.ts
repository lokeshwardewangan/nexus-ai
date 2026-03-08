/** The signed-in user as surfaced to the UI. */
export interface StudioUser {
  name: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  tokensUsed: number;
}
