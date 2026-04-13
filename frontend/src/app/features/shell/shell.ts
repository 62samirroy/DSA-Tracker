// src/app/features/dashboard/shell/shell.component.ts
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Desktop Sidebar -->
      <aside class="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div class="p-6">
          <h1 class="text-xl font-bold text-gray-900">DSA Tracker</h1>
          <p class="text-sm text-gray-500 mt-1">Welcome, {{ authService.currentUser()?.name }}</p>
        </div>
        
        <nav class="flex-1 px-4 space-y-2">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-primary-50 text-primary-700"
               class="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
              <span>{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>
        
        <div class="p-4 border-t">
          <button (click)="logout()" class="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Mobile Header -->
        <header class="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
          <button (click)="mobileOpen.set(!mobileOpen())" class="p-2">
            <span class="text-2xl">☰</span>
          </button>
          <h1 class="font-semibold">DSA Tracker</h1>
          <div class="w-8"></div>
        </header>

        <!-- Mobile Drawer -->
        @if (mobileOpen()) {
          <div class="fixed inset-0 z-50 flex md:hidden">
            <div class="w-64 bg-white h-full shadow-xl">
              <div class="p-6 border-b">
                <h2 class="font-bold">DSA Tracker</h2>
                <p class="text-sm text-gray-600">{{ authService.currentUser()?.name }}</p>
              </div>
              <nav class="p-4 space-y-2">
                @for (item of navItems; track item.path) {
                  <a [routerLink]="item.path" (click)="mobileOpen.set(false)"
                     class="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                    {{ item.icon }} {{ item.label }}
                  </a>
                }
                <button (click)="logout()" class="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full">
                  🚪 Logout
                </button>
              </nav>
            </div>
            <div class="flex-1 bg-black/30" (click)="mobileOpen.set(false)"></div>
          </div>
        }

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8">
          <router-outlet />
        </main>

        <!-- Mobile Bottom Nav -->
        <nav class="md:hidden flex border-t bg-white">
          @for (item of navItems.slice(0, 4); track item.path) {
            <a [routerLink]="item.path" routerLinkActive="text-primary-600"
               class="flex-1 flex flex-col items-center py-2 text-xs text-gray-600">
              <span class="text-xl">{{ item.icon }}</span>
              <span>{{ item.shortLabel }}</span>
            </a>
          }
        </nav>
      </div>
    </div>
  `
})
export class ShellComponent {
  mobileOpen = signal(false);

  navItems = [
    { path: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: '📊' },
    { path: '/logs', label: 'Study Logs', shortLabel: 'Logs', icon: '📝' },
    { path: '/roadmap', label: 'Roadmap', shortLabel: 'Plan', icon: '🗺️' },
    { path: '/mocks', label: 'Mock Interviews', shortLabel: 'Mock', icon: '🎯' },
    { path: '/contests', label: 'Contests', shortLabel: 'Contest', icon: '🏆' }
  ];

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}