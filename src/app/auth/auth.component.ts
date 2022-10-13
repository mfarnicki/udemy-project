import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = '';
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost!: PlaceholderDirective;
  private closeSub: Subscription = Subscription.EMPTY;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

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
        this.showErrorAlert(err);
        this.isLoading = false;
      },
    });

    loginForm.reset();
  }

  onHandleError() {
    this.error = '';
  }

  private showErrorAlert(error: Error) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertCmp = hostViewContainerRef.createComponent(AlertComponent);
    alertCmp.instance.message = error.message;
    this.closeSub = alertCmp.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
