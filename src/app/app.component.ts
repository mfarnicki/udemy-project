import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import * as authActions from './auth/store/auth.actions';
import { LoggingService } from './logging.service';
import * as appReducer from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'udemy-project';

  constructor(
    private authService: AuthService,
    private store: Store<appReducer.AppState>,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new authActions.AutoLogin());
    this.loggingService.printLog('Hello from AppComponent');
  }
}
