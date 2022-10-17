import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import { Ingredient } from './ingredient.model';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  reciepesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  constructor(private store: Store<fromApp.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.reciepesChanged.next(this.recipes.slice());
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(
      new ShoppingListActions.AddMultipleIngredients(ingredients)
    );
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.reciepesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.reciepesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.reciepesChanged.next(this.recipes.slice());
  }
}
