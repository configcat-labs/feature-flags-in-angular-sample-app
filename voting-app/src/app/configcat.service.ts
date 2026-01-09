import { isDevMode, Injectable, type OnDestroy, signal } from '@angular/core';
import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from '@configcat/sdk/browser';
import { createConsoleLogger, LogLevel, getClient, PollingMode } from '@configcat/sdk/browser';

@Injectable({ providedIn: 'root' })
export class ConfigCatService implements OnDestroy {
  private client?: IConfigCatClient;

  public readonly connectionState = signal<'loading' | 'ready' | 'error' | 'disabled'>('loading');

  // For demo purposes - in production, move this to environment files
  private readonly SDK_KEY = ''; // YOUR-CONFIGCAT-SDK-KEY
  private readonly POLL_INTERVAL_SECONDS = 60;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    if (!this.SDK_KEY) {
      console.warn('ConfigCat SDK key is not configured');
      this.connectionState.set('disabled');
      return;
    }

    const logger = createConsoleLogger(isDevMode() ? LogLevel.Info : LogLevel.Warn);

    try {
      this.client = getClient(this.SDK_KEY, PollingMode.AutoPoll, {
        pollIntervalSeconds: this.POLL_INTERVAL_SECONDS,
        logger,
        setupHooks: (hooks) => {
          hooks.on('clientError', (error) => {
            console.error('ConfigCat client error:', error);
            this.connectionState.set('error');
          });
          hooks.on('clientReady', () => {
            this.connectionState.set('ready');
          });
        },
      });
    } catch (error) {
      console.error('ConfigCat initialization failed:', error);
      this.connectionState.set('disabled');
    }
  }

  async getValue<T extends SettingValue>(
    key: string,
    defaultValue: T,
    user?: User,
  ): Promise<SettingTypeOf<T>> {
    if (!this.client) {
      console.warn(`ConfigCat client not available, returning default value for key: ${key}`);
      return defaultValue as SettingTypeOf<T>;
    }

    try {
      return await this.client.getValueAsync(key, defaultValue, user);
    } catch (error) {
      console.error(`Error fetching ConfigCat value for key ${key}:`, error);
      return defaultValue as SettingTypeOf<T>;
    }
  }

  ngOnDestroy(): void {
    this.client?.dispose();
    this.client = undefined;
  }
}
