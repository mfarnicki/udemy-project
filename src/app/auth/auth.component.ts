import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import * as appReducer from '../store/app.reducer';
import { AuthResponseData, AuthService } from './auth.service';
import * as authActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = '';
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost!: PlaceholderDirective;
  private closeSub: Subscription = Subscription.EMPTY;
  private storeSub: Subscription = Subscription.EMPTY;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<appReducer.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError || '';
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    if (this.storeSub) {
      this.storeSub.unsubscribe();
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

    if (this.isLoginMode) {
      this.store.dispatch(new authActions.LoginStart({ email, password }));
    } else {
      this.store.dispatch(new authActions.SignupStart({ email, password }));
    }

    loginForm.reset();
  }

  onHandleError() {
    this.store.dispatch(new authActions.ClearError());
  }

  private showErrorAlert(errorMessage: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertCmp = hostViewContainerRef.createComponent(AlertComponent);
    alertCmp.instance.message = errorMessage;
    this.closeSub = alertCmp.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
