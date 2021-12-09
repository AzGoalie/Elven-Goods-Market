import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';

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

  get email(): AbstractControl {
    return this.signinForm.controls['email'];
  }

  get password(): AbstractControl {
    return this.signinForm.controls['password'];
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit(): void {}
}
