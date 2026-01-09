import { Component, inject, signal } from '@angular/core';
import { ConfigCatService } from './configcat.service';
import { VoteFeature } from './vote-feature/vote-feature';

@Component({
  standalone: true,
  imports: [VoteFeature],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('voting-app');
  private configCatService = inject(ConfigCatService);
  readonly connectionState = this.configCatService.connectionState.asReadonly();

  isVotingFeatureEnabled = this.configCatService.getValue('votingOpen', false);
}
