import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
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
    private store: Store<appReducer.AppState>,
    private loggingService: LoggingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new authActions.AutoLogin());
    }
    this.loggingService.printLog('Hello from AppComponent');
  }
}
