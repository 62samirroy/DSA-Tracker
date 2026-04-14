// src/app/features/contests/contests.component.ts
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContestService } from '../../core/services/contest.service';
import { Contest } from '../../core/models/contest.model';
import { IconComponent } from '../../shared/icons/icons.component';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-dark-1">LeetCode Contests</h1>
          <p class="text-dark-5 mt-1">Track your contest performance and compete with your partner</p>
        </div>
        <button (click)="openForm()" class="btn-primary flex items-center gap-2">
          <app-icon name="add" size="20px"></app-icon>
          Add Contest
        </button>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Total Contests</p>
              <p class="text-2xl font-bold text-dark-1">{{ contests().length }}</p>
            </div>
            <app-icon name="contest" size="32px" class="text-dark-4"></app-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Average My Rank</p>
              <p class="text-2xl font-bold text-dark-1">{{ avgMyRank() }}</p>
            </div>
            <span class="text-2xl">🎯</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Average Partner Rank</p>
              <p class="text-2xl font-bold text-dark-1">{{ avgPartnerRank() }}</p>
            </div>
            <span class="text-2xl">👥</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Win Rate</p>
              <p class="text-2xl font-bold text-dark-1">{{ winRate() }}%</p>
            </div>
            <span class="text-2xl">🏆</span>
          </div>
        </div>
      </div>

      <!-- Contest Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let contest of contests()" 
             class="card overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <!-- Contest Header -->
          <div class="bg-gradient-to-r from-dark-1 to-dark-2 p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold text-white">{{ contest.name }}</h3>
                <p class="text-dark-5 text-sm mt-1 flex items-center gap-1">
                  <app-icon name="calendar" size="14px"></app-icon>
                  {{ contest.date | date:'fullDate' }}
                </p>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button (click)="editContest(contest)" 
                        class="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Edit">
                  <app-icon name="edit" size="18px" class="text-white"></app-icon>
                </button>
                <button (click)="deleteContest(contest.id)" 
                        class="p-1 hover:bg-red-500/30 rounded transition-colors"
                        title="Delete">
                  <app-icon name="delete" size="18px" class="text-white"></app-icon>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Contest Stats -->
          <div class="p-4">
            <!-- Ranks -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center p-3 bg-dark-6/20 rounded-xl">
                <p class="text-xs text-dark-5 mb-1">My Rank</p>
                <p class="text-2xl font-bold text-primary-600">
                  #{{ contest.myRank || 'N/A' }}
                </p>
              </div>
              <div class="text-center p-3 bg-dark-6/20 rounded-xl">
                <p class="text-xs text-dark-5 mb-1">Partner Rank</p>
                <p class="text-2xl font-bold text-info">
                  #{{ contest.partnerRank || 'N/A' }}
                </p>
              </div>
            </div>
            
            <!-- Solved Problems -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center">
                <div class="flex items-center justify-center gap-2 mb-1">
                  <app-icon name="check" size="16px" class="text-success"></app-icon>
                  <span class="text-xs text-dark-5">My Solved</span>
                </div>
                <p class="text-lg font-bold text-success">{{ contest.mySolved }}</p>
              </div>
              <div class="text-center">
                <div class="flex items-center justify-center gap-2 mb-1">
                  <app-icon name="users" size="16px" class="text-info"></app-icon>
                  <span class="text-xs text-dark-5">Partner Solved</span>
                </div>
                <p class="text-lg font-bold text-info">{{ contest.partnerSolved }}</p>
              </div>
            </div>
            
            <!-- Performance Indicator -->
            <div *ngIf="getPerformance(contest)" 
                 class="mb-3 p-2 rounded-lg text-center text-xs font-medium"
                 [class]="getPerformanceClass(contest)">
              {{ getPerformance(contest) }}
            </div>
            
            <!-- Notes -->
            <div *ngIf="contest.note" class="mt-3 p-3 bg-dark-6/10 rounded-lg">
              <div class="flex items-start gap-2">
                <app-icon name="note" size="16px" class="text-dark-5 mt-0.5"></app-icon>
                <p class="text-sm text-dark-4">{{ contest.note }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="contests().length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-dark-6/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <app-icon name="contest" size="48px" class="text-dark-4"></app-icon>
        </div>
        <p class="text-dark-5 text-lg">No contests yet</p>
        <p class="text-dark-5 text-sm mt-1">Start tracking your LeetCode contest performance!</p>
        <button (click)="openForm()" class="btn-primary mt-4 inline-flex items-center gap-2">
          <app-icon name="add" size="20px"></app-icon>
          Add Your First Contest
        </button>
      </div>

      <!-- Add/Edit Form Modal -->
      <div *ngIf="showForm()" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-up">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-dark-1">
              {{ editingContest() ? 'Edit Contest' : 'Add New Contest' }}
            </h2>
            <button (click)="closeForm()" class="p-2 hover:bg-dark-6/20 rounded-lg transition-colors">
              <app-icon name="close" size="24px"></app-icon>
            </button>
          </div>
          
          <form [formGroup]="contestForm" (ngSubmit)="saveContest()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Contest Name</label>
                <input type="text" formControlName="name" 
                       class="input-field" 
                       placeholder="e.g., Weekly Contest 384">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Date</label>
                <input type="date" formControlName="date" class="input-field">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">My Rank</label>
                <input type="number" formControlName="myRank" 
                       class="input-field" 
                       placeholder="e.g., 1250">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Partner Rank</label>
                <input type="number" formControlName="partnerRank" 
                       class="input-field" 
                       placeholder="e.g., 890">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">My Solved</label>
                <input type="text" formControlName="mySolved" 
                       class="input-field" 
                       placeholder="e.g., 3/4">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Partner Solved</label>
                <input type="text" formControlName="partnerSolved" 
                       class="input-field" 
                       placeholder="e.g., 2/4">
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Notes</label>
                <textarea formControlName="note" 
                          class="input-field" 
                          rows="3" 
                          placeholder="Any additional notes about the contest..."></textarea>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">
                {{ editingContest() ? 'Update Contest' : 'Create Contest' }}
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
            <h3 class="text-xl font-bold text-dark-1 mb-2">Delete Contest</h3>
            <p class="text-dark-5 mb-6">Are you sure you want to delete this contest? This action cannot be undone.</p>
            <div class="flex gap-3">
              <button (click)="confirmDelete()" class="btn-danger flex-1">Delete</button>
              <button (click)="showDeleteConfirm.set(false)" class="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContestsComponent implements OnInit {
  private contestService = inject(ContestService);
  private fb = inject(FormBuilder);

  contests = signal<Contest[]>([]);
  showForm = signal(false);
  showDeleteConfirm = signal(false);
  editingContest = signal<Contest | null>(null);
  deleteId = signal<string | null>(null);
  isLoading = signal(false);

  // Computed stats
  avgMyRank = computed(() => {
    const ranks = this.contests().filter(c => c.myRank).map(c => c.myRank!);
    if (ranks.length === 0) return 'N/A';
    const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length;
    return Math.round(avg);
  });

  avgPartnerRank = computed(() => {
    const ranks = this.contests().filter(c => c.partnerRank).map(c => c.partnerRank!);
    if (ranks.length === 0) return 'N/A';
    const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length;
    return Math.round(avg);
  });

  winRate = computed(() => {
    const contestsWithRank = this.contests().filter(c => c.myRank && c.partnerRank);
    if (contestsWithRank.length === 0) return 0;
    const wins = contestsWithRank.filter(c => c.myRank! < c.partnerRank!).length;
    return Math.round((wins / contestsWithRank.length) * 100);
  });

  contestForm = this.fb.group({
    name: ['', Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    myRank: [null as number | null],
    partnerRank: [null as number | null],
    mySolved: ['0/4'],
    partnerSolved: ['0/4'],
    note: ['']
  });

  ngOnInit() {
    this.loadContests();
  }

  loadContests() {
    this.isLoading.set(true);
    this.contestService.getAll().subscribe({
      next: (res) => {
        this.contests.set(res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading contests:', err);
        this.isLoading.set(false);
      }
    });
  }

  openForm() {
    this.editingContest.set(null);
    this.contestForm.reset({
      date: new Date().toISOString().split('T')[0],
      mySolved: '0/4',
      partnerSolved: '0/4'
    });
    this.showForm.set(true);
  }

  editContest(contest: Contest) {
    this.editingContest.set(contest);
    this.contestForm.patchValue({
      name: contest.name,
      date: new Date(contest.date).toISOString().split('T')[0],
      myRank: contest.myRank || null,
      partnerRank: contest.partnerRank || null,
      mySolved: contest.mySolved,
      partnerSolved: contest.partnerSolved,
      note: contest.note || ''
    });
    this.showForm.set(true);
  }

  saveContest() {
    if (this.contestForm.valid) {
      const formValue = this.contestForm.value;
      const contestData = {
        name: formValue.name || '',
        date: new Date(formValue.date!),
        myRank: formValue.myRank ? Number(formValue.myRank) : undefined,
        partnerRank: formValue.partnerRank ? Number(formValue.partnerRank) : undefined,
        mySolved: formValue.mySolved || '0/4',
        partnerSolved: formValue.partnerSolved || '0/4',
        note: formValue.note || undefined
      };

      if (this.editingContest()) {
        this.contestService.update(this.editingContest()!.id, contestData).subscribe({
          next: () => {
            this.loadContests();
            this.closeForm();
          },
          error: (err) => console.error('Error updating contest:', err)
        });
      } else {
        this.contestService.create(contestData).subscribe({
          next: () => {
            this.loadContests();
            this.closeForm();
          },
          error: (err) => console.error('Error creating contest:', err)
        });
      }
    }
  }

  deleteContest(id: string) {
    this.deleteId.set(id);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    if (this.deleteId()) {
      this.contestService.delete(this.deleteId()!).subscribe({
        next: () => {
          this.loadContests();
          this.showDeleteConfirm.set(false);
          this.deleteId.set(null);
        },
        error: (err) => console.error('Error deleting contest:', err)
      });
    }
  }

  closeForm() {
    this.showForm.set(false);
    this.editingContest.set(null);
    this.contestForm.reset();
  }

  getPerformance(contest: Contest): string | null {
    if (!contest.myRank || !contest.partnerRank) return null;
    if (contest.myRank < contest.partnerRank) return '🎉 You performed better than your partner!';
    if (contest.myRank > contest.partnerRank) return '📈 Partner performed better. Keep practicing!';
    return '🤝 You and your partner performed equally!';
  }

  getPerformanceClass(contest: Contest): string {
    if (!contest.myRank || !contest.partnerRank) return 'bg-dark-6/20 text-dark-5';
    if (contest.myRank < contest.partnerRank) return 'bg-success/10 text-success';
    if (contest.myRank > contest.partnerRank) return 'bg-warning/10 text-warning';
    return 'bg-info/10 text-info';
  }
}