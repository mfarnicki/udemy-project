import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registers?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimeout: any;

  constructor(private http: HttpClient, private router: Router) {}
  private baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apiKey = 'AIzaSyDd454p5d0GrZ45Pm6faBIFvUIhD_kmzSw';

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.baseUrl}:signUp`,
        { email, password, returnSecureToken: true },
        { params: { key: this.apiKey } }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${this.baseUrl}:signInWithPassword`,
        { email, password, returnSecureToken: true },
        { params: { key: this.apiKey } }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }

    this.tokenExpirationTimeout = null;
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }

    const user = JSON.parse(userData);
    const loadedUser = new User(
      user.email,
      user.id,
      user._token,
      new Date(user._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimeout = setTimeout(
      () => this.logout(),
      expirationDuration
    );
  }

  private handleError(errorResponse: HttpErrorResponse) {
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

    return throwError(() => new Error(errorMessage));
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}