import { Component, signal } from '@angular/core';
import * as configcat from '@configcat/sdk/browser';
import axios from 'axios';

type VotingMode = 'single' | 'multiple';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('voting-app');
  isVotingFeatureEnabled = signal(false);
  votingMode: VotingMode = 'single';
  votes: number[] = [];
  isVotingClosed = false;
  countdown = signal(60);
  imageUrl = '';
  private countdownInterval: any;

  constructor() {
    const configCatClient = configcat.getClient('YOUR-CONFIGCAT-SDK-KEY');

    configCatClient.getValueAsync('votingOpen', false).then((value) => {
      this.isVotingFeatureEnabled.set(value);
      if (value) {
        this.fetchRandomImage();
        this.startCountdown();
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    clearInterval(this.countdownInterval);
    this.countdown.set(60);
    this.isVotingClosed = false;

    this.countdownInterval = setInterval(() => {
      this.countdown.update((value) => value - 1);
      if (this.countdown() <= 0) {
        clearInterval(this.countdownInterval);
        this.isVotingClosed = true;
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
      this.isVotingClosed = true;
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
