import { Component } from 'valdi_core/src/Component';
import { UserProfile } from '../models/UserProfile';
import { Colors } from '../utils/ColorUtils';
import { formatDate } from '../utils/DateUtils';
import { styles } from '../utils/Styles';

export interface ProfileHeaderViewModel {
  profile: UserProfile;
}

export class ProfileHeader extends Component<ProfileHeaderViewModel> {
  onRender() {
    const { profile } = this.viewModel;

    <view style={styles.card}>
      <view flexDirection='row' alignItems='center'>
        {/* Avatar */}
        <image
          src={profile.avatarUrl}
          width={56}
          height={56}
          borderRadius={28}
          marginRight={14}
        />

        {/* Info */}
        <view flexShrink={1}>
          <label
            value={profile.name}
            font={systemBoldFont(20)}
            color={Colors.textPrimary}
          />
          <label
            value={`@${profile.login}`}
            font={systemFont(14)}
            color={Colors.textSecondary}
            marginTop={2}
          />
        </view>
      </view>

      {/* Bio */}
      {profile.bio !== '' && (
        <label
          value={profile.bio}
          font={systemFont(14)}
          color={Colors.textSecondary}
          marginTop={12}
          numberOfLines={3}
        />
      )}

      {/* Joined date */}
      <label
        value={`Joined ${formatDate(profile.createdAt)}`}
        font={systemFont(12)}
        color={Colors.textTertiary}
        marginTop={8}
      />
    </view>;
  }
}
