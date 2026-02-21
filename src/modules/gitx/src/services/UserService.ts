import { PersistentStore } from 'persistence/src/PersistentStore';
import { UserProfile } from '../models/UserProfile';
import { GitHubService } from './GitHubService';

const CACHE_KEY = 'user_profile_cache';
const CACHE_TTL = 3600; // 1 hour

export class UserService {
  private cache: PersistentStore;
  private github: GitHubService;

  constructor(github: GitHubService) {
    this.github = github;
    this.cache = new PersistentStore('gitx_user');
  }

  async getProfile(forceRefresh = false): Promise<UserProfile> {
    if (!forceRefresh) {
      const cached = await this.getCached();
      if (cached) return cached;
    }

    const profile = await this.github.fetchProfile();
    await this.saveCache(profile);
    return profile;
  }

  private async getCached(): Promise<UserProfile | null> {
    try {
      if (await this.cache.exists(CACHE_KEY)) {
        const raw = await this.cache.fetchString(CACHE_KEY);
        return JSON.parse(raw) as UserProfile;
      }
    } catch {
      // Cache miss or expired
    }
    return null;
  }

  private async saveCache(profile: UserProfile): Promise<void> {
    const raw = JSON.stringify(profile);
    await this.cache.storeString(CACHE_KEY, raw, CACHE_TTL);
  }

  async clearCache(): Promise<void> {
    await this.cache.removeAll();
  }
}
