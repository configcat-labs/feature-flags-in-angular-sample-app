import { Component, OnDestroy } from '@angular/core';
import * as configcat from 'configcat-js';

type VotingMode = 'single' | 'multiple';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title: string = 'votingPage';
  votingFeatureEnabled: boolean = false;
  votingMode: VotingMode = 'single';
  votes: number[] = [];
  votingClosed: boolean = false;
  countdown: number = 60;
  private countdownInterval: any;

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

  ngOnDestroy(): void {
    // Ensure that the interval is cleared when the component is destroyed
    clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    // Clear any existing interval before starting a new one
    clearInterval(this.countdownInterval);
    this.countdown = 60; // Reset countdown to 60 seconds
    this.votingClosed = false; // Ensure voting is not closed when starting the countdown

    this.countdownInterval = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
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
      clearInterval(this.countdownInterval); // Stop countdown when voting is closed
    } else {
      this.votes.push(vote);
    }
  }

  switchVotingMode(mode: VotingMode): void {
    this.votingMode = mode;
    this.votes = [];
    this.startCountdown(); // Restart countdown when switching modes
  }

  getAverageVote(): string {
    if (this.votes.length === 0) return '0';
    const sum = this.votes.reduce((a, b) => a + b, 0);
    return (sum / this.votes.length).toFixed(2);
  }
}
