// frontend/src/app/core/services/ai-plan.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

export interface PracticeTask {
    id?: string;
    date: string;
    topic: string;
    question: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimateMins: number;
    done: boolean;
    note?: string;
    order: number;
}

export interface GeneratedPlan {
    tasks: PracticeTask[];
    totalDays: number;
    totalTasks: number;
}

@Injectable({ providedIn: 'root' })
export class AiPlanService {
    private http = inject(HttpClient);
    private base = `${environment.apiUrl}/ai-plan`;

    generate() {
        return this.http.get<GeneratedPlan>(`${this.base}/generate`);
    }

    save(tasks: PracticeTask[]) {
        return this.http.post(`${this.base}/save`, { tasks });
    }

    getSaved() {
        return this.http.get<any>(`${this.base}/saved`);
    }

    updateTask(id: string, data: any) {
        return this.http.patch(`${this.base}/task/${id}`, data);
    }

    deleteTask(id: string) {
        return this.http.delete(`${this.base}/task/${id}`);
    }

    addTask(task: Partial<PracticeTask>) {
        return this.http.post<PracticeTask>(`${this.base}/task`, task);
    }
}