import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { environment } from 'src/environments/environment';
import { Recipe } from '../recipe.model';
import * as recipeActions from './recipe.actions';

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipeActions.FETCH_RECIPES),
      switchMap(() =>
        this.http.get<Recipe[]>(`${environment.databaseUrl}recipes.json`)
      ),
      map((recipes) => {
        return recipes.map((r) => {
          return { ...r, ingredients: r.ingredients ? r.ingredients : [] };
        });
      }),
      map((recipes) => new recipeActions.SetRecipes(recipes))
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(recipeActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([, recipeState]) =>
          this.http.put(
            `${environment.databaseUrl}recipes.json`,
            recipeState.recipes
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
