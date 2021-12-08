import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.signupForm);
  }
}
