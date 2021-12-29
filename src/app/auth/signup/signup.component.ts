import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { confirmPasswordValidator } from '../validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm = this.fb.group(
    {
      email: [''],
      password: [''],
      confirmPassword: [''],
    },
    { validators: confirmPasswordValidator }
  );

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.authService.createAccount(
        this.signupForm.get('email')?.value,
        this.signupForm.get('password')?.value
      );

      this.router.navigate(['/']);
    }
  }
}
