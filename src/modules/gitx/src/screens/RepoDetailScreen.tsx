import { NavigationPageStatefulComponent } from 'valdi_core/src/Component';
import { NavigationPage } from 'valdi_navigation/src/NavigationPage';
import { Colors } from '../utils/ColorUtils';
import { styles } from '../utils/Styles';
import { Repository } from '../models/Repository';
import { Commit } from '../models/Commit';
import { GitHubService } from '../services/GitHubService';
import { CommitListItem } from '../components/CommitListItem';
import { SectionHeader } from '../components/SectionHeader';
import { EmptyState } from '../components/EmptyState';

export interface RepoDetailScreenViewModel {
  repo: Repository;
  token: string;
  login: string;
}

interface RepoDetailState {
  isLoading: boolean;
  commits: Commit[];
  page: number;
  hasMore: boolean;
  error: string | null;
}

@NavigationPage(module)
export class RepoDetailScreen extends NavigationPageStatefulComponent<
  RepoDetailScreenViewModel,
  RepoDetailState
> {
  state: RepoDetailState = {
    isLoading: true,
    commits: [],
    page: 1,
    hasMore: true,
    error: null,
  };

  private github!: GitHubService;

  onCreate() {
    this.github = new GitHubService(this.viewModel.token);
    this.loadCommits();
  }

  private async loadCommits() {
    const { repo, login } = this.viewModel;
    this.setState({ isLoading: true, error: null });

    try {
      const commits = await this.github.fetchCommits(
        repo.owner,
        repo.name,
        login,
        this.state.page
      );

      this.setState({
        isLoading: false,
        commits: [...this.state.commits, ...commits],
        hasMore: commits.length === 30,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load commits.';
      this.setState({ isLoading: false, error: message });
    }
  }

  private loadMore = () => {
    if (this.state.isLoading || !this.state.hasMore) return;
    this.setState({ page: this.state.page + 1 });
    this.loadCommits();
  };

  onRender() {
    const { repo } = this.viewModel;
    const { isLoading, commits, error, hasMore } = this.state;

    <view style={styles.page}>
      {/* Header */}
      <view
        flexDirection='row'
        alignItems='center'
        paddingHorizontal={16}
        paddingTop={12}
        paddingBottom={8}
      >
        <view onTap={() => this.navigationController.pop()} padding={8}>
          <label value='<' font={systemBoldFont(18)} color={Colors.textPrimary} />
        </view>
        <view marginLeft={8} flexShrink={1}>
          <label
            value={repo.name}
            font={systemBoldFont(18)}
            color={Colors.textPrimary}
            numberOfLines={1}
          />
          <label
            value={repo.owner}
            font={systemFont(13)}
            color={Colors.textSecondary}
          />
        </view>
      </view>

      {/* Commit count */}
      <view style={styles.card}>
        <label
          value={`${repo.commitCount} total commits`}
          font={systemFont(14)}
          color={Colors.textSecondary}
        />
      </view>

      {/* Commits list */}
      <SectionHeader title='Recent commits' />
      <scroll width='100%' flexGrow={1}>
        <view flexDirection='column' paddingBottom={40}>
          {commits.length === 0 && !isLoading && (
            <EmptyState message='No commits found.' />
          )}

          {error !== null && (
            <view style={styles.card}>
              <label value={error} font={systemFont(14)} color={Colors.error} />
            </view>
          )}

          <view style={styles.card} padding={0} overflow='hidden'>
            {commits.forEach((commit, index) => {
              <view>
                {index > 0 && <view style={styles.divider} marginVertical={0} />}
                <CommitListItem commit={commit} />
              </view>;
            })}
          </view>

          {/* Load more */}
          {hasMore && commits.length > 0 && (
            <view
              style={styles.buttonOutline}
              marginHorizontal={16}
              marginTop={12}
              onTap={this.loadMore}
              opacity={isLoading ? 0.6 : 1}
            >
              <label
                value={isLoading ? 'Loading...' : 'Load more'}
                font={systemFont(14)}
                color={Colors.textPrimary}
              />
            </view>
          )}

          {isLoading && commits.length === 0 && (
            <EmptyState message='Loading commits...' isLoading={true} />
          )}
        </view>
      </scroll>
    </view>;
  }
}
