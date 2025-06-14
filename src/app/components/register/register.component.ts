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
import { DateInputComponent } from '../shared/date-input/date-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent, DateInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  cancelRegistration = output<void>();
  //registerForm: IRegister = { username: '', password: '' };
  registerForm: FormGroup;
  maxDate = new Date();
  validationErrors: string[] | undefined;

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastR = inject(ToastrService);

  ngOnInit(): void {
    this.initializeRegisterForm();

    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
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
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({ dateOfBirth: dob });
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue()).subscribe({
        next: (_) => this.router.navigateByUrl('/members'),
        error: (error) => this.toastR.error(error.error),
      });
    }
  }

  cancel(): void {
    this.cancelRegistration.emit();
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) {
      return;
    }

    return new Date(dob).toISOString().slice(0, 10);
  }
}
