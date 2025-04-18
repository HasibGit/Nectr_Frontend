import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ILogin, ILoginResponse } from '../../interfaces/login.interface';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authService = inject(AuthService);
  loginForm: ILogin = { username: '', password: '' };

  login(): void {
    this.authService
      .login(this.loginForm)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('Login successful');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
