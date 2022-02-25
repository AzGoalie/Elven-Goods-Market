import {Injectable} from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
@Injectable()
export class AuthService {
  public user: User | null = null;

  constructor(private auth: Auth) {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        this.user = null;
        localStorage.removeItem('user');
      }
    });
  }

  public createAccount(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public signOut(): Promise<void> {
    return signOut(this.auth);
  }

  public isSignedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
