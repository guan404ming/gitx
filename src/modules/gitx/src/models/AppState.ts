import { ContributionCalendar } from './Contribution';
import { Repository } from './Repository';
import { UserProfile } from './UserProfile';

export interface AppState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  profile: UserProfile | null;
  contributions: ContributionCalendar | null;
  repositories: Repository[];
}
