import { NavigationPageStatefulComponent } from 'valdi_core/src/Component';
import { NavigationPage } from 'valdi_navigation/src/NavigationPage';
import { Colors } from '../utils/ColorUtils';
import { styles } from '../utils/Styles';
import { AuthService } from '../services/AuthService';
import { ContributionService } from '../services/ContributionService';
import { UserService } from '../services/UserService';
import { GitHubService } from '../services/GitHubService';

export interface SettingsScreenViewModel {
  login: string;
  token: string;
  onDisconnect: () => void;
}

interface SettingsState {
  isClearing: boolean;
}

@NavigationPage(module)
export class SettingsScreen extends NavigationPageStatefulComponent<
  SettingsScreenViewModel,
  SettingsState
> {
  state: SettingsState = { isClearing: false };

  private authService = new AuthService();

  private handleDisconnect = async () => {
    await this.authService.clearAuth();

    const github = new GitHubService(this.viewModel.token);
    const contributionService = new ContributionService(github);
    const userService = new UserService(github);
    await contributionService.clearCache();
    await userService.clearCache();

    this.viewModel.onDisconnect();
  };

  private handleClearCache = async () => {
    this.setState({ isClearing: true });

    const github = new GitHubService(this.viewModel.token);
    const contributionService = new ContributionService(github);
    const userService = new UserService(github);
    await contributionService.clearCache();
    await userService.clearCache();

    this.setState({ isClearing: false });
  };

  onRender() {
    const { login } = this.viewModel;
    const { isClearing } = this.state;

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
        <label
          value='Settings'
          font={systemBoldFont(18)}
          color={Colors.textPrimary}
          marginLeft={8}
        />
      </view>

      <scroll width='100%' flexGrow={1}>
        <view flexDirection='column' paddingBottom={40}>
          {/* Account section */}
          <view paddingHorizontal={16} paddingTop={24} paddingBottom={8}>
            <label
              value='ACCOUNT'
              font={systemBoldFont(11)}
              color={Colors.textTertiary}
              letterSpacing={0.5}
            />
          </view>
          <view style={styles.card}>
            <view flexDirection='row' alignItems='center' justifyContent='space-between'>
              <view>
                <label
                  value={`Connected as @${login}`}
                  font={systemFont(14)}
                  color={Colors.textPrimary}
                />
              </view>
            </view>
            <view
              style={styles.buttonDestructive}
              marginTop={16}
              onTap={this.handleDisconnect}
            >
              <label
                value='Disconnect'
                font={systemBoldFont(14)}
                color={Colors.background}
              />
            </view>
          </view>

          {/* Data section */}
          <view paddingHorizontal={16} paddingTop={24} paddingBottom={8}>
            <label
              value='DATA'
              font={systemBoldFont(11)}
              color={Colors.textTertiary}
              letterSpacing={0.5}
            />
          </view>
          <view style={styles.card}>
            <label
              value='Cached data is refreshed automatically every hour.'
              font={systemFont(13)}
              color={Colors.textSecondary}
              marginBottom={12}
            />
            <view
              style={styles.buttonOutline}
              onTap={isClearing ? undefined : this.handleClearCache}
              opacity={isClearing ? 0.6 : 1}
            >
              <label
                value={isClearing ? 'Clearing...' : 'Clear cache'}
                font={systemFont(14)}
                color={Colors.textPrimary}
              />
            </view>
          </view>

          {/* About section */}
          <view paddingHorizontal={16} paddingTop={24} paddingBottom={8}>
            <label
              value='ABOUT'
              font={systemBoldFont(11)}
              color={Colors.textTertiary}
              letterSpacing={0.5}
            />
          </view>
          <view style={styles.card}>
            <view flexDirection='row' justifyContent='space-between' marginBottom={8}>
              <label value='Version' font={systemFont(14)} color={Colors.textSecondary} />
              <label value='1.0.0' font={systemFont(14)} color={Colors.textTertiary} />
            </view>
            <view style={styles.divider} />
            <view flexDirection='row' justifyContent='space-between' marginTop={8}>
              <label value='Built with' font={systemFont(14)} color={Colors.textSecondary} />
              <label value='Valdi' font={systemFont(14)} color={Colors.textTertiary} />
            </view>
          </view>
        </view>
      </scroll>
    </view>;
  }
}
