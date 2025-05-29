import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from './services/spinner.service';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavbarComponent,
    HomeComponent,
    NgxSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  spinnerService = inject(SpinnerService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.setCurrentUser();
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
}
