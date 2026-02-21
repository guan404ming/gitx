import { StatefulComponent } from 'valdi_core/src/Component';
import { NavigationRoot } from 'valdi_navigation/src/NavigationRoot';
import { AuthService } from './services/AuthService';
import { Repository } from './models/Repository';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RepoDetailScreen } from './screens/RepoDetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { styles } from './utils/Styles';
import { EmptyState } from './components/EmptyState';

interface GitXAppState {
  isReady: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: string | null;
}

export class GitXApp extends StatefulComponent<{}, GitXAppState> {
  state: GitXAppState = {
    isReady: false,
    isAuthenticated: false,
    token: null,
    login: null,
  };

  private authService = new AuthService();

  async onCreate() {
    const token = await this.authService.getToken();
    const login = await this.authService.getLogin();

    if (token && login) {
      this.setState({
        isReady: true,
        isAuthenticated: true,
        token,
        login,
      });
    } else {
      this.setState({ isReady: true });
    }
  }

  private handleAuthenticated = (token: string, login: string) => {
    this.setState({
      isAuthenticated: true,
      token,
      login,
    });
  };

  private handleDisconnect = () => {
    this.setState({
      isAuthenticated: false,
      token: null,
      login: null,
    });
  };

  onRender() {
    const { isReady, isAuthenticated, token, login } = this.state;

    if (!isReady) {
      <view style={styles.page} justifyContent='center' alignItems='center'>
        <EmptyState message='Loading...' isLoading={true} />
      </view>;
      return;
    }

    <NavigationRoot>
      {$slot((navigationController) => {
        if (!isAuthenticated || !token || !login) {
          <OnboardingScreen onAuthenticated={this.handleAuthenticated} />;
        } else {
          <HomeScreen
            token={token}
            login={login}
            onNavigateToRepo={(repo: Repository) => {
              navigationController.push(RepoDetailScreen, {
                repo,
                token,
                login,
              }, {});
            }}
            onNavigateToSettings={() => {
              navigationController.push(SettingsScreen, {
                login,
                token,
                onDisconnect: this.handleDisconnect,
              }, {});
            }}
          />;
        }
      })}
    </NavigationRoot>;
  }
}
