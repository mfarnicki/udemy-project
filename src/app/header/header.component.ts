import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as authActions from '../auth/store/auth.actions';
import * as recipeActions from '../recipes/store/recipe.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private sub!: Subscription;
  isMenuCollapsed: boolean = true;
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.sub = this.store.select('auth').subscribe((authState) => {
      this.isAuthenticated = !!authState.user;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSaveData() {
    this.store.dispatch(new recipeActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new recipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new authActions.Logout());
  }
}
