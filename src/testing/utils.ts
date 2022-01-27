import { DebugElement } from '@angular/core';

export const updateInput = (input: DebugElement, value: string): void => {
  input.nativeElement.value = value;
  input.nativeElement.dispatchEvent(new Event('input'));
  input.nativeElement.dispatchEvent(new Event('blur'));
};
