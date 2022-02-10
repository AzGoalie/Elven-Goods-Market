import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { User } from '@angular/fire/auth';
import { MatListModule } from '@angular/material/list';
import { MatNavListHarness } from '@angular/material/list/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { RouterLinkDirectiveStub } from '../../../testing';
import { AuthService } from '../../auth/auth.service';
import { SidenavComponent } from './sidenav.component';

const userSubject = new Subject<User>();
const mockAuthService: Partial<AuthService> = {
  user: userSubject,
  signOut: () => Promise.resolve(),
};

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let loader: HarnessLoader;

  let navList: MatNavListHarness;

  const getRouterLink = (innerText: string) => {
    return fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub))
      .find((de) => de.nativeElement.innerText.trim() === innerText)
      ?.injector.get(RouterLinkDirectiveStub);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatListModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      declarations: [SidenavComponent, RouterLinkDirectiveStub],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    navList = await loader.getHarness(MatNavListHarness);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change links when signed in', async () => {
    expect(await navList.getItems()).toHaveSize(3);
    userSubject.next({ uid: 'test user' } as User);
    expect(await navList.getItems()).toHaveSize(2);
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

    userSubject.next({ uid: 'test user' } as User);

    const signOutButton = (await navList.getItems())[1];
    await signOutButton?.click();
    expect(authService.signOut).toHaveBeenCalled();
  });
});
