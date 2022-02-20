import {Directive, HostListener, Input} from '@angular/core';

/* eslint-disable @angular-eslint/directive-class-suffix, @angular-eslint/directive-selector */
@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}
