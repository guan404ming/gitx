import { HTTPClient } from 'valdi_http/src/HTTPClient';
import { UserProfile } from '../models/UserProfile';
import { ContributionCalendar, ContributionDay, ContributionLevel } from '../models/Contribution';
import { Repository } from '../models/Repository';
import { Commit } from '../models/Commit';

const GRAPHQL_URL = 'https://api.github.com/graphql';
const REST_BASE = 'https://api.github.com';

export class GitHubService {
  private client: HTTPClient;
  private token: string;

  constructor(token: string) {
    this.client = new HTTPClient();
    this.token = token;
  }

  private authHeaders(): Record<string, string> {
    return {
      Authorization: `bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const body = JSON.stringify({ query, variables });
    const encoded = new TextEncoder().encode(body);
    const response = await this.client.post(GRAPHQL_URL, encoded, this.authHeaders());

    if (response.statusCode !== 200) {
      throw new Error(`GitHub API error: ${response.statusCode}`);
    }

    const text = new TextDecoder().decode(response.body);
    const json = JSON.parse(text);

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data as T;
  }

  private async rest<T>(path: string): Promise<T> {
    const response = await this.client.get(`${REST_BASE}${path}`, this.authHeaders());

    if (response.statusCode !== 200) {
      throw new Error(`GitHub API error: ${response.statusCode}`);
    }

    const text = new TextDecoder().decode(response.body);
    return JSON.parse(text) as T;
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.fetchProfile();
      return true;
    } catch {
      return false;
    }
  }

  async fetchProfile(): Promise<UserProfile> {
    const query = `
      query {
        viewer {
          login
          name
          avatarUrl
          bio
          createdAt
        }
      }
    `;

    const data = await this.graphql<{
      viewer: {
        login: string;
        name: string | null;
        avatarUrl: string;
        bio: string | null;
        createdAt: string;
      };
    }>(query);

    return {
      login: data.viewer.login,
      name: data.viewer.name ?? data.viewer.login,
      avatarUrl: data.viewer.avatarUrl,
      bio: data.viewer.bio ?? '',
      createdAt: data.viewer.createdAt,
    };
  }

  async fetchContributions(login: string): Promise<ContributionCalendar> {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: Array<{
              contributionDays: Array<{
                date: string;
                contributionCount: number;
                contributionLevel: string;
              }>;
            }>;
          };
        };
      };
    }>(query, { login });

    const raw = data.user.contributionsCollection.contributionCalendar;

    return {
      totalContributions: raw.totalContributions,
      weeks: raw.weeks.map((week) => ({
        days: week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: mapContributionLevel(day.contributionLevel),
        })),
      })),
    };
  }

  async fetchRepositories(login: string): Promise<Repository[]> {
    const query = `
      query {
        viewer {
          repositories(
            first: 100
            orderBy: { field: PUSHED_AT, direction: DESC }
            ownerAffiliations: OWNER
          ) {
            nodes {
              name
              owner { login }
              url
              pushedAt
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 0) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{
      viewer: {
        repositories: {
          nodes: Array<{
            name: string;
            owner: { login: string };
            url: string;
            pushedAt: string | null;
            defaultBranchRef: {
              target: {
                history: { totalCount: number };
              };
            } | null;
          }>;
        };
      };
    }>(query);

    return data.viewer.repositories.nodes
      .filter((r) => r.defaultBranchRef !== null)
      .map((r) => ({
        name: r.name,
        owner: r.owner.login,
        url: r.url,
        pushedAt: r.pushedAt ?? '',
        commitCount: r.defaultBranchRef?.target.history.totalCount ?? 0,
      }))
      .sort((a, b) => b.commitCount - a.commitCount);
  }

  async fetchCommits(owner: string, repo: string, login: string, page = 1): Promise<Commit[]> {
    const path = `/repos/${owner}/${repo}/commits?author=${login}&per_page=30&page=${page}`;
    const data = await this.rest<
      Array<{
        sha: string;
        commit: {
          message: string;
          author: { date: string };
        };
      }>
    >(path);

    return data.map((c) => ({
      sha: c.sha,
      message: c.commit.message.split('\n')[0], // First line only
      date: c.commit.author.date,
      repo: `${owner}/${repo}`,
    }));
  }
}

function mapContributionLevel(level: string): ContributionLevel {
  switch (level) {
    case 'FIRST_QUARTILE':
      return 1;
    case 'SECOND_QUARTILE':
      return 2;
    case 'THIRD_QUARTILE':
      return 3;
    case 'FOURTH_QUARTILE':
      return 4;
    default:
      return 0;
  }
}
