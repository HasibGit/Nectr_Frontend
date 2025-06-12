import { Component, inject, OnInit, output } from '@angular/core';
import {
  FormBuilder,
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
import { passwordMatchValidator } from '../../validators/password-match-validator';
import { NgIf } from '@angular/common';
import { TextInputComponent } from '../shared/text-input/text-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  cancelRegistration = output<void>();
  //registerForm: IRegister = { username: '', password: '' };
  registerForm: FormGroup;

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  initializeRegisterForm(): void {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator('password', 'confirmPassword') }
    );
  }

  register(): void {
    this.registerForm.markAllAsTouched();
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
