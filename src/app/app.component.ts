import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';
import { HomeComponent } from "./components/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  title = 'NectR_Frontend';
  users: any;

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.setCurrentUser();
    this.getUsers();
  }

  setCurrentUser(): void {
    const userJsonString = localStorage.getItem(
      environment.userLocalStorageKey
    );

    if (!userJsonString) {
      return;
    }

    const user = JSON.parse(userJsonString);
    this.authService.loggedInUser.set(user);
  }

  getUsers(): void {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (response) => (this.users = response),
      error: (error) => console.log(error),
      complete: () => console.log('request successfully completed'),
    });
  }
}
