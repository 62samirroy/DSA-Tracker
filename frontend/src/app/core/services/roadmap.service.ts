// src/app/core/services/roadmap.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { RoadmapWeek } from '../models/roadmap.model';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/roadmap`;

    getAll(phase?: string): Observable<RoadmapWeek[]> {
        const params = phase ? `?phase=${phase}` : '';
        return this.http.get<RoadmapWeek[]>(`${this.apiUrl}${params}`);
    }

    create(week: Partial<RoadmapWeek>): Observable<RoadmapWeek> {
        return this.http.post<RoadmapWeek>(this.apiUrl, week);
    }

    update(id: string, week: Partial<RoadmapWeek>): Observable<RoadmapWeek> {
        return this.http.put<RoadmapWeek>(`${this.apiUrl}/${id}`, week);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}