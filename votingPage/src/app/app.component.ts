import { Component } from '@angular/core';
import * as configcat from 'configcat-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'votingPage';
  votingFeatureEnabled: boolean = false;
  votingMode: string = 'single'; // 'single' or 'multiple'
  votes: number[] = [];
  votingClosed: boolean = false;
  countdown: number = 60; // 1 minute countdown

  constructor() {
    const configCatClient = configcat.getClient(
      'configcat-sdk-1/cIXcCIFM50eL1D7-bo-KNw/AoEy1jmHOUCAxu7cBz0ypA'
    );

    configCatClient.getValueAsync('GrandFeature', false).then((value) => {
      console.log(value);

      this.votingFeatureEnabled = value;
    });

    this.startCountdown();
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.votingClosed = true;
      }
    }, 1000);
  }

  submitVote(vote: number) {
    if (vote < 1 || vote > 10) {
      alert('Please enter a vote between 1 and 10.');
      return;
    }

    if (this.votingMode === 'single') {
      this.votes = [vote]; // Only allow one vote in 'single' mode
      this.votingClosed = true; // Disable further voting
    } else {
      this.votes.push(vote);
    }
  }

  switchVotingMode(mode: string) {
    this.votingMode = mode;
    this.votes = []; // Reset votes when mode changes
    this.votingClosed = false; // Re-enable voting
  }

  getAverageVote() {
    if (this.votes.length === 0) return 0;
    const sum = this.votes.reduce((a, b) => a + b, 0);
    return (sum / this.votes.length).toFixed(2);
  }
}
