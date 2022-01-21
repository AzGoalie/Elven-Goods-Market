import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';

@Injectable()
export class AuthService implements OnDestroy {
  private userSubscription: Subscription | undefined;

  public user: Observable<User | null> = EMPTY;

  constructor(private auth: Auth) {
    this.user = authState(this.auth);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  public createAccount(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public signOut(): Promise<void> {
    return signOut(this.auth);
  }
}
