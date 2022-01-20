import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/auth/auth.service';
import { NavbarComponent } from './navbar.component';

const mockAuthService: Partial<AuthService> = {};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      declarations: [NavbarComponent],
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
});
