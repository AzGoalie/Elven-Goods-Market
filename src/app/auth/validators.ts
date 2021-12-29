import { AbstractControl, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
) => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  const error = { passwordMismatch: true };

  if (password?.value !== confirmPassword?.value) {
    confirmPassword?.setErrors(error);
    return error;
  }

  return null;
};
