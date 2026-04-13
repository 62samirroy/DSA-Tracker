// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Check if user is authenticated on app start
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
  }
}