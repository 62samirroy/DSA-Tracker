// src/app/features/auth/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/icons/icons.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, CommonModule, IconComponent],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-1 to-dark-2 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div class="text-center">
          <div class="mx-auto w-16 h-16 bg-dark-1 rounded-2xl flex items-center justify-center mb-4">
            <span class="text-3xl">📚</span>
          </div>
          <h2 class="text-3xl font-extrabold text-dark-1">
            DSA Tracker
          </h2>
          <p class="mt-2 text-sm text-dark-5">
            Sign in to track your progress
          </p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-dark-2 mb-2">Email</label>
              <input type="email" formControlName="email" 
                class="input-field" placeholder="you@example.com">
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                   class="text-danger text-xs mt-1">
                Valid email is required
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-2 mb-2">Password</label>
              <input type="password" formControlName="password" 
                class="input-field" placeholder="••••••">
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                   class="text-danger text-xs mt-1">
                Password is required
              </div>
            </div>
          </div>

          <div *ngIf="error()" class="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl">
            {{ error() }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading()"
            class="btn-primary w-full disabled:opacity-50">
            {{ isLoading() ? 'Signing in...' : 'Sign in' }}
          </button>

          <div class="text-center">
            <a routerLink="/auth/register" class="text-dark-4 hover:text-dark-1 transition-colors">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = signal(false);
    error = signal<string | null>(null);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            this.error.set(null);

            this.authService.login(this.loginForm.value as any).subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Login failed');
                    this.isLoading.set(false);
                }
            });
        }
    }
}