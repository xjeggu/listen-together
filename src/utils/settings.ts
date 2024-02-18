interface StorageService {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

class Settings {
  settingsVersion: string;
  server: string;
  name: string;
  login: string;
  password: string;
  autoConnect: boolean;

  constructor({
    settingsVersion = '1',
    server = '',
    name = 'Anonymous',
    login = '',
    password = '',
    autoConnect = false,
  }: Partial<Settings> = {}) {
    this.settingsVersion = settingsVersion;
    this.server = server;
    this.name = name;
    this.login = login;
    this.password = password;
    this.autoConnect = autoConnect;
  }
}

export default class SettingsManager {
  settings: Settings;
  storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;

    const defaults = new Settings();
    const storedSettingsString = this.storageService.get('listenTogether');

    if (storedSettingsString !== null) {
      try {
        const storedSettings = JSON.parse(storedSettingsString);
        if (storedSettings.settingsVersion === defaults.settingsVersion) {
          this.settings = new Settings(storedSettings);
        } else {
          this.settings = defaults;
        }
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
        this.settings = defaults;
      }
    } else {
      this.settings = defaults;
    }

    this.saveSettings();
  }

  saveSettings() {
    this.storageService.set('listenTogether', JSON.stringify(this.settings));
  }
}
