import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';

@Injectable()
export class AuthService implements OnDestroy {
  private userObservable: Observable<User | null> = EMPTY;
  private userSubscription: Subscription | undefined;

  public user: User | null = null;
  public isAuthenticated = false;

  constructor(private auth: Auth) {
    this.userObservable = authState(this.auth);
    this.userSubscription = this.userObservable.subscribe((u) => {
      this.user = u;
      this.isAuthenticated = !!u;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  public createAccount(email: string, password: string): void {
    createUserWithEmailAndPassword(this.auth, email, password);
  }

  public signIn(email: string, password: string): void {
    signInWithEmailAndPassword(this.auth, email, password);
  }

  public signOut(): void {
    signOut(this.auth);
  }
}
