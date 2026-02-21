import { Component } from 'valdi_core/src/Component';
import { Commit } from '../models/Commit';
import { Colors } from '../utils/ColorUtils';
import { formatRelativeDate, shortSha } from '../utils/DateUtils';

export interface CommitListItemViewModel {
  commit: Commit;
}

export class CommitListItem extends Component<CommitListItemViewModel> {
  onRender() {
    const { commit } = this.viewModel;

    <view
      flexDirection='row'
      alignItems='flex-start'
      paddingVertical={10}
      paddingHorizontal={16}
      width='100%'
    >
      {/* SHA badge */}
      <view
        backgroundColor={Colors.surfaceHover}
        borderRadius={4}
        paddingVertical={2}
        paddingHorizontal={6}
        marginRight={10}
        marginTop={2}
      >
        <label
          value={shortSha(commit.sha)}
          font={monospacedFont(11)}
          color={Colors.textSecondary}
        />
      </view>

      {/* Message and date */}
      <view flexGrow={1} flexShrink={1}>
        <label
          value={commit.message}
          font={systemFont(14)}
          color={Colors.textPrimary}
          numberOfLines={2}
        />
        <label
          value={formatRelativeDate(commit.date)}
          font={systemFont(11)}
          color={Colors.textTertiary}
          marginTop={3}
        />
      </view>
    </view>;
  }
}
