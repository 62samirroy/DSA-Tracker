// src/app/features/logs/logs.component.ts
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../core/services/log.service';
import { StudyLog } from '../../core/models/log.model';
import { IconComponent } from '../../shared/icons/icons.component';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-dark-1">Study Logs</h1>
          <p class="text-dark-5 mt-1">Track your daily learning progress</p>
        </div>
        <button (click)="openForm()" class="btn-primary flex items-center gap-2">
          <app-icon name="add" size="20px"></app-icon>
          Add Study Log
        </button>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Total Sessions</p>
              <p class="text-2xl font-bold text-dark-1">{{ logs().length }}</p>
            </div>
            <app-icon name="logs" size="32px" class="text-dark-4"></app-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Total Hours</p>
              <p class="text-2xl font-bold text-dark-1">{{ totalHours() }}</p>
            </div>
            <app-icon name="trending-up" size="32px" class="text-dark-4"></app-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Questions Solved</p>
              <p class="text-2xl font-bold text-dark-1">{{ totalQuestions() }}</p>
            </div>
            <app-icon name="check" size="32px" class="text-dark-4"></app-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Avg. Hours/Session</p>
              <p class="text-2xl font-bold text-dark-1">{{ avgHours() }}</p>
            </div>
            <span class="text-2xl">⏱️</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card p-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-dark-2 mb-2">Phase</label>
            <select [(ngModel)]="filters.phase" (change)="loadLogs()" class="input-field">
              <option value="">All Phases</option>
              <option value="gfg">📚 GFG DSA Course</option>
              <option value="striver">🚀 Striver A2Z Sheet</option>
              <option value="leetcode">⚡ LeetCode Practice</option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-dark-2 mb-2">Study Mode</label>
            <select [(ngModel)]="filters.person" (change)="loadLogs()" class="input-field">
              <option value="">All Modes</option>
              <option value="Me">👤 Solo Study</option>
              <option value="Joydeep">👥 With Joydeep</option>
              <option value="Both">🤝 Pair Programming</option>
            </select>
          </div>
          <div class="flex items-end">
            <button (click)="resetFilters()" class="btn-secondary flex items-center gap-2">
              <app-icon name="refresh" size="16px"></app-icon>
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-6/10">
              <tr>
                <th class="table-header">Date</th>
                <th class="table-header">Phase</th>
                <th class="table-header">Topic</th>
                <th class="table-header">Study Mode</th>
                <th class="table-header">Hours</th>
                <th class="table-header">Questions</th>
                <th class="table-header">Difficulty</th>
                <th class="table-header">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-6/20">
              <tr *ngFor="let log of logs()" class="hover:bg-dark-6/5 transition-colors group">
                <td class="table-cell">
                  <div class="flex items-center gap-2">
                    <app-icon name="calendar" size="14px" class="text-dark-5"></app-icon>
                    {{ log.date | date:'MMM d, y' }}
                  </div>
                </td>
                <td class="table-cell">
                  <span [class]="getPhaseClass(log.phase)" class="badge">
                    {{ log.phase === 'gfg' ? 'GFG' : log.phase === 'striver' ? 'Striver' : 'LeetCode' }}
                  </span>
                </td>
                <td class="table-cell font-medium text-dark-2">{{ log.topic }}</td>
                <td class="table-cell">
                  <span [class]="getPersonClass(log.person)" class="badge">
                    {{ log.person === 'Me' ? '👤 Solo' : log.person === 'Joydeep' ? '👥 With Joydeep' : '🤝 Pair' }}
                  </span>
                </td>
                <td class="table-cell">
                  <span class="font-semibold text-dark-2">{{ log.hours }}</span>h
                </td>
                <td class="table-cell">
                  <span class="font-semibold text-dark-2">{{ log.questions }}</span>
                  <span class="text-xs text-dark-5"> solved</span>
                </td>
                <td class="table-cell">
                  <span *ngIf="log.difficulty" [class]="getDifficultyClass(log.difficulty)" class="badge">
                    {{ log.difficulty }}
                  </span>
                  <span *ngIf="!log.difficulty" class="text-dark-5 text-sm">—</span>
                </td>
                <td class="table-cell">
                  <div class="flex gap-2">
                    <button (click)="editLog(log)" 
                            class="p-1 text-dark-4 hover:text-primary-500 transition-colors"
                            title="Edit">
                      <app-icon name="edit" size="18px"></app-icon>
                    </button>
                    <button (click)="deleteLog(log.id)" 
                            class="p-1 text-dark-4 hover:text-danger transition-colors"
                            title="Delete">
                      <app-icon name="delete" size="18px"></app-icon>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="logs().length === 0">
                <td colspan="8" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 bg-dark-6/20 rounded-full flex items-center justify-center">
                      <app-icon name="logs" size="32px" class="text-dark-4"></app-icon>
                    </div>
                    <p class="text-dark-5">No study logs found</p>
                    <button (click)="openForm()" class="btn-primary inline-flex items-center gap-2 text-sm">
                      <app-icon name="add" size="16px"></app-icon>
                      Add Your First Log
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Form Modal -->
      <div *ngIf="showForm()" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div class="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-up">
          <div class="flex justify-between items-center mb-3">
            <div>
              <h2 class="text-2xl font-bold text-dark-1">{{ editingLog() ? 'Edit' : 'Add New' }} Study Session</h2>
              <p class="text-dark-5 mt-1">Record your learning progress</p>
            </div>
            <button (click)="closeForm()" class="p-2 hover:bg-dark-6/20 rounded-lg transition-colors">
              <app-icon name="close" size="24px"></app-icon>
            </button>
          </div>
          
          <form [formGroup]="logForm" (ngSubmit)="saveLog()" class="space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Date</label>
                <input type="date" formControlName="date" class="input-field">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Phase</label>
                <select formControlName="phase" class="input-field">
                  <option value="gfg">📚 GFG DSA Course</option>
                  <option value="striver">🚀 Striver A2Z Sheet</option>
                  <option value="leetcode">⚡ LeetCode Practice</option>
                </select>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Topic</label>
                <input type="text" formControlName="topic" 
                       class="input-field" 
                       placeholder="e.g., Arrays, Dynamic Programming, Trees">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Study Mode</label>
                <select formControlName="person" class="input-field">
                  <option value="Me">👤 Solo Study</option>
                  <option value="Joydeep">👥 With Joydeep</option>
                  <option value="Both">🤝 Pair Programming</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Hours Spent</label>
                <input type="number" formControlName="hours" 
                       class="input-field" 
                       step="0.5" 
                       placeholder="e.g., 2.5">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Questions Solved</label>
                <input type="number" formControlName="questions" 
                       class="input-field" 
                       placeholder="Number of problems">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Difficulty Level</label>
                <select formControlName="difficulty" class="input-field">
                  <option value="">Select Difficulty</option>
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Notes</label>
                <textarea formControlName="note" 
                          class="input-field" 
                          rows="3" 
                          placeholder="Add any additional notes, key learnings, or insights..."></textarea>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">
                {{ editingLog() ? 'Update Session' : 'Save Session' }}
              </button>
              <button type="button" (click)="closeForm()" class="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteConfirm()" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div class="text-center">
            <div class="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <app-icon name="delete" size="32px" class="text-danger"></app-icon>
            </div>
            <h3 class="text-xl font-bold text-dark-1 mb-2">Delete Study Log</h3>
            <p class="text-dark-5 mb-6">Are you sure you want to delete this study log? This action cannot be undone.</p>
            <div class="flex gap-3">
              <button (click)="confirmDelete()" class="btn-danger flex-1">Delete</button>
              <button (click)="showDeleteConfirm.set(false)" class="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }
    .animate-scale-up {
      animation: scaleUp 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class LogsComponent implements OnInit {
  private logService = inject(LogService);
  private fb = inject(FormBuilder);

  logs = signal<StudyLog[]>([]);
  showForm = signal(false);
  showDeleteConfirm = signal(false);
  editingLog = signal<StudyLog | null>(null);
  deleteId = signal<string | null>(null);
  filters = { phase: '', person: '' };

  // Computed stats
  totalHours = computed(() => this.logs().reduce((sum, l) => sum + l.hours, 0));
  totalQuestions = computed(() => this.logs().reduce((sum, l) => sum + l.questions, 0));
  avgHours = computed(() => {
    const count = this.logs().length;
    if (count === 0) return '0';
    return (this.totalHours() / count).toFixed(1);
  });

  logForm = this.fb.group({
    date: [new Date().toISOString().split('T')[0], Validators.required],
    phase: ['', Validators.required],
    topic: ['', Validators.required],
    person: ['', Validators.required],
    hours: [0, [Validators.required, Validators.min(0)]],
    questions: [0, [Validators.required, Validators.min(0)]],
    difficulty: [''],
    note: ['']
  });

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.logService.getAll(this.filters).subscribe(res => {
      this.logs.set(res.logs);
    });
  }

  resetFilters() {
    this.filters = { phase: '', person: '' };
    this.loadLogs();
  }

  openForm() {
    this.editingLog.set(null);
    this.logForm.reset({
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      questions: 0,
      difficulty: '',
      note: ''
    });
    this.showForm.set(true);
  }

  editLog(log: StudyLog) {
    this.editingLog.set(log);
    this.logForm.patchValue({
      date: new Date(log.date).toISOString().split('T')[0],
      phase: log.phase,
      topic: log.topic,
      person: log.person,
      hours: log.hours,
      questions: log.questions,
      difficulty: log.difficulty || '',
      note: log.note || ''
    });
    this.showForm.set(true);
  }

  saveLog() {
    if (this.logForm.valid) {
      const formValue = this.logForm.value;
      const logData: Partial<StudyLog> = {
        date: new Date(formValue.date!),
        phase: formValue.phase!,
        topic: formValue.topic!,
        person: formValue.person!,
        hours: Number(formValue.hours),
        questions: Number(formValue.questions),
        difficulty: formValue.difficulty || undefined,
        note: formValue.note || undefined
      };

      if (this.editingLog()) {
        this.logService.update(this.editingLog()!.id, logData).subscribe(() => {
          this.loadLogs();
          this.closeForm();
        });
      } else {
        this.logService.create(logData).subscribe(() => {
          this.loadLogs();
          this.closeForm();
        });
      }
    }
  }

  deleteLog(id: string) {
    this.deleteId.set(id);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    if (this.deleteId()) {
      this.logService.delete(this.deleteId()!).subscribe(() => {
        this.loadLogs();
        this.showDeleteConfirm.set(false);
        this.deleteId.set(null);
      });
    }
  }

  closeForm() {
    this.showForm.set(false);
    this.editingLog.set(null);
    this.logForm.reset();
  }

  getPhaseClass(phase: string): string {
    switch (phase) {
      case 'gfg': return 'bg-blue-500/20 text-blue-600';
      case 'striver': return 'bg-purple-500/20 text-purple-600';
      case 'leetcode': return 'bg-orange-500/20 text-orange-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  }

  getPersonClass(person: string): string {
    switch (person) {
      case 'Me': return 'bg-green-500/20 text-green-600';
      case 'Joydeep': return 'bg-yellow-500/20 text-yellow-600';
      case 'Both': return 'bg-pink-500/20 text-pink-600';
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