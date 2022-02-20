import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {MatInputModule} from '@angular/material/input';
import {MatInputHarness} from '@angular/material/input/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthError, SignUpErrorCode} from '../auth-error';
import {AuthService} from '../auth.service';
import {SignupComponent} from './signup.component';

const mockAuthService = jasmine.createSpyObj('AuthService', ['createAccount']);

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let loader: HarnessLoader;

  let emailFormField: MatFormFieldHarness;
  let emailInput: MatInputHarness;

  let passwordFormField: MatFormFieldHarness;
  let passwordInput: MatInputHarness;

  let submitButton: MatButtonHarness;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
      ],
      providers: [{provide: AuthService, useValue: mockAuthService}],
      declarations: [SignupComponent],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();

    emailFormField = await loader.getHarness(MatFormFieldHarness.with({selector: '#email'}));
    emailInput = (await emailFormField.getControl(MatInputHarness))!;

    passwordFormField = await loader.getHarness(MatFormFieldHarness.with({selector: '#password'}));
    passwordInput = (await passwordFormField.getControl(MatInputHarness))!;

    submitButton = await loader.getHarness(
      MatButtonHarness.with({selector: 'button[type="submit"]'}),
    );

    form = component.signupForm;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when the form is invalid', async () => {
    expect(form.invalid).toBeTrue();
    expect(await submitButton.isDisabled()).toBeTrue();
  });

  it('should enable the submit button when the form is valid', async () => {
    await emailInput.setValue('test@elvengoods.com');
    await emailInput.blur();

    await passwordInput.setValue('password');
    await passwordInput.blur();

    expect(form.valid).toBeTrue();
    expect(await submitButton.isDisabled()).toBeFalse();
  });

  it('should only validate the email after the user has changed inputs', async () => {
    await emailInput.setValue('bad');

    expect(await emailFormField.hasErrors()).toBeFalse();
    await emailInput.blur();
    expect(await emailFormField.hasErrors()).toBeTrue();
  });

  it('should only require the password after the user has changed inputs', async () => {
    await passwordInput.setValue('');

    expect(await passwordFormField.hasErrors()).toBeFalse();
    await passwordInput.blur();
    expect(await passwordFormField.hasErrors()).toBeTrue();
  });

  it('should require an email address', async () => {
    await emailInput.setValue('');
    await emailInput.blur();

    // Validate the form object
    expect(form.valid).toBeFalse();
    expect(component.email?.errors).toEqual({
      required: true,
    });

    // Validate the DOM
    expect(await emailFormField.hasErrors()).toBeTrue();
  });

  it('should not allow invalid email addresses', async () => {
    await emailInput.setValue('invalid email');
    await emailInput.blur();

    // Validate the form object
    expect(form.valid).toBeFalse();
    expect(component.email?.errors).toEqual({
      email: true,
    });

    // Validate the DOM
    expect(await emailFormField.hasErrors()).toBeTrue();
  });

  it('should allow valid email addresses', async () => {
    await emailInput.setValue('valid@email');
    await emailInput.blur();

    expect(component.email?.valid).toBeTrue();
    expect(await emailFormField.hasErrors()).toBeFalse();
  });

  it('should require a password', async () => {
    await passwordInput.setValue('');
    await passwordInput.blur();

    // Validate the form object
    expect(form.valid).toBeFalse();
    expect(component.password?.errors).toEqual({
      required: true,
    });

    // Validate the DOM
    expect(await passwordFormField.hasErrors()).toBeTrue();
  });

  it('should not allow a password shorter than 6 characters', async () => {
    await passwordInput.setValue('bad');
    await passwordInput.blur();

    expect(component.password?.valid).toBeFalse();
    expect(await passwordFormField.hasErrors()).toBeTrue();
  });

  it('should allow valid passwords', async () => {
    await passwordInput.setValue('password');
    await passwordInput.blur();

    expect(component.password?.valid).toBeTrue();
    expect(await passwordFormField.hasErrors()).toBeFalse();
  });

  it('should show an error about email already taken', async () => {
    const errorCode: AuthError<SignUpErrorCode> = {
      code: 'auth/email-already-in-use',
      message: '',
    };
    mockAuthService.createAccount.and.rejectWith(errorCode);

    await emailInput.setValue('test@elvengoods.com');
    await passwordInput.setValue('password');
    await submitButton.click();

    expect(component.signupError).not.toBe('');
    expect(fixture.debugElement.queryAll(By.css('mat-error:not([hidden])'))).toHaveSize(1);
  });

  it('should create a new account with a valid form', async () => {
    mockAuthService.createAccount.and.resolveTo({});

    await emailInput.setValue('test@elvengoods.com');
    await passwordInput.setValue('password');
    await submitButton.click();

    expect(fixture.debugElement.queryAll(By.css('mat-error[hidden]'))).toHaveSize(1);
    expect(mockAuthService.createAccount).toHaveBeenCalledWith('test@elvengoods.com', 'password');
  });
});
