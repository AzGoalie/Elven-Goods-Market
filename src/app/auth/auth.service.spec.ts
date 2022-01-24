import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

const testUser = {
  email: 'test@elvengoods.com',
  password: 'password',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => {
          const auth = getAuth();
          connectAuthEmulator(auth, 'http://localhost:9099');
          return auth;
        }),
      ],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(async () => {
    await service
      .signIn(testUser.email, testUser.password)
      .then(({ user }) => user.delete())
      .catch(() => {});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new account', async () => {
    await service.createAccount(testUser.email, testUser.password);

    await firstValueFrom(service.user).then((user) =>
      expect(user?.email).toBe(testUser.email)
    );
  });

  it('should sign out', async () => {
    await service
      .createAccount(testUser.email, testUser.password)
      .then(({ user }) => expect(user).toBeTruthy());

    await service.signOut();
    await firstValueFrom(service.user).then((user) => expect(user).toBeNull());
  });
});
