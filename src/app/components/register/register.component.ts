import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IRegister,
  IRegisterResponse,
} from '../../interfaces/register.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  cancelRegistration = output<void>();
  registerForm: IRegister = { username: '', password: '' };

  private authService = inject(AuthService);

  register(): void {
    this.authService.register(this.registerForm).subscribe({
      next: (response: IRegisterResponse) => {
        console.log(response);
        this.cancel();
      },
      error: (err) => console.log(err),
    });
  }

  cancel(): void {
    this.cancelRegistration.emit();
  }
}
