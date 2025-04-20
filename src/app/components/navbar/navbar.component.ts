import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ILogin, ILoginResponse } from '../../interfaces/login.interface';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authService = inject(AuthService);
  loginForm: ILogin = { username: '', password: '' };

  private router = inject(Router);
  private toastr = inject(ToastrService);

  login(): void {
    this.authService
      .login(this.loginForm)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('Login successful');
          this.router.navigateByUrl('/members');
          this.toastr.success('Welcome back!');
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error);
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
