import { PersistentStore } from 'persistence/src/PersistentStore';

const TOKEN_KEY = 'github_pat';
const LOGIN_KEY = 'github_login';

export class AuthService {
  private store: PersistentStore;

  constructor() {
    this.store = new PersistentStore('gitx_auth', {
      enableEncryption: true,
    });
  }

  async saveToken(token: string): Promise<void> {
    await this.store.storeString(TOKEN_KEY, token);
  }

  async getToken(): Promise<string | null> {
    if (await this.store.exists(TOKEN_KEY)) {
      return await this.store.fetchString(TOKEN_KEY);
    }
    return null;
  }

  async saveLogin(login: string): Promise<void> {
    await this.store.storeString(LOGIN_KEY, login);
  }

  async getLogin(): Promise<string | null> {
    if (await this.store.exists(LOGIN_KEY)) {
      return await this.store.fetchString(LOGIN_KEY);
    }
    return null;
  }

  async clearAuth(): Promise<void> {
    await this.store.removeAll();
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.store.exists(TOKEN_KEY);
  }
}
