// src/app/features/mocks/mocks.component.ts (COMPLETE CORRECTED VERSION)
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockService } from '../../core/services/mock.service';
import { MockSession } from '../../core/models/mock.model';

@Component({
  selector: 'app-mocks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Mock Interviews</h1>
        <button (click)="showForm.set(true)" class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          + Schedule Mock
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let mock of mocks()" class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-semibold text-lg">{{ mock.topic }}</h3>
              <p class="text-sm text-gray-500">{{ mock.date | date }}</p>
            </div>
            <span [class]="getPerfClass(mock.perf)" class="text-xs px-2 py-1 rounded">
              {{ mock.perf || 'Pending' }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <p><strong>Duration:</strong> {{ mock.duration || 'N/A' }} min</p>
            <p><strong>Question I gave:</strong> {{ mock.q1 || 'N/A' }}</p>
            <p><strong>Question I received:</strong> {{ mock.q2 || 'N/A' }}</p>
            <p *ngIf="mock.note"><strong>Note:</strong> {{ mock.note }}</p>
          </div>
          <div class="mt-4 flex gap-2">
            <button (click)="editMock(mock)" class="text-blue-600 text-sm">Edit</button>
            <button (click)="deleteMock(mock.id)" class="text-red-600 text-sm">Delete</button>
          </div>
        </div>
      </div>

      <!-- Form Modal -->
      <div *ngIf="showForm()" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 class="text-xl font-bold mb-4">{{ editingMock() ? 'Edit' : 'Add' }} Mock Interview</h2>
          <form [formGroup]="mockForm" (ngSubmit)="saveMock()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Date</label>
              <input type="date" formControlName="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Topic</label>
              <input type="text" formControlName="topic" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input type="number" formControlName="duration" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Question I Gave</label>
              <textarea formControlName="q1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows="2"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Question I Received</label>
              <textarea formControlName="q2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows="2"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Performance</label>
              <select formControlName="perf" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="ok">OK</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Notes</label>
              <textarea formControlName="note" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows="2"></textarea>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">Save</button>
              <button type="button" (click)="showForm.set(false)" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class MocksComponent implements OnInit {
  private mockService = inject(MockService);
  private fb = inject(FormBuilder);

  mocks = signal<MockSession[]>([]);
  showForm = signal(false);
  editingMock = signal<MockSession | null>(null);

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
      this.mocks.set(res);
    });
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
        this.mockService.update(this.editingMock()!.id, mockData).subscribe(() => {
          this.loadMocks();
          this.showForm.set(false);
          this.editingMock.set(null);
          this.mockForm.reset();
        });
      } else {
        this.mockService.create(mockData).subscribe(() => {
          this.loadMocks();
          this.showForm.set(false);
          this.mockForm.reset();
        });
      }
    }
  }

  deleteMock(id: string) {
    if (confirm('Are you sure you want to delete this mock session?')) {
      this.mockService.delete(id).subscribe(() => {
        this.loadMocks();
      });
    }
  }

  getPerfClass(perf?: string): string {
    switch (perf) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'ok': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}