import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import * as shoppingListActions from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import * as recipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id: number = -1;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(
        map((params) => +params['id']),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState) =>
          recipeState.recipes.find((r, index) => index === this.id)
        )
      )
      .subscribe((recipe) => (this.recipe = recipe || Recipe.NULL));
  }

  addIngredientsToShoppingList() {
    this.store.dispatch(
      new shoppingListActions.AddMultipleIngredients(this.recipe.ingredients)
    );
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new recipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
