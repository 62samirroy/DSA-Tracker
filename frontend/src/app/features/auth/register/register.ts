// src/app/features/auth/register/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Start tracking your DSA journey
          </p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" formControlName="name" 
                class="input-field mt-1" placeholder="John Doe">
              @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                <p class="text-red-500 text-xs mt-1">Name is required</p>
              }
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" formControlName="email" 
                class="input-field mt-1" placeholder="you@example.com">
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="text-red-500 text-xs mt-1">Valid email is required</p>
              }
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" formControlName="password" 
                class="input-field mt-1" placeholder="••••••">
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
              }
            </div>
          </div>

          @if (error()) {
            <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error() }}
            </div>
          }

          <button type="submit" [disabled]="registerForm.invalid || isLoading()"
            class="btn-primary w-full disabled:opacity-50">
            {{ isLoading() ? 'Creating account...' : 'Sign up' }}
          </button>

          <div class="text-center">
            <a routerLink="/auth/login" class="text-primary-600 hover:text-primary-500">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  error = signal<string | null>(null);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      this.authService.register(this.registerForm.value as any).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Registration failed');
          this.isLoading.set(false);
        }
      });
    }
  }
}