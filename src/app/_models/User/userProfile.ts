export interface UserProfile {
  id: string;
  bio?: string | null;
  profileCoverUrl?: string | null;
  location?: string;
  website?: string | null;
  occupation?: string | null;
}
