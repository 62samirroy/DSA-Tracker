// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return toObservable(authService.isLoading).pipe(
        filter((loading) => !loading),
        take(1),
        map(() => {
            return authService.isAuthenticated()
                ? true
                : router.parseUrl('/auth/login');
        })
    );
};