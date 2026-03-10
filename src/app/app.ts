import { Component, signal, computed, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  // Tab state
  activeTab = signal<'scoreboard' | 'options'>('scoreboard');

  // Half indicator
  half = signal<1 | 2>(1);

  // Time
  timeSeconds = signal(0);
  timeInput = signal('00:00');
  timerRunning = signal(false);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // Team names
  team1Name = signal('team 1');
  team2Name = signal('team 2');

  // Team colors
  team1Color = signal('#008000');
  team2Color = signal('#cc0000');

  // Team 1 score
  team1Goals = signal(0);
  team1TwoPointers = signal(0);
  team1Points = signal(0);
  team1Total = computed(() => this.team1Goals() * 3 + this.team1TwoPointers() * 2 + this.team1Points());

  // Team 2 score
  team2Goals = signal(0);
  team2TwoPointers = signal(0);
  team2Points = signal(0);
  team2Total = computed(() => this.team2Goals() * 3 + this.team2TwoPointers() * 2 + this.team2Points());

  // Cards
  team1BlackCards = signal(0);
  team1RedCards = signal(0);
  team2BlackCards = signal(0);
  team2RedCards = signal(0);

  // Formatted time display
  timeDisplay = computed(() => {
    const total = this.timeSeconds();
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return this.padTwo(mins) + ':' + this.padTwo(secs);
  });

  // Time background color (red if over 30:00 in 1st half or over 60:00 in 2nd half)
  timeOverrun = computed(() => {
    const secs = this.timeSeconds();
    if (this.half() === 1 && secs >= 1800) return true;
    if (this.half() === 2 && secs >= 3600) return true;
    return false;
  });

  // Score display helpers
  formatScore(goals: number, twoPointers: number, points: number): string {
    return goals + '-' + this.padTwo(twoPointers) + '-' + this.padTwo(points);
  }

  padTwo(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  // Tab switching
  setTab(tab: 'scoreboard' | 'options') {
    this.activeTab.set(tab);
  }

  // Template input handlers
  setTeam1Name(value: string) { this.team1Name.set(value); this.saveState(); }
  setTeam2Name(value: string) { this.team2Name.set(value); this.saveState(); }
  setTeam1Color(value: string) { this.team1Color.set(value); this.saveState(); }
  setTeam2Color(value: string) { this.team2Color.set(value); this.saveState(); }

  // Score adjustments
  adjustGoals(team: 1 | 2, delta: number) {
    if (team === 1) {
      const val = Math.max(0, this.team1Goals() + delta);
      this.team1Goals.set(val);
    } else {
      const val = Math.max(0, this.team2Goals() + delta);
      this.team2Goals.set(val);
    }
    this.saveState();
  }

  adjustTwoPointers(team: 1 | 2, delta: number) {
    if (team === 1) {
      const val = Math.max(0, this.team1TwoPointers() + delta);
      this.team1TwoPointers.set(val);
    } else {
      const val = Math.max(0, this.team2TwoPointers() + delta);
      this.team2TwoPointers.set(val);
    }
    this.saveState();
  }

  adjustPoints(team: 1 | 2, delta: number) {
    if (team === 1) {
      const val = Math.max(0, this.team1Points() + delta);
      this.team1Points.set(val);
    } else {
      const val = Math.max(0, this.team2Points() + delta);
      this.team2Points.set(val);
    }
    this.saveState();
  }

  // Card adjustments
  adjustCard(team: 1 | 2, cardType: 'black' | 'red', delta: number) {
    if (team === 1) {
      if (cardType === 'black') {
        this.team1BlackCards.set(Math.max(0, this.team1BlackCards() + delta));
      } else {
        this.team1RedCards.set(Math.max(0, this.team1RedCards() + delta));
      }
    } else {
      if (cardType === 'black') {
        this.team2BlackCards.set(Math.max(0, this.team2BlackCards() + delta));
      } else {
        this.team2RedCards.set(Math.max(0, this.team2RedCards() + delta));
      }
    }
    this.saveState();
  }

  // Timer controls
  startTimer() {
    if (this.timerRunning()) return;
    // Parse time input if timer was stopped
    const parts = this.timeInput().split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10) || 0;
      const secs = parseInt(parts[1], 10) || 0;
      this.timeSeconds.set(mins * 60 + secs);
    }
    this.timerRunning.set(true);
    this.timerInterval = setInterval(() => {
      this.timeSeconds.update(v => v + 1);
      this.timeInput.set(this.timeDisplay());
    }, 1000);
  }

  stopTimer() {
    this.timerRunning.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.timeSeconds.set(0);
    this.timeInput.set('00:00');
  }

  setFirstHalf() {
    this.stopTimer();
    this.half.set(1);
    this.timeSeconds.set(0);
    this.timeInput.set('00:00');
    this.saveState();
  }

  setSecondHalf() {
    this.stopTimer();
    this.half.set(2);
    this.timeSeconds.set(1800);
    this.timeInput.set('30:00');
    this.saveState();
  }

  // LocalStorage persistence
  private storageKey = 'gaelic-scoreboard-state';

  private saveState() {
    const state = {
      team1Name: this.team1Name(),
      team2Name: this.team2Name(),
      team1Color: this.team1Color(),
      team2Color: this.team2Color(),
      team1Goals: this.team1Goals(),
      team1TwoPointers: this.team1TwoPointers(),
      team1Points: this.team1Points(),
      team2Goals: this.team2Goals(),
      team2TwoPointers: this.team2TwoPointers(),
      team2Points: this.team2Points(),
      team1BlackCards: this.team1BlackCards(),
      team1RedCards: this.team1RedCards(),
      team2BlackCards: this.team2BlackCards(),
      team2RedCards: this.team2RedCards(),
      half: this.half(),
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private loadState() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (s.team1Name !== undefined) this.team1Name.set(s.team1Name);
      if (s.team2Name !== undefined) this.team2Name.set(s.team2Name);
      if (s.team1Color !== undefined) this.team1Color.set(s.team1Color);
      if (s.team2Color !== undefined) this.team2Color.set(s.team2Color);
      if (s.team1Goals !== undefined) this.team1Goals.set(s.team1Goals);
      if (s.team1TwoPointers !== undefined) this.team1TwoPointers.set(s.team1TwoPointers);
      if (s.team1Points !== undefined) this.team1Points.set(s.team1Points);
      if (s.team2Goals !== undefined) this.team2Goals.set(s.team2Goals);
      if (s.team2TwoPointers !== undefined) this.team2TwoPointers.set(s.team2TwoPointers);
      if (s.team2Points !== undefined) this.team2Points.set(s.team2Points);
      if (s.team1BlackCards !== undefined) this.team1BlackCards.set(s.team1BlackCards);
      if (s.team1RedCards !== undefined) this.team1RedCards.set(s.team1RedCards);
      if (s.team2BlackCards !== undefined) this.team2BlackCards.set(s.team2BlackCards);
      if (s.team2RedCards !== undefined) this.team2RedCards.set(s.team2RedCards);
      if (s.half !== undefined) this.half.set(s.half);
    } catch {
      // Ignore corrupt data
    }
  }

  constructor() {
    this.loadState();
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
