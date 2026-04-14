// src/app/features/dashboard/dashboard.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogService } from '../../core/services/log.service';
import { MockService } from '../../core/services/mock.service';
import { ContestService } from '../../core/services/contest.service';
import { IconComponent } from '../../shared/icons/icons.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Welcome Section -->
      <div class="card p-6 bg-gradient-to-r from-dark-1 to-dark-2 text-white">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p class="text-dark-5">Here's your DSA learning progress summary</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-dark-5">Today's Date</div>
            <div class="text-lg font-semibold">{{ todayDate | date:'fullDate' }}</div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat-card hover:scale-105 transition-transform cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5 mb-1">Total Hours</p>
              <p class="text-3xl font-bold text-dark-1">{{ totalHours() }}</p>
              <p class="text-xs text-dark-5 mt-2">hours of learning</p>
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <app-icon name="trending-up" size="28px" class="text-primary-500"></app-icon>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-dark-6/30">
            <div class="flex justify-between text-xs">
              <span class="text-dark-5">Weekly Goal: 20h</span>
              <span class="text-primary-500 font-semibold">{{ (totalHours() / 20 * 100) }}%</span>
            </div>
            <div class="w-full bg-dark-6/30 rounded-full h-1.5 mt-2">
              <div class="bg-primary-500 h-1.5 rounded-full" 
                   [style.width]="Math.min(100, (totalHours() / 20 * 100)) + '%'"></div>
            </div>
          </div>
        </div>
        
        <div class="stat-card hover:scale-105 transition-transform cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5 mb-1">Questions Solved</p>
              <p class="text-3xl font-bold text-dark-1">{{ totalQuestions() }}</p>
              <p class="text-xs text-dark-5 mt-2">problems completed</p>
            </div>
            <div class="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <app-icon name="check" size="28px" class="text-success"></app-icon>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-dark-6/30">
            <div class="flex justify-between text-xs">
              <span class="text-dark-5">Easy: {{ easyQuestions() }}</span>
              <span class="text-dark-5">Medium: {{ mediumQuestions() }}</span>
              <span class="text-dark-5">Hard: {{ hardQuestions() }}</span>
            </div>
          </div>
        </div>
        
        <div class="stat-card hover:scale-105 transition-transform cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5 mb-1">Mock Sessions</p>
              <p class="text-3xl font-bold text-dark-1">{{ mockCount() }}</p>
              <p class="text-xs text-dark-5 mt-2">interview practices</p>
            </div>
            <div class="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <app-icon name="mock" size="28px" class="text-warning"></app-icon>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-dark-6/30">
            <div class="flex justify-between text-xs">
              <span class="text-dark-5">Excellent: {{ excellentMocks() }}</span>
              <span class="text-dark-5">Good: {{ goodMocks() }}</span>
            </div>
          </div>
        </div>
        
        <div class="stat-card hover:scale-105 transition-transform cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5 mb-1">Contests</p>
              <p class="text-3xl font-bold text-dark-1">{{ contestCount() }}</p>
              <p class="text-xs text-dark-5 mt-2">LeetCode contests</p>
            </div>
            <div class="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
              <app-icon name="contest" size="28px" class="text-info"></app-icon>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-dark-6/30">
            <div class="flex justify-between text-xs">
              <span class="text-dark-5">Best Rank: #{{ bestRank() }}</span>
              <span class="text-info font-semibold">Win Rate: {{ winRate() }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly Progress -->
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-dark-1">Weekly Progress</h2>
            <span class="text-xs text-dark-5">Last 7 days</span>
          </div>
          <div class="space-y-3">
            <div *ngFor="let day of weeklyProgress()" class="flex items-center gap-3">
              <div class="w-16 text-sm text-dark-5">{{ day.name }}</div>
              <div class="flex-1">
                <div class="h-8 bg-dark-6/20 rounded-lg overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-lg transition-all duration-500"
                       [style.width]="(day.hours / 8 * 100) + '%'"
                       style="min-width: 4px">
                  </div>
                </div>
              </div>
              <div class="w-12 text-sm font-semibold text-dark-2">{{ day.hours }}h</div>
            </div>
          </div>
        </div>

        <!-- Phase Distribution -->
        <div class="card p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-dark-1">Learning Distribution</h2>
            <span class="text-xs text-dark-5">By phase</span>
          </div>
          <div class="space-y-4">
            <div *ngFor="let phase of phaseDistribution()">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-dark-5">{{ phase.name }}</span>
                <span class="font-semibold text-dark-2">{{ phase.hours }}h ({{ phase.percentage }}%)</span>
              </div>
              <div class="w-full bg-dark-6/20 rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-500"
                     [style.width]="phase.percentage + '%'"
                     [style.backgroundColor]="phase.color"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <div class="card overflow-hidden">
        <div class="p-6 border-b border-dark-6/30 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-dark-1">Recent Activity</h2>
            <p class="text-sm text-dark-5 mt-1">Your latest study sessions</p>
          </div>
          <a routerLink="/logs" class="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
            View all
            <app-icon name="arrow-right" size="16px"></app-icon>
          </a>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-6/10">
              <tr>
                <th class="table-header">Date</th>
                <th class="table-header">Topic</th>
                <th class="table-header">Phase</th>
                <th class="table-header">Hours</th>
                <th class="table-header">Questions</th>
                <th class="table-header">Difficulty</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-6/20">
              <tr *ngFor="let log of recentLogs()" class="hover:bg-dark-6/5 transition-colors">
                <td class="table-cell">{{ log.date | date:'MMM d, y' }}</td>
                <td class="table-cell font-medium text-dark-2">{{ log.topic }}</td>
                <td class="table-cell">
                  <span [class]="getPhaseClass(log.phase)" class="badge">
                    {{ log.phase === 'gfg' ? 'GFG' : log.phase === 'striver' ? 'Striver' : 'LeetCode' }}
                  </span>
                </td>
                <td class="table-cell">{{ log.hours }}h</td>
                <td class="table-cell">{{ log.questions }}</td>
                <td class="table-cell">
                  <span *ngIf="log.difficulty" [class]="getDifficultyClass(log.difficulty)" class="badge">
                    {{ log.difficulty }}
                  </span>
                  <span *ngIf="!log.difficulty" class="text-dark-5">-</span>
                </td>
              </tr>
              <tr *ngIf="recentLogs().length === 0">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 bg-dark-6/20 rounded-full flex items-center justify-center">
                      <app-icon name="logs" size="32px" class="text-dark-4"></app-icon>
                    </div>
                    <p class="text-dark-5">No study logs yet</p>
                    <a routerLink="/logs" class="btn-primary inline-flex items-center gap-2 text-sm">
                      <app-icon name="add" size="16px"></app-icon>
                      Add Your First Log
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a routerLink="/logs" class="card p-4 text-center hover:bg-dark-6/10 transition-all group">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <app-icon name="add" size="24px" class="text-primary-500"></app-icon>
          </div>
          <p class="text-sm font-medium text-dark-2">Add Study Log</p>
          <p class="text-xs text-dark-5 mt-1">Track your progress</p>
        </a>
        
        <a routerLink="/mocks" class="card p-4 text-center hover:bg-dark-6/10 transition-all group">
          <div class="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <app-icon name="mock" size="24px" class="text-warning"></app-icon>
          </div>
          <p class="text-sm font-medium text-dark-2">Mock Interview</p>
          <p class="text-xs text-dark-5 mt-1">Practice with partner</p>
        </a>
        
        <a routerLink="/contests" class="card p-4 text-center hover:bg-dark-6/10 transition-all group">
          <div class="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <app-icon name="contest" size="24px" class="text-info"></app-icon>
          </div>
          <p class="text-sm font-medium text-dark-2">Add Contest</p>
          <p class="text-xs text-dark-5 mt-1">Track performance</p>
        </a>
        
        <a routerLink="/roadmap" class="card p-4 text-center hover:bg-dark-6/10 transition-all group">
          <div class="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <app-icon name="roadmap" size="24px" class="text-success"></app-icon>
          </div>
          <p class="text-sm font-medium text-dark-2">View Roadmap</p>
          <p class="text-xs text-dark-5 mt-1">Plan your learning</p>
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private logService = inject(LogService);
  private mockService = inject(MockService);
  private contestService = inject(ContestService);

  logs = signal<any[]>([]);
  mocks = signal<any[]>([]);
  contests = signal<any[]>([]);

  todayDate = new Date();
  Math = Math;

  // Computed stats
  totalHours = computed(() => this.logs().reduce((sum, l) => sum + l.hours, 0));
  totalQuestions = computed(() => this.logs().reduce((sum, l) => sum + l.questions, 0));
  mockCount = computed(() => this.mocks().length);
  contestCount = computed(() => this.contests().length);
  recentLogs = computed(() => this.logs().slice(0, 5));

  easyQuestions = computed(() =>
    this.logs().filter(l => l.difficulty === 'easy').reduce((sum, l) => sum + l.questions, 0)
  );

  mediumQuestions = computed(() =>
    this.logs().filter(l => l.difficulty === 'medium').reduce((sum, l) => sum + l.questions, 0)
  );

  hardQuestions = computed(() =>
    this.logs().filter(l => l.difficulty === 'hard').reduce((sum, l) => sum + l.questions, 0)
  );

  excellentMocks = computed(() =>
    this.mocks().filter(m => m.perf === 'excellent').length
  );

  goodMocks = computed(() =>
    this.mocks().filter(m => m.perf === 'good').length
  );

  bestRank = computed(() => {
    const ranks = this.contests().filter(c => c.myRank).map(c => c.myRank);
    return ranks.length > 0 ? Math.min(...ranks) : 'N/A';
  });

  winRate = computed(() => {
    const contestsWithRank = this.contests().filter(c => c.myRank && c.partnerRank);
    if (contestsWithRank.length === 0) return 0;
    const wins = contestsWithRank.filter(c => c.myRank < c.partnerRank).length;
    return Math.round((wins / contestsWithRank.length) * 100);
  });

  weeklyProgress = computed(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayLogs = this.logs().filter(l => {
        const logDate = new Date(l.date);
        return logDate.toDateString() === date.toDateString();
      });
      const hours = dayLogs.reduce((sum, l) => sum + l.hours, 0);
      last7Days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: hours
      });
    }
    return last7Days;
  });

  phaseDistribution = computed(() => {
    const gfgHours = this.logs().filter(l => l.phase === 'gfg').reduce((sum, l) => sum + l.hours, 0);
    const striverHours = this.logs().filter(l => l.phase === 'striver').reduce((sum, l) => sum + l.hours, 0);
    const leetcodeHours = this.logs().filter(l => l.phase === 'leetcode').reduce((sum, l) => sum + l.hours, 0);
    const total = gfgHours + striverHours + leetcodeHours;

    return [
      { name: 'GFG DSA', hours: gfgHours, percentage: total ? (gfgHours / total * 100) : 0, color: '#3B82F6' },
      { name: 'Striver', hours: striverHours, percentage: total ? (striverHours / total * 100) : 0, color: '#8B5CF6' },
      { name: 'LeetCode', hours: leetcodeHours, percentage: total ? (leetcodeHours / total * 100) : 0, color: '#F59E0B' }
    ];
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.logService.getAll().subscribe(res => {
      this.logs.set(res.logs);
    });
    this.mockService.getAll().subscribe(res => {
      this.mocks.set(res);
    });
    this.contestService.getAll().subscribe(res => {
      this.contests.set(res);
    });
  }

  getPhaseClass(phase: string): string {
    switch (phase) {
      case 'gfg': return 'bg-blue-500/20 text-blue-600';
      case 'striver': return 'bg-purple-500/20 text-purple-600';
      case 'leetcode': return 'bg-orange-500/20 text-orange-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-600';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600';
      case 'hard': return 'bg-red-500/20 text-red-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  }
}