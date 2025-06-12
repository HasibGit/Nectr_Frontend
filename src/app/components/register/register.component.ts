import { Component, inject, OnInit, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IRegister,
  IRegisterResponse,
} from '../../interfaces/register.interface';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  cancelRegistration = output<void>();
  //registerForm: IRegister = { username: '', password: '' };
  registerForm: FormGroup;

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  initializeRegisterForm(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  register(): void {
    console.log(this.registerForm.value);

    // this.authService.register(this.registerForm).subscribe({
    //   next: (response: IRegisterResponse) => {
    //     console.log(response);
    //     this.cancel();
    //   },
    // });
  }

  cancel(): void {
    this.cancelRegistration.emit();
  }
}
