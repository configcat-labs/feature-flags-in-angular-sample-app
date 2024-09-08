import { Component } from '@angular/core';
import * as configcat from 'configcat-js';
import axios from 'axios';

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
  imageUrl: string | null = null;
  private countdownInterval: any;

  constructor() {
    const configCatClient = configcat.getClient(
      'CONFIGCAT-SDK-KEY'
    );

    configCatClient
      .getValueAsync<boolean>('votingOpen', false)
      .then((value) => {
        this.votingFeatureEnabled = value;
        if (value) {
          this.fetchRandomImage();
        }
      });

    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    clearInterval(this.countdownInterval);
    this.countdown = 60;
    this.votingClosed = false;

    this.countdownInterval = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.votingClosed = true;
      }
    }, 1000);
  }

  async fetchRandomImage(): Promise<void> {
    try {
      const response = await axios.get('https://picsum.photos/200/300');
      this.imageUrl = response.request.responseURL;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

  submitVote(vote: number): void {
    if (vote < 1 || vote > 10) {
      alert('Please enter a vote between 1 and 10.');
      return;
    }

    if (this.votingMode === 'single') {
      this.votes = [vote];
      this.votingClosed = true;
      clearInterval(this.countdownInterval);
    } else {
      this.votes.push(vote);
    }
  }

  switchVotingMode(mode: VotingMode): void {
    this.votingMode = mode;
    this.votes = [];
    this.fetchRandomImage(); // Fetch a new image when switching modes
    this.startCountdown();
  }

  getAverageVote(): string {
    if (this.votes.length === 0) return '0';
    const sum = this.votes.reduce((a, b) => a + b, 0);
    return (sum / this.votes.length).toFixed(2);
  }
}
