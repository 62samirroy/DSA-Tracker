// src/app/core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface AuthResponse {
    success?: boolean;
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;

    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);
    isLoading = signal<boolean>(true);

    private tokenKey = 'dsa_tracker_token';
    private userKey = 'dsa_tracker_user';

    constructor() {
        this.loadStoredAuth();
    }

    private loadStoredAuth(): void {
        const token = localStorage.getItem(this.tokenKey);
        const storedUser = localStorage.getItem(this.userKey);

        if (!token) {
            this.isLoading.set(false);
            return;
        }

        // token exists, temporarily consider user authenticated
        this.isAuthenticated.set(true);

        if (storedUser) {
            try {
                this.currentUser.set(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem(this.userKey);
            }
        }

        this.getMe().subscribe({
            next: (user) => {
                this.currentUser.set(user);
                this.isAuthenticated.set(true);
                localStorage.setItem(this.userKey, JSON.stringify(user));
                this.isLoading.set(false);
            },
            error: () => {
                this.clearSession();
                this.isLoading.set(false);
            }
        });
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
            .pipe(tap(res => this.handleAuth(res)));
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
            .pipe(tap(res => this.handleAuth(res)));
    }

    getMe(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/me`);
    }

    logout(): void {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }

    private handleAuth(response: AuthResponse): void {
        if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
            this.currentUser.set(response.user);
            this.isAuthenticated.set(true);
        }
    }

    private clearAuth(): void {
        this.clearSession();
    }
    
    public clearSession(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
    }
}