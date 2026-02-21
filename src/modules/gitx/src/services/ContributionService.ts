import { PersistentStore } from 'persistence/src/PersistentStore';
import { ContributionCalendar, ContributionDay } from '../models/Contribution';
import { GitHubService } from './GitHubService';
import { calculateStreak, getMostActiveDay } from '../utils/DateUtils';

const CACHE_KEY = 'contributions_cache';
const CACHE_TTL = 3600; // 1 hour

export interface ContributionStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  mostActiveDay: string;
}

export class ContributionService {
  private cache: PersistentStore;
  private github: GitHubService;

  constructor(github: GitHubService) {
    this.github = github;
    this.cache = new PersistentStore('gitx_contributions');
  }

  async getContributions(login: string, forceRefresh = false): Promise<ContributionCalendar> {
    if (!forceRefresh) {
      const cached = await this.getCached();
      if (cached) return cached;
    }

    const data = await this.github.fetchContributions(login);
    await this.saveCache(data);
    return data;
  }

  computeStats(calendar: ContributionCalendar): ContributionStats {
    const allDays: ContributionDay[] = [];
    for (const week of calendar.weeks) {
      for (const day of week.days) {
        allDays.push(day);
      }
    }

    const { current, longest } = calculateStreak(allDays);
    const mostActiveDay = getMostActiveDay(allDays);

    return {
      totalContributions: calendar.totalContributions,
      currentStreak: current,
      longestStreak: longest,
      mostActiveDay,
    };
  }

  private async getCached(): Promise<ContributionCalendar | null> {
    try {
      if (await this.cache.exists(CACHE_KEY)) {
        const raw = await this.cache.fetchString(CACHE_KEY);
        return JSON.parse(raw) as ContributionCalendar;
      }
    } catch {
      // Cache miss or expired
    }
    return null;
  }

  private async saveCache(data: ContributionCalendar): Promise<void> {
    const raw = JSON.stringify(data);
    await this.cache.storeString(CACHE_KEY, raw, CACHE_TTL);
  }

  async clearCache(): Promise<void> {
    await this.cache.removeAll();
  }
}
