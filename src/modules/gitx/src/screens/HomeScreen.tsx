import { NavigationPageStatefulComponent } from 'valdi_core/src/Component';
import { NavigationPage } from 'valdi_navigation/src/NavigationPage';
import { Colors } from '../utils/ColorUtils';
import { styles } from '../utils/Styles';
import { UserProfile } from '../models/UserProfile';
import { ContributionCalendar } from '../models/Contribution';
import { Repository } from '../models/Repository';
import { ContributionStats } from '../services/ContributionService';
import { ProfileHeader } from '../components/ProfileHeader';
import { ContributionGrid } from '../components/ContributionGrid';
import { StatsCard } from '../components/StatsCard';
import { SectionHeader } from '../components/SectionHeader';
import { RepoListItem } from '../components/RepoListItem';
import { EmptyState } from '../components/EmptyState';
import { GitHubService } from '../services/GitHubService';
import { ContributionService } from '../services/ContributionService';
import { UserService } from '../services/UserService';

export interface HomeScreenViewModel {
  token: string;
  login: string;
  onNavigateToRepo: (repo: Repository) => void;
  onNavigateToSettings: () => void;
}

interface HomeState {
  isLoading: boolean;
  error: string | null;
  profile: UserProfile | null;
  contributions: ContributionCalendar | null;
  stats: ContributionStats | null;
  repositories: Repository[];
}

@NavigationPage(module)
export class HomeScreen extends NavigationPageStatefulComponent<HomeScreenViewModel, HomeState> {
  state: HomeState = {
    isLoading: true,
    error: null,
    profile: null,
    contributions: null,
    stats: null,
    repositories: [],
  };

  private github!: GitHubService;
  private contributionService!: ContributionService;
  private userService!: UserService;

  onCreate() {
    this.github = new GitHubService(this.viewModel.token);
    this.contributionService = new ContributionService(this.github);
    this.userService = new UserService(this.github);
    this.loadData();
  }

  private async loadData(forceRefresh = false) {
    this.setState({ isLoading: true, error: null });

    try {
      const [profile, contributions, repositories] = await Promise.all([
        this.userService.getProfile(forceRefresh),
        this.contributionService.getContributions(this.viewModel.login, forceRefresh),
        this.github.fetchRepositories(this.viewModel.login),
      ]);

      const stats = this.contributionService.computeStats(contributions);

      this.setState({
        isLoading: false,
        profile,
        contributions,
        stats,
        repositories,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load data.';
      this.setState({ isLoading: false, error: message });
    }
  }

  onRender() {
    const { isLoading, error, profile, contributions, stats, repositories } = this.state;

    <view style={styles.page}>
      {/* Top bar */}
      <view
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        paddingHorizontal={16}
        paddingTop={12}
        paddingBottom={8}
      >
        <label value='GitX' font={systemBoldFont(24)} color={Colors.textPrimary} />
        <view
          onTap={() => this.viewModel.onNavigateToSettings()}
          padding={8}
        >
          <label value='...' font={systemBoldFont(20)} color={Colors.textSecondary} />
        </view>
      </view>

      {/* Content */}
      <scroll width='100%' flexGrow={1}>
        <view flexDirection='column' paddingBottom={40}>
          {/* Loading state */}
          {isLoading && profile === null && (
            <EmptyState message='Loading your contributions...' isLoading={true} />
          )}

          {/* Error state */}
          {error !== null && (
            <view style={styles.card}>
              <label value={error} font={systemFont(14)} color={Colors.error} />
              <view
                style={styles.buttonOutline}
                marginTop={12}
                onTap={() => this.loadData(true)}
              >
                <label value='Retry' font={systemFont(14)} color={Colors.textPrimary} />
              </view>
            </view>
          )}

          {/* Profile */}
          {profile !== null && <ProfileHeader profile={profile} />}

          {/* Contribution grid */}
          {contributions !== null && (
            <ContributionGrid calendar={contributions} />
          )}

          {/* Stats */}
          {stats !== null && (
            <view>
              <SectionHeader title='Stats' />
              <view style={styles.grid2x2}>
                <view style={styles.gridCell} marginRight='4%'>
                  <StatsCard
                    label='Total contributions'
                    value={`${stats.totalContributions}`}
                  />
                </view>
                <view style={styles.gridCell}>
                  <StatsCard
                    label='Current streak'
                    value={`${stats.currentStreak} days`}
                  />
                </view>
                <view style={styles.gridCell} marginRight='4%'>
                  <StatsCard
                    label='Longest streak'
                    value={`${stats.longestStreak} days`}
                  />
                </view>
                <view style={styles.gridCell}>
                  <StatsCard
                    label='Most active day'
                    value={stats.mostActiveDay}
                  />
                </view>
              </view>
            </view>
          )}

          {/* Repositories */}
          {repositories.length > 0 && (
            <view>
              <SectionHeader title='Repositories' />
              <view style={styles.card} padding={0} overflow='hidden'>
                {repositories.forEach((repo, index) => {
                  <view>
                    {index > 0 && <view style={styles.divider} marginVertical={0} />}
                    <RepoListItem
                      repo={repo}
                      onTap={(r) => this.viewModel.onNavigateToRepo(r)}
                    />
                  </view>;
                })}
              </view>
            </view>
          )}
        </view>
      </scroll>
    </view>;
  }
}
