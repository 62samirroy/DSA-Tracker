// src/app/features/roadmap/roadmap.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapService } from '../../core/services/roadmap.service';
import { RoadmapWeek } from '../../core/models/roadmap.model';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Learning Roadmap</h1>
        <div class="flex gap-2">
          <button (click)="phase.set('gfg')" 
                  [class.bg-primary-600]="phase() === 'gfg'"
                  [class.bg-gray-200]="phase() !== 'gfg'"
                  class="px-4 py-2 rounded-lg transition-colors">
            GFG
          </button>
          <button (click)="phase.set('striver')"
                  [class.bg-primary-600]="phase() === 'striver'"
                  [class.bg-gray-200]="phase() !== 'striver'"
                  class="px-4 py-2 rounded-lg transition-colors">
            Striver
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let week of roadmap()" class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-4" [style.backgroundColor]="getColor(week.color)">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm opacity-75">Week {{ week.weekLabel }}</p>
                <h3 class="text-lg font-semibold mt-1">{{ week.title }}</h3>
              </div>
              <span *ngIf="week.hasMock" class="bg-yellow-400 text-xs px-2 py-1 rounded">Mock</span>
            </div>
          </div>
          <div class="p-4">
            <p class="text-gray-600 text-sm mb-4">{{ week.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium">⏱️ {{ week.hours }} hours/week</span>
              <button class="text-primary-600 text-sm">View Details →</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="roadmap().length === 0" class="text-center py-12">
        <p class="text-gray-500">No roadmap data available.</p>
      </div>
    </div>
  `
})
export class RoadmapComponent implements OnInit {
  private roadmapService = inject(RoadmapService);

  phase = signal('gfg');
  roadmap = signal<RoadmapWeek[]>([]);

  ngOnInit() {
    this.loadRoadmap();
  }

  loadRoadmap() {
    this.roadmapService.getAll(this.phase()).subscribe(res => {
      this.roadmap.set(res);
    });
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