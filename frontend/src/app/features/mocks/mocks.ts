// src/app/features/mocks/mocks.component.ts
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockService } from '../../core/services/mock.service';
import { MockSession } from '../../core/models/mock.model';
import { IconComponent } from '../../shared/icons/icons.component';

@Component({
  selector: 'app-mocks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-dark-1">Mock Interviews</h1>
          <p class="text-dark-5 mt-1">Practice and improve your interview skills</p>
        </div>
        <button (click)="openForm()" class="btn-primary flex items-center gap-2">
          <app-icon name="add" size="20px"></app-icon>
          Schedule Mock
        </button>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Total Sessions</p>
              <p class="text-2xl font-bold text-dark-1">{{ mocks().length }}</p>
            </div>
            <app-icon name="mock" size="32px" class="text-dark-4"></app-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Total Duration</p>
              <p class="text-2xl font-bold text-dark-1">{{ totalDuration() }} min</p>
            </div>
            <app-icon name="trending-up" size="32px" class="text-dark-4"></app-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Performance</p>
              <p class="text-2xl font-bold text-dark-1">{{ avgPerformance() }}</p>
            </div>
            <span class="text-2xl">🎯</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Success Rate</p>
              <p class="text-2xl font-bold text-dark-1">{{ successRate() }}%</p>
            </div>
            <span class="text-2xl">🏆</span>
          </div>
        </div>
      </div>

      <!-- Mock Sessions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let mock of mocks()" 
             class="card overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <!-- Header -->
          <div class="bg-gradient-to-r from-dark-1 to-dark-2 p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-white">{{ mock.topic }}</h3>
                <p class="text-dark-5 text-sm mt-1 flex items-center gap-1">
                  <app-icon name="calendar" size="14px"></app-icon>
                  {{ mock.date | date:'fullDate' }}
                </p>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button (click)="editMock(mock)" 
                        class="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Edit">
                  <app-icon name="edit" size="18px" class="text-white"></app-icon>
                </button>
                <button (click)="deleteMock(mock.id)" 
                        class="p-1 hover:bg-red-500/30 rounded transition-colors"
                        title="Delete">
                  <app-icon name="delete" size="18px" class="text-white"></app-icon>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-4">
            <!-- Performance Badge -->
            <div class="mb-4">
              <span [class]="getPerfClass(mock.perf)" class="badge text-sm px-3 py-1.5">
                {{ getPerformanceIcon(mock.perf) }} {{ mock.perf || 'Pending Review' }}
              </span>
            </div>
            
            <!-- Details -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-sm">
                <app-icon name="clock" size="16px" class="text-dark-5"></app-icon>
                <span class="text-dark-4">Duration:</span>
                <span class="font-medium text-dark-2">{{ mock.duration || 'N/A' }} minutes</span>
              </div>
              
              <div class="flex items-start gap-2 text-sm">
                <app-icon name="question" size="16px" class="text-dark-5 mt-0.5"></app-icon>
                <div>
                  <span class="text-dark-4">Question I gave:</span>
                  <p class="text-dark-2 mt-1">{{ mock.q1 || 'Not recorded' }}</p>
                </div>
              </div>
              
              <div class="flex items-start gap-2 text-sm">
                <app-icon name="answer" size="16px" class="text-dark-5 mt-0.5"></app-icon>
                <div>
                  <span class="text-dark-4">Question I received:</span>
                  <p class="text-dark-2 mt-1">{{ mock.q2 || 'Not recorded' }}</p>
                </div>
              </div>
              
              <div *ngIf="mock.note" class="flex items-start gap-2 text-sm">
                <app-icon name="note" size="16px" class="text-dark-5 mt-0.5"></app-icon>
                <div>
                  <span class="text-dark-4">Note:</span>
                  <p class="text-dark-2 mt-1">{{ mock.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="mocks().length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-dark-6/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <app-icon name="mock" size="48px" class="text-dark-4"></app-icon>
        </div>
        <p class="text-dark-5 text-lg">No mock interviews yet</p>
        <p class="text-dark-5 text-sm mt-1">Schedule your first mock interview session!</p>
        <button (click)="openForm()" class="btn-primary mt-4 inline-flex items-center gap-2">
          <app-icon name="add" size="20px"></app-icon>
          Schedule Your First Mock
        </button>
      </div>

      <!-- Add/Edit Form Modal -->
      <div *ngIf="showForm()" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div class="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-up">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-dark-1">{{ editingMock() ? 'Edit' : 'Schedule New' }} Mock Interview</h2>
              <p class="text-dark-5 mt-1">Record your mock interview details</p>
            </div>
            <button (click)="closeForm()" class="p-2 hover:bg-dark-6/20 rounded-lg transition-colors">
              <app-icon name="close" size="24px"></app-icon>
            </button>
          </div>
          
          <form [formGroup]="mockForm" (ngSubmit)="saveMock()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Date</label>
                <input type="date" formControlName="date" class="input-field">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Topic</label>
                <input type="text" formControlName="topic" 
                       class="input-field" 
                       placeholder="e.g., Dynamic Programming, System Design">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Duration (minutes)</label>
                <input type="number" formControlName="duration" 
                       class="input-field" 
                       placeholder="e.g., 45">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Performance</label>
                <select formControlName="perf" class="input-field">
                  <option value="">Select Performance</option>
                  <option value="excellent">🌟 Excellent - Nailed it!</option>
                  <option value="good">👍 Good - Well done</option>
                  <option value="ok">😐 OK - Need improvement</option>
                  <option value="poor">😞 Poor - Needs work</option>
                </select>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Question I Gave</label>
                <textarea formControlName="q1" 
                          class="input-field" 
                          rows="2" 
                          placeholder="Describe the question you asked your partner..."></textarea>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Question I Received</label>
                <textarea formControlName="q2" 
                          class="input-field" 
                          rows="2" 
                          placeholder="Describe the question your partner asked you..."></textarea>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Notes & Feedback</label>
                <textarea formControlName="note" 
                          class="input-field" 
                          rows="3" 
                          placeholder="Add any additional notes, feedback, or key takeaways..."></textarea>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">
                {{ editingMock() ? 'Update Session' : 'Schedule Session' }}
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
            <h3 class="text-xl font-bold text-dark-1 mb-2">Delete Mock Session</h3>
            <p class="text-dark-5 mb-6">Are you sure you want to delete this mock interview session? This action cannot be undone.</p>
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
export class MocksComponent implements OnInit {
  private mockService = inject(MockService);
  private fb = inject(FormBuilder);

  mocks = signal<MockSession[]>([]);
  showForm = signal(false);
  showDeleteConfirm = signal(false);
  editingMock = signal<MockSession | null>(null);
  deleteId = signal<string | null>(null);

  // Computed stats
  totalDuration = computed(() =>
    this.mocks().reduce((sum, m) => sum + (m.duration || 0), 0)
  );

  avgPerformance = computed(() => {
    const performances = this.mocks().filter(m => m.perf);
    if (performances.length === 0) return 'N/A';
    const scores = performances.map(m => {
      switch (m.perf) {
        case 'excellent': return 90;
        case 'good': return 75;
        case 'ok': return 50;
        case 'poor': return 25;
        default: return 0;
      }
    });
    const avg = scores.reduce((a, b) => a + b, 0 as number) / scores.length;
    return avg >= 75 ? 'Good' : avg >= 50 ? 'Average' : 'Needs Improvement';
  });

  successRate = computed(() => {
    const performances = this.mocks().filter(m => m.perf);
    if (performances.length === 0) return 0;
    const good = performances.filter(m => m.perf === 'excellent' || m.perf === 'good').length;
    return Math.round((good / performances.length) * 100);
  });

  mockForm = this.fb.group({
    date: [new Date().toISOString().split('T')[0], Validators.required],
    topic: ['', Validators.required],
    duration: [null as number | null],
    q1: [''],
    q2: [''],
    perf: [''],
    note: ['']
  });

  ngOnInit() {
    this.loadMocks();
  }

  loadMocks() {
    this.mockService.getAll().subscribe(res => {
      this.mocks.set(res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
  }

  openForm() {
    this.editingMock.set(null);
    this.mockForm.reset({
      date: new Date().toISOString().split('T')[0],
      duration: null,
      q1: '',
      q2: '',
      perf: '',
      note: ''
    });
    this.showForm.set(true);
  }

  editMock(mock: MockSession) {
    this.editingMock.set(mock);
    this.mockForm.patchValue({
      date: new Date(mock.date).toISOString().split('T')[0],
      topic: mock.topic,
      duration: mock.duration || null,
      q1: mock.q1 || '',
      q2: mock.q2 || '',
      perf: mock.perf || '',
      note: mock.note || ''
    });
    this.showForm.set(true);
  }

  saveMock() {
    if (this.mockForm.valid) {
      const formValue = this.mockForm.value;
      const mockData = {
        date: formValue.date ? new Date(formValue.date) : new Date(),
        topic: formValue.topic || '',
        duration: formValue.duration ? Number(formValue.duration) : undefined,
        q1: formValue.q1 || undefined,
        q2: formValue.q2 || undefined,
        perf: formValue.perf || undefined,
        note: formValue.note || undefined
      };

      if (this.editingMock()) {
        this.mockService.update(this.editingMock()!.id, mockData).subscribe({
          next: () => {
            this.loadMocks();
            this.closeForm();
          },
          error: (err) => console.error('Error updating mock:', err)
        });
      } else {
        this.mockService.create(mockData).subscribe({
          next: () => {
            this.loadMocks();
            this.closeForm();
          },
          error: (err) => console.error('Error creating mock:', err)
        });
      }
    }
  }

  deleteMock(id: string) {
    this.deleteId.set(id);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    if (this.deleteId()) {
      this.mockService.delete(this.deleteId()!).subscribe({
        next: () => {
          this.loadMocks();
          this.showDeleteConfirm.set(false);
          this.deleteId.set(null);
        },
        error: (err) => console.error('Error deleting mock:', err)
      });
    }
  }

  closeForm() {
    this.showForm.set(false);
    this.editingMock.set(null);
    this.mockForm.reset();
  }

  getPerfClass(perf?: string): string {
    switch (perf) {
      case 'excellent': return 'bg-success/20 text-success';
      case 'good': return 'bg-info/20 text-info';
      case 'ok': return 'bg-warning/20 text-warning';
      case 'poor': return 'bg-danger/20 text-danger';
      default: return 'bg-dark-6/20 text-dark-5';
    }
  }

  getPerformanceIcon(perf?: string): string {
    switch (perf) {
      case 'excellent': return '🌟';
      case 'good': return '👍';
      case 'ok': return '😐';
      case 'poor': return '😞';
      default: return '⏳';
    }
  }
}