// src/app/core/services/mock.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MockSession } from '../models/mock.model';

@Injectable({ providedIn: 'root' })
export class MockService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/mocks`;

    getAll(): Observable<MockSession[]> {
        return this.http.get<MockSession[]>(this.apiUrl);
    }

    create(mock: Partial<MockSession>): Observable<MockSession> {
        return this.http.post<MockSession>(this.apiUrl, mock);
    }

    update(id: string, mock: Partial<MockSession>): Observable<MockSession> {
        return this.http.put<MockSession>(`${this.apiUrl}/${id}`, mock);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}