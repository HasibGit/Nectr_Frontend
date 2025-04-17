import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ILogin, ILoginResponse } from '../../interfaces/login.interface';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  loginForm: ILogin = { username: '', password: '' };
  isLoggedIn = false;

  login(): void {
    this.authService
      .login(this.loginForm)
      .pipe(take(1))
      .subscribe({
        next: (response: ILoginResponse) => {
          console.log(response);
          this.isLoggedIn = true;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
