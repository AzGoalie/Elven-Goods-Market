import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {User} from '@angular/fire/auth';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatToolbarHarness} from '@angular/material/toolbar/testing';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {Subject} from 'rxjs';
import {RouterLinkDirectiveStub} from '../../../testing';
import {AuthService} from '../../auth/auth.service';
import {NavbarComponent} from './navbar.component';

const userSubject = new Subject<User>();
const mockAuthService: Partial<AuthService> = {
  user: userSubject,
  signOut: () => Promise.resolve(),
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let loader: HarnessLoader;

  let toolbar: MatToolbarHarness;

  const getRouterLink = (innerText: string) => {
    return fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub))
      .find(de => de.nativeElement.innerText.trim() === innerText)
      ?.injector.get(RouterLinkDirectiveStub);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatToolbarModule],
      providers: [{provide: AuthService, useValue: mockAuthService}],
      declarations: [NavbarComponent, RouterLinkDirectiveStub],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    toolbar = await loader.getHarness(MatToolbarHarness);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change links when signed in', async () => {
    const signedOutButtons = await loader.getAllHarnesses(MatButtonHarness);
    expect(signedOutButtons).toHaveSize(3);

    userSubject.next({uid: 'test user'} as User);

    const signedInButtons = await loader.getAllHarnesses(MatButtonHarness);
    expect(signedInButtons).toHaveSize(2);
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

  it('should sign the user out', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'signOut');

    userSubject.next({uid: 'test user'} as User);

    const signOutButton = (await loader.getAllHarnesses(MatButtonHarness))[1];
    await signOutButton?.click();
    expect(authService.signOut).toHaveBeenCalled();
  });
});
