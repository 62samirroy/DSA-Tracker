// src/app/features/dashboard/shell/shell.component.ts
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../app/shared/icons/icons.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, IconComponent],
  template: `
    <div class="flex h-screen bg-dark-bg">
      <!-- Desktop Sidebar -->
      <aside class="hidden md:flex flex-col w-72 bg-dark-card/95 backdrop-blur-sm border-r border-dark-text/20">
        <div class="p-8">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-primary-400">
              DSA Tracker
            </h1>
          </div>
          <p class="text-sm text-light-text/60 mt-2">Welcome back,{{ authService.currentUser()?.name }}</p>
        </div>
        
        <nav class="flex-1 px-4 space-y-2">
          <a *ngFor="let item of navItems" 
             [routerLink]="item.path" 
             routerLinkActive="bg-primary-500/20 text-primary-400 border-l-4 border-primary-500"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-light-text hover:bg-dark-hover transition-all duration-200 cursor-pointer group">
            <app-icon [name]="item.icon" size="20px" class="group-hover:text-primary-400 transition-colors"></app-icon>
            <span class="font-medium">{{ item.label }}</span>
          </a>
        </nav>
        
        <div class="p-4 border-t border-dark-text/20">
          <button (click)="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full group">
            <app-icon name="logout" size="20px"></app-icon>
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Mobile Header -->
        <header class="md:hidden flex items-center justify-between px-4 py-3 bg-dark-card/95 backdrop-blur-sm border-b border-dark-text/20">
          <button (click)="mobileOpen.set(!mobileOpen())" class="p-2 rounded-lg bg-dark-hover">
            <app-icon name="menu" size="24px"></app-icon>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span class="text-sm">📚</span>
            </div>
            <h1 class="font-semibold text-lg">DSA Tracker</h1>
          </div>
          <div class="w-10"></div>
        </header>

        <!-- Mobile Drawer -->
        <div *ngIf="mobileOpen()" class="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div class="w-72 bg-dark-card h-full shadow-2xl animate-slide-in">
            <div class="p-6 border-b border-dark-text/20">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                    <span class="text-xl">📚</span>
                  </div>
                  <h2 class="text-xl font-bold text-primary-400">DSA Tracker</h2>
                </div>
                <button (click)="mobileOpen.set(false)" class="p-1">
                  <app-icon name="close" size="20px"></app-icon>
                </button>
              </div>
              <p class="text-sm text-light-text/60">Logged in as</p>
              <p class="text-base font-semibold text-light-text">{{ authService.currentUser()?.name }}</p>
            </div>
            <nav class="p-4 space-y-2">
              <a *ngFor="let item of navItems" 
                 [routerLink]="item.path" 
                 (click)="mobileOpen.set(false)"
                 class="flex items-center gap-3 px-4 py-3 rounded-xl text-light-text hover:bg-dark-hover transition-all duration-200 cursor-pointer">
                <app-icon [name]="item.icon" size="20px"></app-icon>
                <span>{{ item.label }}</span>
              </a>
              <button (click)="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full mt-4">
                <app-icon name="logout" size="20px"></app-icon>
                <span>Logout</span>
              </button>
            </nav>
          </div>
          <div class="flex-1 bg-black/50" (click)="mobileOpen.set(false)"></div>
        </div>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
          <router-outlet />
        </main>

        <!-- Mobile Bottom Nav -->
        <nav class="md:hidden flex border-t border-dark-text/20 bg-dark-card/95 backdrop-blur-sm">
          <a *ngFor="let item of navItems.slice(0, 4)" 
             [routerLink]="item.path" 
             routerLinkActive="text-primary-400"
             class="flex-1 flex flex-col items-center py-3 text-xs text-light-text/60 hover:text-primary-400 transition-colors">
            <app-icon [name]="item.icon" size="20px"></app-icon>
            <span class="mt-1">{{ item.shortLabel }}</span>
          </a>
        </nav>
      </div>
    </div>
  `
})
export class ShellComponent {
  mobileOpen = signal(false);

  navItems = [
    { path: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: 'dashboard' },
    { path: '/logs', label: 'Study Logs', shortLabel: 'Logs', icon: 'logs' },
    { path: '/roadmap', label: 'Roadmap', shortLabel: 'Plan', icon: 'roadmap' },
    { path: '/mocks', label: 'Mock Interviews', shortLabel: 'Mock', icon: 'mock' },
    { path: '/contests', label: 'Contests', shortLabel: 'Contest', icon: 'contest' },
    { path: '/ai-plan', label: 'AI Plan', shortLabel: 'AI', icon: 'brain' }
  ];

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}