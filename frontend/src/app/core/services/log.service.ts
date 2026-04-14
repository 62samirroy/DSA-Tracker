// src/app/core/services/log.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudyLog, LogFilters } from '../models/log.model';

@Injectable({ providedIn: 'root' })
export class LogService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/logs`;

    getAll(filters?: LogFilters): Observable<{ logs: StudyLog[]; total: number }> {
        let params = new HttpParams();
        if (filters?.phase) params = params.set('phase', filters.phase);
        if (filters?.person) params = params.set('person', filters.person);
        return this.http.get<{ logs: StudyLog[]; total: number }>(this.apiUrl, { params });
    }

    getById(id: string): Observable<StudyLog> {
        return this.http.get<StudyLog>(`${this.apiUrl}/${id}`);
    }

    create(log: Partial<StudyLog>): Observable<StudyLog> {
        return this.http.post<StudyLog>(this.apiUrl, log);
    }

    update(id: string, log: Partial<StudyLog>): Observable<StudyLog> {
        return this.http.put<StudyLog>(`${this.apiUrl}/${id}`, log);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}