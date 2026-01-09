import { isDevMode, Injectable, type OnDestroy, signal, computed } from '@angular/core';
import type { IConfigCatClient, SettingTypeOf, SettingValue, User } from '@configcat/sdk/browser';
import {
  createConsoleLogger,
  LogLevel,
  getClient,
  PollingMode,
  IConfigCatClientSnapshot,
} from '@configcat/sdk/browser';

@Injectable({ providedIn: 'root' })
export class ConfigCatService implements OnDestroy {
  private readonly client?: IConfigCatClient;

  public readonly connectionState = signal<'loading' | 'ready' | 'error' | 'disabled'>('loading');
  private readonly snapshotSignal = signal<IConfigCatClientSnapshot | null>(null);

  readonly snapshot = this.snapshotSignal.asReadonly();

  private defaultUser?: User;

  // For demo purposes - in production, move this to your environment file
  private readonly SDK_KEY = ''; // YOUR-CONFIGCAT-SDK-KEY
  private readonly POLL_INTERVAL_SECONDS = 30;

  constructor() {
    // Check SDK key
    if (!this.SDK_KEY) {
      console.error('ConfigCat SDK key is not configured');
      this.connectionState.set('disabled');
      return;
    }

    const logger = createConsoleLogger(isDevMode() ? LogLevel.Info : LogLevel.Warn);
    const self = this;

    try {
      this.client = getClient(this.SDK_KEY, PollingMode.AutoPoll, {
        pollIntervalSeconds: this.POLL_INTERVAL_SECONDS,
        logger,
        setupHooks: (hooks) => {
          hooks.on('configChanged', function () {
            // Update signal when config changes
            self.snapshotSignal.set(this.configCatClient.snapshot());
          });

          hooks.on('clientReady', () => {
            self.connectionState.set('ready');
          });

          hooks.on('clientError', (error) => {
            console.error('ConfigCat client error:', error);
            self.connectionState.set('error');
          });
        },
      });
      this.client
        .waitForReady()
        .then(() => {
          if (this.client) {
            this.snapshotSignal.set(this.client.snapshot());
          }
        })
        .catch((error) => {
          console.error('ConfigCat failed to initialize:', error);
          this.connectionState.set('error');
        });
    } catch (error) {
      console.error('ConfigCat initialization failed:', error);
      this.connectionState.set('disabled');
    }
  }

  ngOnDestroy(): void {
    this.client?.dispose();
  }

  setDefaultUser(user: User) {
    if (!this.client) {
      console.warn('Cannot set default user: ConfigCat client not available');
      return;
    }
    this.client.setDefaultUser((this.defaultUser = user));
  }

  clearDefaultUser() {
    if (!this.client) {
      console.warn('Cannot clear default user: ConfigCat client not available');
      return;
    }
    this.client.clearDefaultUser();
    this.defaultUser = undefined;
  }

  isReady() {
    return computed(() => this.connectionState() === 'ready');
  }

  getValue<T extends SettingValue>(key: string, defaultValue: T, user?: User) {
    return computed(() => {
      const snapshot = this.snapshotSignal();
      return snapshot
        ? snapshot.getValue(key, defaultValue, user ?? this.defaultUser)
        : (defaultValue as SettingTypeOf<T>);
    });
  }
}
