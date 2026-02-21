import { StatefulComponent, NavigationPageStatefulComponent } from 'valdi_core/src/Component';
import { NavigationPage } from 'valdi_navigation/src/NavigationPage';
import { Colors } from '../utils/ColorUtils';
import { styles } from '../utils/Styles';
import { AuthService } from '../services/AuthService';
import { GitHubService } from '../services/GitHubService';

interface OnboardingState {
  token: string;
  isValidating: boolean;
  error: string | null;
}

export interface OnboardingScreenViewModel {
  onAuthenticated: (token: string, login: string) => void;
}

@NavigationPage(module)
export class OnboardingScreen extends NavigationPageStatefulComponent<
  OnboardingScreenViewModel,
  OnboardingState
> {
  state: OnboardingState = {
    token: '',
    isValidating: false,
    error: null,
  };

  private authService = new AuthService();

  private handleConnect = async () => {
    const token = this.state.token.trim();
    if (!token) {
      this.setState({ error: 'Please enter a token.' });
      return;
    }

    this.setState({ isValidating: true, error: null });

    try {
      const github = new GitHubService(token);
      const profile = await github.fetchProfile();

      await this.authService.saveToken(token);
      await this.authService.saveLogin(profile.login);

      this.viewModel.onAuthenticated(token, profile.login);
    } catch {
      this.setState({
        isValidating: false,
        error: 'Invalid token. Check the token and try again.',
      });
    }
  };

  onRender() {
    const { isValidating, error } = this.state;

    <view style={styles.page} justifyContent='center' alignItems='center'>
      <view width='90%' maxWidth={400}>
        {/* Logo area */}
        <view alignItems='center' marginBottom={40}>
          <label
            value='GitX'
            font={systemBoldFont(32)}
            color={Colors.textPrimary}
          />
          <label
            value='Your GitHub contributions, beautifully.'
            font={systemFont(15)}
            color={Colors.textSecondary}
            marginTop={8}
            textAlign='center'
          />
        </view>

        {/* Token input card */}
        <view style={styles.card}>
          <label
            value='Connect with GitHub'
            font={systemBoldFont(16)}
            color={Colors.textPrimary}
            marginBottom={8}
          />
          <label
            value='Enter a Personal Access Token with read:user and repo scopes.'
            font={systemFont(13)}
            color={Colors.textSecondary}
            marginBottom={16}
            numberOfLines={2}
          />

          {/* Token input */}
          <textfield
            style={styles.textInput}
            placeholder='ghp_xxxxxxxxxxxx'
            value={this.state.token}
            secureTextEntry={true}
            onChangeText={(text: string) => this.setState({ token: text, error: null })}
            marginBottom={12}
          />

          {/* Error message */}
          {error !== null && (
            <label
              value={error}
              font={systemFont(13)}
              color={Colors.error}
              marginBottom={12}
            />
          )}

          {/* Connect button */}
          <view
            style={isValidating ? styles.buttonOutline : styles.button}
            onTap={isValidating ? undefined : this.handleConnect}
            opacity={isValidating ? 0.6 : 1}
          >
            {isValidating ? (
              <view flexDirection='row' alignItems='center'>
                <spinner color={Colors.textSecondary} />
                <label
                  value='Validating...'
                  font={systemFont(14)}
                  color={Colors.textSecondary}
                  marginLeft={8}
                />
              </view>
            ) : (
              <label
                value='Connect'
                font={systemBoldFont(14)}
                color={Colors.background}
              />
            )}
          </view>
        </view>

        {/* Footer */}
        <label
          value='Your token is stored securely on-device.'
          font={systemFont(11)}
          color={Colors.textTertiary}
          textAlign='center'
          marginTop={16}
        />
      </view>
    </view>;
  }
}
