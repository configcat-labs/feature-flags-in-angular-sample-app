import { Component, OnDestroy, signal, WritableSignal } from '@angular/core';
import axios from 'axios';

type VotingMode = 'single' | 'multiple';

@Component({
  selector: 'app-vote-feature',
  templateUrl: './vote-feature.html',
  styleUrl: './vote-feature.scss',
})
export class VoteFeature implements OnDestroy {
  votingMode: VotingMode = 'single';
  votes: WritableSignal<number[]> = signal([]);
  isVotingClosed = signal(false);
  countdown = signal(60);
  imageUrl = signal('');
  private countdownInterval: any;

  constructor() {
    this.fetchRandomImage().then(() => this.startCountdown());
  }

  startCountdown(): void {
    clearInterval(this.countdownInterval);
    this.countdown.set(60);
    this.isVotingClosed.set(false);

    this.countdownInterval = setInterval(() => {
      this.countdown.update((value) => value - 1);
      if (this.countdown() <= 0) {
        clearInterval(this.countdownInterval);
        this.isVotingClosed.set(true);
      }
    }, 1000);
  }

  async fetchRandomImage(): Promise<void> {
    try {
      const response = await axios.get('https://picsum.photos/200/300');
      this.imageUrl.set(response.request.responseURL);
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
      this.votes.set([vote]);
      this.isVotingClosed.set(true);
      clearInterval(this.countdownInterval);
    } else {
      this.votes.update((v) => [...v, vote]);
    }
  }

  switchVotingMode(mode: VotingMode): void {
    this.votingMode = mode;
    this.votes.set([]);
    this.fetchRandomImage(); // Fetch a new image when switching modes
    this.startCountdown();
  }

  getAverageVote(): string {
    const votes = this.votes();
    if (votes.length === 0) return '0';
    const sum = votes.reduce((a, b) => a + b, 0);
    return (sum / votes.length).toFixed(2);
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }
}
