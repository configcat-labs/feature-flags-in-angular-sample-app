import { Component } from '@angular/core';
import * as configcat from 'configcat-js';

type VotingMode = 'single' | 'multiple';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'votingPage';
  votingFeatureEnabled: boolean = false;
  votingMode: VotingMode = 'single';
  votes: number[] = [];
  votingClosed: boolean = false;
  countdown: number = 60;

  constructor() {
    const configCatClient = configcat.getClient(
      'configcat-sdk-1/cIXcCIFM50eL1D7-bo-KNw/AoEy1jmHOUCAxu7cBz0ypA'
    );

    configCatClient
      .getValueAsync<boolean>('GrandFeature', false)
      .then((value) => {
        this.votingFeatureEnabled = value;
      });

    this.startCountdown();
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.votingClosed = true;
      }
    }, 1000);
  }

  submitVote(vote: number): void {
    if (vote < 1 || vote > 10) {
      alert('Please enter a vote between 1 and 10.');
      return;
    }

    if (this.votingMode === 'single') {
      this.votes = [vote];
      this.votingClosed = true;
    } else {
      this.votes.push(vote);
    }
  }

  switchVotingMode(mode: VotingMode): void {
    this.votingMode = mode;
    this.votes = [];
    this.votingClosed = false;
  }

  getAverageVote(): string {
    if (this.votes.length === 0) return '0';
    const sum = this.votes.reduce((a, b) => a + b, 0);
    return (sum / this.votes.length).toFixed(2);
  }
}
