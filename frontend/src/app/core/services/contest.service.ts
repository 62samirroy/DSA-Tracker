// src/app/core/services/contest.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contest } from '../models/contest.model';

@Injectable({ providedIn: 'root' })
export class ContestService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/contests`;

    getAll(): Observable<Contest[]> {
        return this.http.get<Contest[]>(this.apiUrl);
    }

    create(contest: Partial<Contest>): Observable<Contest> {
        return this.http.post<Contest>(this.apiUrl, contest);
    }

    update(id: string, contest: Partial<Contest>): Observable<Contest> {
        return this.http.put<Contest>(`${this.apiUrl}/${id}`, contest);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}