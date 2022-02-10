import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'elven-goods-market';
  isScreenSmall: Observable<boolean>;

  constructor(breakpoints: BreakpointObserver) {
    this.isScreenSmall = breakpoints
      .observe(Breakpoints.XSmall)
      .pipe(map((breakpoint) => breakpoint.matches));
  }
}
