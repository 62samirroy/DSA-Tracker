// src/app/features/dashboard/dashboard.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../core/services/log.service';
import { MockService } from '../../core/services/mock.service';
import { ContestService } from '../../core/services/contest.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Hours</p>
              <p class="text-2xl font-bold">{{ totalHours() }}</p>
            </div>
            <span class="text-3xl">📚</span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Questions Solved</p>
              <p class="text-2xl font-bold">{{ totalQuestions() }}</p>
            </div>
            <span class="text-3xl">✅</span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Mock Sessions</p>
              <p class="text-2xl font-bold">{{ mockCount() }}</p>
            </div>
            <span class="text-3xl">🎯</span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Contests</p>
              <p class="text-2xl font-bold">{{ contestCount() }}</p>
            </div>
            <span class="text-3xl">🏆</span>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold">Recent Study Logs</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Topic</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Hours</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Questions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (log of recentLogs(); track log.id) {
                <tr>
                  <td class="px-6 py-4 text-sm">{{ log.date | date }}</td>
                  <td class="px-6 py-4 text-sm">{{ log.topic }}</td>
                  <td class="px-6 py-4 text-sm">{{ log.hours }}</td>
                  <td class="px-6 py-4 text-sm">{{ log.questions }}</td>
                </tr>
              }
              @if (recentLogs().length === 0) {
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    No study logs yet. Start tracking your progress!
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
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

  totalHours = computed(() => this.logs().reduce((sum, l) => sum + l.hours, 0));
  totalQuestions = computed(() => this.logs().reduce((sum, l) => sum + l.questions, 0));
  mockCount = computed(() => this.mocks().length);
  contestCount = computed(() => this.contests().length);
  recentLogs = computed(() => this.logs().slice(0, 5));

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.logService.getAll().subscribe(res => this.logs.set(res.logs));
    this.mockService.getAll().subscribe(res => this.mocks.set(res));
    this.contestService.getAll().subscribe(res => this.contests.set(res));
  }
}