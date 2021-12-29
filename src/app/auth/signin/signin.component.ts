import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  signinForm = this.fb.group({
    email: [''],
    password: [''],
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.signinForm.valid) {
      this.authService.signIn(
        this.signinForm.get('email')?.value,
        this.signinForm.get('password')?.value
      );

      this.router.navigate(['/']);
    }
  }
}
