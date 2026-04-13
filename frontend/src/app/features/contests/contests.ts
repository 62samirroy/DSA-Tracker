// src/app/features/contests/contests.component.ts (COMPLETE CORRECTED VERSION)
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContestService } from '../../core/services/contest.service';
import { Contest } from '../../core/models/contest.model';

@Component({
  selector: 'app-contests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">LeetCode Contests</h1>
        <button (click)="showForm.set(true)" class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          + Add Contest
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let contest of contests()" class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-semibold text-lg">{{ contest.name }}</h3>
              <p class="text-sm text-gray-500">{{ contest.date | date }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">My Rank</p>
              <p class="text-xl font-bold">{{ contest.myRank || 'N/A' }}</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded">
              <p class="text-sm text-gray-600">Partner Rank</p>
              <p class="text-xl font-bold">{{ contest.partnerRank || 'N/A' }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center">
              <p class="text-sm text-gray-600">My Solved</p>
              <p class="text-lg font-semibold text-green-600">{{ contest.mySolved }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600">Partner Solved</p>
              <p class="text-lg font-semibold text-blue-600">{{ contest.partnerSolved }}</p>
            </div>
          </div>
          <p *ngIf="contest.note" class="text-sm text-gray-600 mb-4">{{ contest.note }}</p>
          <div class="flex gap-2">
            <button (click)="editContest(contest)" class="text-blue-600 text-sm">Edit</button>
            <button (click)="deleteContest(contest.id)" class="text-red-600 text-sm">Delete</button>
          </div>
        </div>
      </div>

      <!-- Form Modal -->
      <div *ngIf="showForm()" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 class="text-xl font-bold mb-4">{{ editingContest() ? 'Edit' : 'Add' }} Contest</h2>
          <form [formGroup]="contestForm" (ngSubmit)="saveContest()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Contest Name</label>
              <input type="text" formControlName="name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Date</label>
              <input type="date" formControlName="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">My Rank</label>
              <input type="number" formControlName="myRank" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Partner Rank</label>
              <input type="number" formControlName="partnerRank" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">My Solved (e.g., 3/4)</label>
              <input type="text" formControlName="mySolved" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="3/4">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Partner Solved</label>
              <input type="text" formControlName="partnerSolved" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="2/4">
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
export class ContestsComponent implements OnInit {
  private contestService = inject(ContestService);
  private fb = inject(FormBuilder);

  contests = signal<Contest[]>([]);
  showForm = signal(false);
  editingContest = signal<Contest | null>(null);

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
    this.contestService.getAll().subscribe(res => {
      this.contests.set(res);
    });
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
        date: formValue.date || new Date().toISOString().split('T')[0] as any,
        myRank: formValue.myRank ? Number(formValue.myRank) : undefined,
        partnerRank: formValue.partnerRank ? Number(formValue.partnerRank) : undefined,
        mySolved: formValue.mySolved || '0/4',
        partnerSolved: formValue.partnerSolved || '0/4',
        note: formValue.note || undefined
      };

      if (this.editingContest()) {
        this.contestService.update(this.editingContest()!.id, contestData).subscribe(() => {
          this.loadContests();
          this.showForm.set(false);
          this.editingContest.set(null);
          this.contestForm.reset();
        });
      } else {
        this.contestService.create(contestData).subscribe(() => {
          this.loadContests();
          this.showForm.set(false);
          this.contestForm.reset();
        });
      }
    }
  }

  deleteContest(id: string) {
    if (confirm('Are you sure you want to delete this contest?')) {
      this.contestService.delete(id).subscribe(() => {
        this.loadContests();
      });
    }
  }
}