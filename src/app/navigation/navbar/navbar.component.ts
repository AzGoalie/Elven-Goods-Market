import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isOpen = false;

  navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sign Up', path: '/signup' },
    { name: 'Sign In', path: '/signin' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
