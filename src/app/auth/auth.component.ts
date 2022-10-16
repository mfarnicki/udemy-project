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

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<appReducer.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((authState) => {
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
      // logObservable = this.authService.login(email, password);
      this.store.dispatch(new authActions.LoginStart({ email, password }));
    } else {
      logObservable = this.authService.signup(email, password);
    }

    // logObservable.subscribe({
    //   next: (response) => {
    //     this.error = '';
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   error: (err: Error) => {
    //     this.error = err.message;
    //     this.showErrorAlert(err);
    //     this.isLoading = false;
    //   },
    // });

    loginForm.reset();
  }

  onHandleError() {
    this.error = '';
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
