import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() isScreenSmall = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(public authService: AuthService) {}
}
