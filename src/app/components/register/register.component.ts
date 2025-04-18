import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IRegister } from '../../interfaces/register.interface';

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

  register(): void {
    console.log(this.registerForm);
  }

  cancel(): void {
    this.cancelRegistration.emit();
  }
}
