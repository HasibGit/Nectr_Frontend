import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ILogin } from '../../interfaces/login.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  loginForm: ILogin = { username: '', password: '' };

  login(): void {
    console.log(this.loginForm);
  }
}
