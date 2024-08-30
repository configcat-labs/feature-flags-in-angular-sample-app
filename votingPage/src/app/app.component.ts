import { Component, OnInit } from '@angular/core';
import * as configcat from 'configcat-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'votingPage';
  votingFeatureEnabled: boolean = false;
  votingMode: string = 'Single Vote'; // Default mode
  countdown: number = 60; // Countdown in seconds
  votes: number[] = []; // Array to store votes
  votingClosed: boolean = false;
  intervalId: any;

  constructor() {
    const configCatClient = configcat.getClient(
      'configcat-sdk-1/cIXcCIFM50eL1D7-bo-KNw/AoEy1jmHOUCAxu7cBz0ypA'
    );

    // Fetch feature flag value
    configCatClient.getValueAsync('GrandFeature', false).then((value) => {
      console.log(value);
      this.votingFeatureEnabled = value;

      // If the feature is enabled, start the countdown timer
      if (this.votingFeatureEnabled) {
        this.startCountdown();
      }
    });
  }

  ngOnInit(): void {}

  startCountdown() {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.votingClosed = true;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  submitVote(vote: number) {
    if (!this.votingClosed) {
      if (this.votingMode === 'Single Vote' && this.votes.length === 0) {
        this.votes.push(vote);
      } else if (this.votingMode === 'Multiple Votes') {
        this.votes.push(vote);
      }
    }
  }

  getAverageVote() {
    const sum = this.votes.reduce((a, b) => a + b, 0);
    return (sum / this.votes.length).toFixed(2);
  }
}
