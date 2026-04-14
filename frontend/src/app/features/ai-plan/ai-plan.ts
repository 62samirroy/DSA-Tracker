// frontend/src/app/features/ai-plan/ai-plan.component.ts
import {
  Component, OnInit, inject, signal, computed, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AiPlanService, PracticeTask } from '../../core/services/ai-plan.service';
import { IconComponent } from '../../shared/icons/icons.component';

@Component({
  selector: 'app-ai-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br  py-8 px-4">
      <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">

        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 class="text-3xl font-bold text-dark-9 flex items-center gap-2">
              <app-icon name="brain" size="28px"></app-icon>
              AI Practice Plan
            </h1>
            <p class="text-dark-5 mt-1">
              Intelligent plan generated from your completed study sessions
            </p>
          </div>
          <div class="flex gap-2">
            @if (hasSavedPlan()) {
              <button (click)="loadSaved()"
                class="px-4 py-2 text-sm bg-dark-3 text-dark-5 rounded-lg hover:bg-dark-2 transition-all">
                Load Saved
              </button>
            }
            <button (click)="generate()"
              [disabled]="generating()"
              class="btn-primary flex items-center gap-2">
              @if (generating()) {
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              }
              {{ generating() ? 'Generating...' : hasPlan() ? '🔄 Regenerate' : '✨ Generate Plan' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        @if (error()) {
          <div class="bg-danger/10 border border-danger/20 rounded-xl p-4">
            <div class="flex items-center gap-2 text-danger">
              <app-icon name="alert" size="20px"></app-icon>
              <span class="text-sm">{{ error() }}</span>
            </div>
          </div>
        }

        <!-- Stats Cards -->
        @if (hasPlan()) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="stat-card text-center">
              <div class="text-2xl font-bold text-primary">{{ tasks().length }}</div>
              <div class="text-xs text-dark-5 mt-1">Total Questions</div>
            </div>
            <div class="stat-card text-center">
              <div class="text-2xl font-bold text-success">{{ doneCount() }}</div>
              <div class="text-xs text-dark-5 mt-1">Completed</div>
            </div>
            <div class="stat-card text-center">
              <div class="text-2xl font-bold text-warning">{{ totalMins() }}m</div>
              <div class="text-xs text-dark-5 mt-1">Total Time</div>
            </div>
            <div class="stat-card text-center">
              <div class="text-2xl font-bold text-info">{{ uniqueDays() }}</div>
              <div class="text-xs text-dark-5 mt-1">Days Planned</div>
            </div>
          </div>

          <!-- Save Prompt -->
          @if (!isSaved()) {
            <div class="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div class="flex items-center gap-2">
                <app-icon name="info" size="20px" class="text-primary"></app-icon>
                <span class="text-sm text-dark-5">Plan generated — customize then save to database</span>
              </div>
              <button (click)="savePlan()" [disabled]="saving()" class="btn-primary text-sm">
                {{ saving() ? 'Saving...' : '💾 Save Plan' }}
              </button>
            </div>
          }
        }

        <!-- Add Task Form -->
        @if (showAddForm()) {
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-dark-9">Add Custom Task</h3>
              <button (click)="showAddForm.set(false)" class="text-dark-5 hover:text-dark-9">
                <app-icon name="close" size="20px"></app-icon>
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-dark-5 mb-1">Date</label>
                <input type="date" [(ngModel)]="newTask.date" class="input-field">
              </div>
              <div>
                <label class="block text-sm text-dark-5 mb-1">Topic</label>
                <input type="text" [(ngModel)]="newTask.topic" placeholder="e.g., Graphs" class="input-field">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-dark-5 mb-1">Question</label>
                <input type="text" [(ngModel)]="newTask.question" placeholder="Question name..." class="input-field">
              </div>
              <div>
                <label class="block text-sm text-dark-5 mb-1">Difficulty</label>
                <select [(ngModel)]="newTask.difficulty" class="input-field">
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-dark-5 mb-1">Est. Minutes</label>
                <input type="number" [(ngModel)]="newTask.estimateMins" class="input-field">
              </div>
            </div>
            <div class="flex gap-3 mt-4">
              <button (click)="addTask()" class="btn-primary flex-1">Add Task</button>
              <button (click)="showAddForm.set(false)" class="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        }

        <!-- Day-wise Plan -->
        @for (group of groupedByDate(); track group.date) {
          <div class="card overflow-hidden">
            <!-- Day Header -->
            <div class="bg-gradient-to-r from-dark-card to-dark-hover px-6 py-4 border-b border-dark-3">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                  <div>
                    <div class="text-lg font-semibold text-dark-9">{{ formatDate(group.date) }}</div>
                    <div class="text-xs text-dark-5 mt-0.5">
                      {{ group.tasks.length }} tasks · ~{{ groupMins(group.tasks) }} min total
                    </div>
                  </div>
                  @if (isToday(group.date)) {
                    <span class="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Today</span>
                  }
                  @if (isPast(group.date) && !isToday(group.date)) {
                    <span class="px-2 py-1 bg-dark-3 text-dark-5 text-xs rounded-full">Past</span>
                  }
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-dark-5">{{ groupDone(group.tasks) }}/{{ group.tasks.length }}</span>
                  <div class="w-24 h-1.5 bg-dark-3 rounded-full overflow-hidden">
                    <div class="h-full bg-success rounded-full transition-all"
                      [style.width.%]="groupProgress(group.tasks)"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tasks List -->
            <div class="divide-y divide-dark-3">
              @for (task of group.tasks; track task.id ?? task.question) {
                @if (editingId() === (task.id ?? task.question)) {
                  <!-- Edit Mode -->
                  <div class="px-6 py-4 bg-dark-3/30">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label class="text-xs text-dark-5">Date</label>
                        <input type="date" [(ngModel)]="editTask.date" class="input-field text-sm">
                      </div>
                      <div>
                        <label class="text-xs text-dark-5">Difficulty</label>
                        <select [(ngModel)]="editTask.difficulty" class="input-field text-sm">
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label class="text-xs text-dark-5">Est. Minutes</label>
                        <input type="number" [(ngModel)]="editTask.estimateMins" class="input-field text-sm">
                      </div>
                      <div class="md:col-span-2">
                        <label class="text-xs text-dark-5">Question</label>
                        <input type="text" [(ngModel)]="editTask.question" class="input-field text-sm">
                      </div>
                      <div class="md:col-span-2">
                        <label class="text-xs text-dark-5">Note (optional)</label>
                        <input type="text" [(ngModel)]="editTask.note" class="input-field text-sm" placeholder="Add a note...">
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button (click)="saveEdit(task)" class="btn-primary text-sm px-4">Save</button>
                      <button (click)="editingId.set(null)" class="btn-secondary text-sm px-4">Cancel</button>
                    </div>
                  </div>
                } @else {
                  <!-- View Mode -->
                  <div class="px-6 py-4 flex items-start gap-3 group hover:bg-dark-3/30 transition-all">
                    <input type="checkbox"
                      [checked]="task.done"
                      (change)="toggleDone(task, $event)"
                      class="mt-1 w-5 h-5 rounded border-dark-4 text-primary focus:ring-primary cursor-pointer">
                    
                    <div class="flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-dark-9 font-medium" [class.line-through]="task.done" [class.text-dark-5]="task.done">
                          {{ task.question }}
                        </span>
                        <span class="text-xs px-2 py-0.5 rounded-full" [class]="getDifficultyClass(task.difficulty)">
                          {{ getDifficultyIcon(task.difficulty) }} {{ task.difficulty }}
                        </span>
                        <span class="text-xs text-dark-5">⏱️ {{ task.estimateMins }} min</span>
                      </div>
                      <div class="text-sm text-dark-5 mt-1">{{ task.topic }}</div>
                      @if (task.note) {
                        <div class="text-xs text-dark-5 italic mt-1">📝 {{ task.note }}</div>
                      }
                    </div>

                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a [href]="'https://leetcode.com/problems/' + toLCSlug(task.question)"
                        target="_blank"
                        class="px-2 py-1 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/10">
                        Solve →
                      </a>
                      <button (click)="startEdit(task)"
                        class="px-2 py-1 text-xs text-dark-5 border border-dark-4 rounded-lg hover:bg-dark-3">
                        Edit
                      </button>
                      <button (click)="deleteTask(task)"
                        class="px-2 py-1 text-xs text-danger border border-danger/30 rounded-lg hover:bg-danger/10">
                        Delete
                      </button>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Add Task Button -->
            <div class="px-6 py-3 border-t border-dark-3">
              <button (click)="openAddForDate(group.date)" class="text-sm text-dark-5 hover:text-primary transition-colors flex items-center gap-1">
                <app-icon name="add" size="16px"></app-icon>
                Add task to this day
              </button>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (!hasPlan() && !generating()) {
          <div class="text-center py-20">
            <div class="w-24 h-24 bg-dark-3 rounded-full flex items-center justify-center mx-auto mb-4">
              <app-icon name="brain" size="48px" class="text-dark-5"></app-icon>
            </div>
            <h3 class="text-xl font-semibold text-dark-9 mb-2">No Plan Generated Yet</h3>
            <p class="text-dark-5 mb-6">
              Log some study sessions first, then click Generate Plan.<br>
              The AI will create a personalized practice schedule for you.
            </p>
            <button (click)="generate()" class="btn-primary">✨ Generate Your First Plan</button>
          </div>
        }

        <!-- Loading State -->
        @if (generating()) {
          <div class="text-center py-20">
            <div class="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-dark-5">AI is analyzing your study history...</p>
          </div>
        }

        <!-- Floating Add Button -->
        @if (hasPlan() && !showAddForm()) {
          <button (click)="showAddForm.set(true)"
            class="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full shadow-lg
                   flex items-center justify-center hover:scale-110 transition-transform">
            <app-icon name="add" size="28px" class="text-dark-1"></app-icon>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AiPlanComponent implements OnInit {
  private svc = inject(AiPlanService);
  private destroyRef = inject(DestroyRef);

  tasks = signal<PracticeTask[]>([]);
  generating = signal(false);
  saving = signal(false);
  isSaved = signal(false);
  hasSavedPlan = signal(false);
  error = signal('');
  editingId = signal<string | null>(null);
  showAddForm = signal(false);

  editTask: Partial<PracticeTask> = {};
  newTask: Partial<PracticeTask> = {
    difficulty: 'medium',
    estimateMins: 30,
    date: new Date().toISOString().split('T')[0],
  };

  hasPlan = computed(() => this.tasks().length > 0);
  doneCount = computed(() => this.tasks().filter(t => t.done).length);
  totalMins = computed(() => this.tasks().reduce((s, t) => s + t.estimateMins, 0));
  uniqueDays = computed(() => new Set(this.tasks().map(t => t.date.split('T')[0])).size);

  groupedByDate = computed(() => {
    const map = new Map<string, PracticeTask[]>();
    for (const t of this.tasks()) {
      const d = t.date.split('T')[0];
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(t);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, tasks]) => ({ date, tasks: tasks.sort((a, b) => a.order - b.order) }));
  });

  ngOnInit() {
    this.loadSaved();
  }

  loadSaved() {
    this.svc.getSaved().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (plan: any) => {
        if (plan && plan.tasks) {
          this.hasSavedPlan.set(true);
          this.tasks.set(plan.tasks);
          this.isSaved.set(true);
        }
      },
      error: () => { }
    });
  }

  generate() {
    this.generating.set(true);
    this.error.set('');
    this.isSaved.set(false);

    this.svc.generate().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (plan: any) => {
        this.tasks.set(plan.tasks);
        this.generating.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to generate plan');
        this.generating.set(false);
      }
    });
  }

  savePlan() {
    this.saving.set(true);
    this.svc.save(this.tasks()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.isSaved.set(true);
        this.hasSavedPlan.set(true);
      },
      error: () => this.saving.set(false)
    });
  }

  toggleDone(task: PracticeTask, event: Event) {
    const done = (event.target as HTMLInputElement).checked;
    this.tasks.update(ts => ts.map(t =>
      (t.id ?? t.question) === (task.id ?? task.question) ? { ...t, done } : t
    ));
    if (task.id) {
      this.svc.updateTask(task.id, { done }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  startEdit(task: PracticeTask) {
    this.editingId.set(task.id ?? task.question);
    this.editTask = { ...task, date: task.date.split('T')[0] };
  }

  saveEdit(task: PracticeTask) {
    const updatedTask = { ...task, ...this.editTask, date: new Date(this.editTask.date!).toISOString() };
    this.tasks.update(ts => ts.map(t =>
      (t.id ?? t.question) === (task.id ?? task.question) ? updatedTask : t
    ));
    if (task.id) {
      this.svc.updateTask(task.id, {
        date: new Date(this.editTask.date!).toISOString(),
        question: this.editTask.question,
        difficulty: this.editTask.difficulty,
        estimateMins: this.editTask.estimateMins,
        note: this.editTask.note
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
    this.editingId.set(null);
  }

  deleteTask(task: PracticeTask) {
    if (!confirm(`Delete "${task.question}"?`)) return;
    this.tasks.update(ts => ts.filter(t => (t.id ?? t.question) !== (task.id ?? task.question)));
    if (task.id) {
      this.svc.deleteTask(task.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  openAddForDate(date: string) {
    this.newTask = { ...this.newTask, date };
    this.showAddForm.set(true);
  }

  addTask() {
    if (!this.newTask.question || !this.newTask.date) return;
    const task: PracticeTask = {
      date: new Date(this.newTask.date!).toISOString(),
      topic: this.newTask.topic || 'Custom',
      question: this.newTask.question!,
      difficulty: (this.newTask.difficulty as any) || 'medium',
      estimateMins: this.newTask.estimateMins || 30,
      done: false,
      order: this.tasks().length,
    };
    this.tasks.update(ts => [...ts, task]);
    if (this.isSaved()) {
      this.svc.addTask(task).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((saved: any) => {
        this.tasks.update(ts => ts.map(t =>
          t.question === task.question && !t.id ? { ...t, id: saved.id } : t
        ));
      });
    }
    this.showAddForm.set(false);
    this.newTask = {
      difficulty: 'medium',
      estimateMins: 30,
      date: new Date().toISOString().split('T')[0],
    };
  }

  groupMins = (tasks: PracticeTask[]) => tasks.reduce((s, t) => s + t.estimateMins, 0);
  groupDone = (tasks: PracticeTask[]) => tasks.filter(t => t.done).length;
  groupProgress = (tasks: PracticeTask[]) => tasks.length ? Math.round((this.groupDone(tasks) / tasks.length) * 100) : 0;

  isToday(dateStr: string) {
    return dateStr === new Date().toISOString().split('T')[0];
  }

  isPast(dateStr: string) {
    return new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  toLCSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  }
}