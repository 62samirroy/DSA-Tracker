// src/app/features/logs/logs.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../core/services/log.service';
import { StudyLog } from '../../core/models/log.model';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './logs.html',
  styleUrl: './logs.css'
})
export class LogsComponent implements OnInit {
  private logService = inject(LogService);
  private fb = inject(FormBuilder);

  logs = signal<StudyLog[]>([]);
  showForm = signal(false);
  editingLog = signal<StudyLog | null>(null);
  filters = { phase: '', person: '' };

  logForm = this.fb.group({
    date: [new Date().toISOString().split('T')[0], Validators.required],
    phase: ['', Validators.required],
    topic: ['', Validators.required],
    person: ['', Validators.required],
    hours: [0, [Validators.required, Validators.min(0)]],
    questions: [0, [Validators.required, Validators.min(0)]],
    difficulty: [''],
    note: ['']
  });

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.logService.getAll(this.filters).subscribe(res => {
      this.logs.set(res.logs);
    });
  }

  editLog(log: StudyLog) {
    this.editingLog.set(log);
    this.logForm.patchValue({
      date: new Date(log.date).toISOString().split('T')[0],
      phase: log.phase,
      topic: log.topic,
      person: log.person,
      hours: log.hours,
      questions: log.questions,
      difficulty: log.difficulty || '',
      note: log.note || ''
    });
    this.showForm.set(true);
  }

  saveLog() {
    if (this.logForm.valid) {
      const formValue = this.logForm.value;
      const logData: Partial<StudyLog> = {
        date: new Date(formValue.date!),
        phase: formValue.phase!,
        topic: formValue.topic!,
        person: formValue.person!,
        hours: Number(formValue.hours),
        questions: Number(formValue.questions),
        difficulty: formValue.difficulty || undefined,
        note: formValue.note || undefined
      };

      if (this.editingLog()) {
        this.logService.update(this.editingLog()!.id, logData).subscribe(() => {
          this.loadLogs();
          this.showForm.set(false);
          this.editingLog.set(null);
          this.logForm.reset({
            date: new Date().toISOString().split('T')[0],
            hours: 0,
            questions: 0
          });
        });
      } else {
        this.logService.create(logData).subscribe(() => {
          this.loadLogs();
          this.showForm.set(false);
          this.logForm.reset({
            date: new Date().toISOString().split('T')[0],
            hours: 0,
            questions: 0
          });
        });
      }
    }
  }

  deleteLog(id: string) {
    if (confirm('Are you sure you want to delete this log?')) {
      this.logService.delete(id).subscribe(() => {
        this.loadLogs();
      });
    }
  }
}