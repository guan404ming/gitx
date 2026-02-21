import { Component } from 'valdi_core/src/Component';
import { Repository } from '../models/Repository';
import { Colors } from '../utils/ColorUtils';
import { formatRelativeDate } from '../utils/DateUtils';

export interface RepoListItemViewModel {
  repo: Repository;
  onTap: (repo: Repository) => void;
}

export class RepoListItem extends Component<RepoListItemViewModel> {
  onRender() {
    const { repo, onTap } = this.viewModel;

    <view
      flexDirection='row'
      alignItems='center'
      paddingVertical={12}
      paddingHorizontal={16}
      width='100%'
      onTap={() => onTap(repo)}
    >
      {/* Repo info */}
      <view flexGrow={1} flexShrink={1}>
        <label
          value={repo.name}
          font={systemFont(15)}
          color={Colors.textPrimary}
          numberOfLines={1}
        />
        <label
          value={repo.pushedAt ? formatRelativeDate(repo.pushedAt) : ''}
          font={systemFont(12)}
          color={Colors.textTertiary}
          marginTop={2}
        />
      </view>

      {/* Commit count badge */}
      <view
        backgroundColor={Colors.surfaceHover}
        borderRadius={4}
        paddingVertical={4}
        paddingHorizontal={8}
        marginLeft={12}
      >
        <label
          value={`${repo.commitCount}`}
          font={systemFont(13)}
          color={Colors.textSecondary}
        />
      </view>

      {/* Chevron */}
      <label
        value='>'
        font={systemFont(14)}
        color={Colors.textTertiary}
        marginLeft={8}
      />
    </view>;
  }
}
