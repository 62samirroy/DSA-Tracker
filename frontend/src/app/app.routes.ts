// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/shell/shell').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
            }
        ]
    },
    {
        path: 'logs',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/shell/shell').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/logs/logs').then(m => m.LogsComponent)
            }
        ]
    },
    {
        path: 'roadmap',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/shell/shell').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/roadmap/roadmap').then(m => m.RoadmapComponent)
            }
        ]
    },
    {
        path: 'mocks',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/shell/shell').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/mocks/mocks').then(m => m.MocksComponent)
            }
        ]
    },
    {
        path: 'contests',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dashboard/shell/shell').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/contests/contests').then(m => m.ContestsComponent)
            }
        ]
    },
    { path: '**', redirectTo: '/dashboard' }
];