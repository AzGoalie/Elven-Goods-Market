import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { updateInput } from 'src/testing';
import { AuthError, SignInErrorCode } from '../auth-error';
import { AuthService } from '../auth.service';
import { SigninComponent } from './signin.component';

const mockAuthService = jasmine.createSpyObj('AuthService', ['signIn']);

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      declarations: [SigninComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = component.signinForm;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when the form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('.form__button'));

    expect(form.invalid).toBeTrue();
    expect(submitButton.properties['disabled']).toBeTrue();
  });

  it('should enable the submit button when the form is valid', () => {
    const emailInput = fixture.debugElement.query(By.css('#email'));
    const passwordInput = fixture.debugElement.query(By.css('#password'));

    updateInput(emailInput, 'test@elvengoods.com');
    updateInput(passwordInput, 'password');

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('.form__button'));
    expect(form.valid).toBeTrue();
    expect(submitButton.properties['disabled']).toBeFalse();
  });

  it('should only validate the email after the user has changed inputs', () => {
    const emailInput = fixture.debugElement.query(By.css('#email'));
    emailInput.nativeElement.value = 'bad';
    blurValidation(emailInput);
  });

  it('should only validate the password after the user has changed inputs', () => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    blurValidation(passwordInput);
  });

  it('should require an email', () => {
    const emailInput = fixture.debugElement.query(By.css('#email'));
    updateInput(emailInput, '');
    fixture.detectChanges();

    // Validate the form object
    expect(form.valid).toBeFalse();
    expect(component.email?.errors).toEqual({
      required: true,
    });

    // Validate the DOM
    const [error] = getErrors();
    expect(error.properties['innerText']).toBe('An email address is required');
  });

  it('should not allow invalid email addresses', () => {
    const emailInput = fixture.debugElement.query(By.css('#email'));
    updateInput(emailInput, 'invalid email');
    fixture.detectChanges();

    // Validate the form object
    expect(form.valid).toBeFalse();
    expect(component.email?.errors).toEqual({
      email: true,
    });

    // Validate the DOM
    const [error] = getErrors();
    expect(error.properties['innerText']).toBe('Please enter a valid email');
  });

  it('should allow valid email addresses', () => {
    const emailInput = fixture.debugElement.query(By.css('#email'));
    updateInput(emailInput, 'valid@email');
    fixture.detectChanges();

    expect(component.email?.valid).toBeTrue();
    expect(getErrors()).toHaveSize(0);
  });

  it('should require a password', () => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    updateInput(passwordInput, '');
    fixture.detectChanges();

    // Validate the form object
    expect(form.valid).toBeFalse();
    expect(component.password?.errors).toEqual({
      required: true,
    });

    // Validate the DOM
    const [error] = getErrors();
    expect(error.properties['innerText']).toBe('A password is required');
  });

  it('should allow valid passwords', () => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    updateInput(passwordInput, 'password');
    fixture.detectChanges();

    expect(component.password?.valid).toBeTrue();
    expect(getErrors()).toHaveSize(0);
  });

  it('should show an error when a email/password combination does not exist', async () => {
    const errorCode: AuthError<SignInErrorCode> = {
      code: 'auth/user-not-found',
      message: '',
    };
    mockAuthService.signIn.and.rejectWith(errorCode);

    const emailInput = fixture.debugElement.query(By.css('#email'));
    const passwordInput = fixture.debugElement.query(By.css('#password'));

    updateInput(emailInput, 'test@elvengoods.com');
    updateInput(passwordInput, 'password');

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('.form__button'));
    submitButton.nativeElement.click();

    await fixture.whenStable().then(() => {
      fixture.detectChanges();

      const [error] = getErrors();
      expect(error.properties['innerText']).toContain(
        'Invalid email / password combination'
      );
    });
  });

  it('should sign in a user with a valid form', async () => {
    mockAuthService.signIn.and.resolveTo({});

    const emailInput = fixture.debugElement.query(By.css('#email'));
    const passwordInput = fixture.debugElement.query(By.css('#password'));

    updateInput(emailInput, 'test@elvengoods.com');
    updateInput(passwordInput, 'password');

    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('.form__button'));
    submitButton.nativeElement.click();

    await fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(getErrors()).toHaveSize(0);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        'test@elvengoods.com',
        'password'
      );
    });
  });

  const getErrors = () => {
    return fixture.debugElement.queryAll(By.css('.form__error'));
  };

  const blurValidation = (debugElement: DebugElement) => {
    debugElement.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(getErrors()).toHaveSize(0);

    debugElement.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(getErrors()).toHaveSize(1);
  };
});
