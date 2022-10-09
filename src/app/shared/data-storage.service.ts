import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private baseUrl =
    'https://udemy-project---angular-default-rtdb.europe-west1.firebasedatabase.app/';
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(`${this.baseUrl}recipes.json`, recipes)
      .subscribe((response) => console.log(response));
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(`${this.baseUrl}recipes.json`).pipe(
      map((recipes) => {
        return recipes.map((r) => {
          return { ...r, ingredients: r.ingredients ? r.ingredients : [] };
        });
      }),
      tap<Recipe[]>((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
