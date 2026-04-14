// src/app/features/roadmap/roadmap.component.ts
import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoadmapService } from '../../core/services/roadmap.service';
import { RoadmapWeek } from '../../core/models/roadmap.model';
import { IconComponent } from '../../shared/icons/icons.component';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-dark-1">Learning Roadmap</h1>
          <p class="text-dark-5 mt-1">Track your DSA learning journey</p>
        </div>
        <button (click)="openForm()" class="btn-primary flex items-center gap-2">
          <app-icon name="add" size="20px"></app-icon>
          Add New Week
        </button>
      </div>

      <!-- Phase Tabs -->
      <div class="card p-2 flex gap-2">
        <button (click)="switchPhase('gfg')" 
                [class]="phase() === 'gfg' ? 'btn-primary' : 'btn-secondary'"
                class="flex-1 py-2 rounded-lg transition-all">
          📚 GFG DSA Course
        </button>
        <button (click)="switchPhase('striver')"
                [class]="phase() === 'striver' ? 'btn-primary' : 'btn-secondary'"
                class="flex-1 py-2 rounded-lg transition-all">
          🚀 Striver A2Z Sheet
        </button>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Total Weeks</p>
              <p class="text-2xl font-bold text-dark-1">{{ roadmap().length }}</p>
            </div>
            <app-icon name="roadmap" size="32px" class="text-dark-4"></app-icon>
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
              <p class="text-sm text-dark-5">Mock Sessions</p>
              <p class="text-2xl font-bold text-dark-1">{{ mockCount() }}</p>
            </div>
            <app-icon name="mock" size="32px" class="text-dark-4"></app-icon>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-dark-5">Completed</p>
              <p class="text-2xl font-bold text-dark-1">{{ completedWeeksCount() }}</p>
            </div>
            <span class="text-2xl">✅</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-dark-1 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-dark-5 mt-2">Loading roadmap...</p>
      </div>

      <!-- Roadmap Cards -->
      <div *ngIf="!isLoading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let week of roadmap()" 
             class="card overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div class="p-4" [style.backgroundColor]="getColor(week.color)">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-semibold px-2 py-1 bg-white/30 rounded">Week {{ week.weekLabel }}</span>
                  <span *ngIf="week.hasMock" class="bg-yellow-400/80 text-xs px-2 py-1 rounded">🎯 Mock Session</span>
                </div>
                <h3 class="text-lg font-bold text-dark-1">{{ week.title }}</h3>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button (click)="editWeek(week)" class="p-1 hover:bg-white/30 rounded transition-colors">
                  <app-icon name="edit" size="18px"></app-icon>
                </button>
                <button (click)="deleteWeek(week.id)" class="p-1 hover:bg-red-500/30 rounded transition-colors">
                  <app-icon name="delete" size="18px"></app-icon>
                </button>
              </div>
            </div>
          </div>
          <div class="p-4">
            <p class="text-dark-4 text-sm mb-4">{{ week.description }}</p>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-dark-2">⏱️ {{ week.hours }} hours</span>
                <span class="text-xs text-dark-5">Week {{ week.order }}</span>
              </div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" 
                       [checked]="completedWeeksSet().has(week.id)"
                       (change)="toggleComplete(week.id)"
                       class="w-4 h-4 rounded border-dark-4 text-primary-500 focus:ring-primary-500">
                <span class="text-xs text-dark-5">Complete</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading() && roadmap().length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-dark-6/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <app-icon name="roadmap" size="48px"></app-icon>
        </div>
        <p class="text-dark-5">No roadmap data available for {{ phase() === 'gfg' ? 'GFG' : 'Striver' }} phase. Add your first week!</p>
      </div>

      <!-- Add/Edit Form Modal -->
      <div *ngIf="showForm()" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-up">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-dark-1">{{ editingWeek() ? 'Edit' : 'Add New' }} Roadmap Week</h2>
            <button (click)="closeForm()" class="p-2 hover:bg-dark-6/20 rounded-lg transition-colors">
              <app-icon name="close" size="24px"></app-icon>
            </button>
          </div>
          
          <form [formGroup]="weekForm" (ngSubmit)="saveWeek()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Phase</label>
                <select formControlName="phase" class="input-field">
                  <option value="gfg">GFG DSA Course</option>
                  <option value="striver">Striver A2Z Sheet</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Week Label</label>
                <input type="text" formControlName="weekLabel" class="input-field" placeholder="e.g., 1, 2-3, 4">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Title</label>
                <input type="text" formControlName="title" class="input-field" placeholder="Week title">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-dark-2">Description</label>
                <textarea formControlName="description" class="input-field" rows="3" placeholder="Week description"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Hours</label>
                <input type="number" formControlName="hours" class="input-field" step="0.5">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Order</label>
                <input type="number" formControlName="order" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-dark-2">Color</label>
                <select formControlName="color" class="input-field">
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                </select>
              </div>
              <div class="flex items-center">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" formControlName="hasMock" class="w-4 h-4 rounded border-dark-4">
                  <span class="text-sm text-dark-2">Include Mock Interview</span>
                </label>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">Save Week</button>
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
            <h3 class="text-xl font-bold text-dark-1 mb-2">Confirm Delete</h3>
            <p class="text-dark-5 mb-6">Are you sure you want to delete this week? This action cannot be undone.</p>
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
export class RoadmapComponent {
  private roadmapService = inject(RoadmapService);
  private fb = inject(FormBuilder);

