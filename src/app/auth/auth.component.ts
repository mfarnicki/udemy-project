import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(loginForm: NgForm) {
    if (!loginForm.valid) {
      return;
    }

    const email = loginForm.value.email;
    const password = loginForm.value.password;
    let logObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      logObservable = this.authService.login(email, password);
    } else {
      logObservable = this.authService.signup(email, password);
    }

    logObservable.subscribe({
      next: (response) => {
        this.error = '';
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (err: Error) => {
        this.error = err.message;
        this.isLoading = false;
      },
    });

    loginForm.reset();
  }
}
