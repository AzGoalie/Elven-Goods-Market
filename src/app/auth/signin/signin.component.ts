import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthError, SignInErrorCode } from '../auth-error';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  signinForm = this.fb.group({
    email: ['', Validators.email],
    password: [''],
  });

  signinError: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  onSubmit(): void {
    this.signinError = '';
    if (this.signinForm.valid) {
      this.authService
        .signIn(this.email?.value, this.password?.value)
        .then((_) => this.router.navigate(['/']))
        .catch(({ code }: AuthError<SignInErrorCode>) => {
          switch (code) {
            case 'auth/invalid-email':
              throw new Error(
                `${code} - should have been covered by Validators.email`
              );
            case 'auth/user-disabled':
              this.signinError = 'Account is disabled, please contact support';
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              this.signinError = 'Invalid email / password combination';
              break;
            default:
              const _exhaustiveCheck: never = code;
              throw new Error(
                `Unhandled case for SignInErrorCode: ${_exhaustiveCheck}`
              );
          }
        });
    }
  }
}
