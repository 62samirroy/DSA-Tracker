// src/app/core/interceptors/jwt.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                // Only logout if it's auth endpoint or confirmed invalid token
                if (req.url.includes('/auth/me')) {
                    authService.clearSession(); // softer than logout
                }
            }
            return throwError(() => error);
        })
    );
};