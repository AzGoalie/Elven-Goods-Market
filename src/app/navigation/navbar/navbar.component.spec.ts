import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '@angular/fire/auth';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { RouterLinkDirectiveStub } from '../../../testing';
import { AuthService } from '../../auth/auth.service';
import { NavbarComponent } from './navbar.component';

const userSubject = new Subject<User>();
const mockAuthService: Partial<AuthService> = {
  user: userSubject,
  signOut: () => Promise.resolve(),
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const getRouterLink = (innerText: string) => {
    return fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub))
      .find((de) => de.nativeElement.innerText.trim() === innerText)
      ?.injector.get(RouterLinkDirectiveStub);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      declarations: [NavbarComponent, RouterLinkDirectiveStub],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change links when signed in', () => {
    fixture.detectChanges();
    const dom: HTMLElement = fixture.nativeElement;
    const navlinks = dom.querySelector('.navbar__items');

    const signedOutLinks = ['Home', 'Sign Up', 'Sign In'];
    expect(navlinks?.childElementCount).toBe(3);
    Array.from(navlinks?.children!).forEach((element) => {
      expect(signedOutLinks).toContain(element.textContent?.trim()!);
    });

    const signedInLinks = ['Home', 'Sign Out'];
    userSubject.next({ uid: 'test user' } as User);
    fixture.detectChanges();
    expect(navlinks?.childElementCount).toBe(2);
    Array.from(navlinks?.children!).forEach((element) => {
      expect(signedInLinks).toContain(element.textContent?.trim()!);
    });
  });

  it('should have a link to the sign up page', () => {
    const routerLink = getRouterLink('Sign Up');
    expect(routerLink?.linkParams).toBe('/signup');
  });

  it('should have a link to the sign in page', () => {
    const routerLink = getRouterLink('Sign In');
    expect(routerLink?.linkParams).toBe('/signin');
  });

  it('should have a link to the home page', () => {
    const routerLink = getRouterLink('Home');
    expect(routerLink?.linkParams).toBe('/');
  });

  it('should sign the user out', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'signOut');

    userSubject.next({ uid: 'test user' } as User);
    fixture.detectChanges();

    const element = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub))
      .find((de) => de.nativeElement.innerText === 'Sign Out');

    element?.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(authService.signOut).toHaveBeenCalled();
  });
});
