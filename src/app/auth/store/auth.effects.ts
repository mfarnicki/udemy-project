import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';

const baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

const handleAuthResponse = (resData: AuthResponseData) => {
  const expirationDate = new Date(
    new Date().getTime() + +resData.expiresIn * 1000
  );
  return new AuthActions.Login({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate: expirationDate,
  });
};

const handleErrorResponse = (errorResponse: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occured!';
  switch (errorResponse?.error?.error?.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already!';
      break;

    case 'EMAIL_NOT_FOUND':
      errorMessage = 'User does not exist!';
      break;

    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid!';
      break;
  }
  return of(new AuthActions.LoginFail(errorMessage));
};

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registers?: boolean;
}

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            `${baseUrl}:signUp`,
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            },
            { params: { key: environment.authApiKey } }
          )
          .pipe(
            map((resData: AuthResponseData) => handleAuthResponse(resData)),
            catchError((errorResponse) => handleErrorResponse(errorResponse))
          );
      })
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            `${baseUrl}:signInWithPassword`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            },
            { params: { key: environment.authApiKey } }
          )
          .pipe(
            map((resData: AuthResponseData) => handleAuthResponse(resData)),
            catchError((errorResponse) => handleErrorResponse(errorResponse))
          );
      })
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN, AuthActions.LOGOUT),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
