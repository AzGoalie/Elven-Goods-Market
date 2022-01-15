export type SignInErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

export type SignUpErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/weak-password';

export interface AuthError<T extends SignInErrorCode | SignUpErrorCode> {
  code: T;
  message: string;
}