  phase = signal('gfg');
  roadmap = signal<RoadmapWeek[]>([]);
  showForm = signal(false);
  editingWeek = signal<RoadmapWeek | null>(null);
  showDeleteConfirm = signal(false);
  deleteId = signal<string | null>(null);
  completedWeeks = signal<Set<string>>(new Set());
  isLoading = signal(false);

  totalHours = computed(() =>
    this.roadmap().reduce((sum, week) => sum + week.hours, 0)
  );

  mockCount = computed(() =>
    this.roadmap().filter(week => week.hasMock).length
  );

  completedWeeksSet = computed(() => this.completedWeeks());

  completedWeeksCount = computed(() => this.completedWeeks().size);

  completedWeeksTotal = computed(() => this.roadmap().length);

  weekForm = this.fb.group({
    phase: ['gfg', Validators.required],
    weekLabel: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    hours: [4, [Validators.required, Validators.min(0.5)]],
    hasMock: [false],
    color: ['blue'],
    order: [0, Validators.required]
  });

  constructor() {
    effect(() => {
      const currentPhase = this.phase();
      this.loadRoadmap();
      this.loadCompletedWeeks();
    });
  }

  switchPhase(newPhase: string) {
    this.phase.set(newPhase);
  }

  loadRoadmap() {
    this.isLoading.set(true);
    const currentPhase = this.phase();
    console.log('Loading roadmap for phase:', currentPhase);

    this.roadmapService.getAll(currentPhase).subscribe({
      next: (res) => {
        console.log(`Loaded ${res.length} weeks for phase ${currentPhase}`);
        this.roadmap.set(res.sort((a, b) => a.order - b.order));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading roadmap:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadCompletedWeeks() {
    const saved = localStorage.getItem(`completed_weeks_${this.phase()}`);
    if (saved) {
      this.completedWeeks.set(new Set(JSON.parse(saved)));
    } else {
      this.completedWeeks.set(new Set());
    }
  }

  saveCompletedWeeks() {
    localStorage.setItem(
      `completed_weeks_${this.phase()}`,
      JSON.stringify(Array.from(this.completedWeeks()))
    );
  }

  toggleComplete(weekId: string) {
    const newSet = new Set(this.completedWeeks());
    if (newSet.has(weekId)) {
      newSet.delete(weekId);
    } else {
      newSet.add(weekId);
    }
    this.completedWeeks.set(newSet);
    this.saveCompletedWeeks();
  }

  openForm() {
    this.editingWeek.set(null);
    this.weekForm.reset({
      phase: this.phase(),
      weekLabel: '',
      title: '',
      description: '',
      hours: 4,
      hasMock: false,
      color: 'blue',
      order: this.roadmap().length + 1
    });
    this.showForm.set(true);
  }

  editWeek(week: RoadmapWeek) {
    this.editingWeek.set(week);
    this.weekForm.patchValue({
      phase: week.phase,
      weekLabel: week.weekLabel,
      title: week.title,
      description: week.description,
      hours: week.hours,
      hasMock: week.hasMock,
      color: week.color,
      order: week.order
    });
    this.showForm.set(true);
  }

  saveWeek() {
    if (this.weekForm.valid) {
      const formValue = this.weekForm.value;
      const weekData = {
        phase: formValue.phase!,
        weekLabel: formValue.weekLabel!,
        title: formValue.title!,
        description: formValue.description!,
        hours: Number(formValue.hours),
        hasMock: formValue.hasMock || false,
        color: formValue.color!,
        order: Number(formValue.order)
      };

      if (this.editingWeek()) {
        this.roadmapService.update(this.editingWeek()!.id, { id: this.editingWeek()!.id, ...weekData })
          .subscribe(() => {
            this.loadRoadmap();
            this.closeForm();
          });
      } else {
        this.roadmapService.create(weekData).subscribe(() => {
          this.loadRoadmap();
          this.closeForm();
        });
      }
    }
  }

  deleteWeek(id: string) {
    this.deleteId.set(id);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    if (this.deleteId()) {
      this.roadmapService.delete(this.deleteId()!).subscribe(() => {
        this.loadRoadmap();
        this.showDeleteConfirm.set(false);
        this.deleteId.set(null);
      });
    }
  }

  closeForm() {
    this.showForm.set(false);
    this.editingWeek.set(null);
    this.weekForm.reset();
  }

  getColor(color: string): string {
    const colors: Record<string, string> = {
      'blue': '#EFF6FF',
      'green': '#F0FDF4',
      'purple': '#FAF5FF',
      'orange': '#FFF7ED',
      'red': '#FEF2F2'
    };
    return colors[color] || colors['blue'];
  }
}