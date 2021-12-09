import { AbstractControl, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
) => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password?.value !== confirmPassword?.value
    ? { passwordMismatch: true }
    : null;
};
