import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from './ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Caesar salad',
      'Fresh, yummy dish',
      'https://www.seriouseats.com/thmb/ugNLQE6hZcoZx0Tzu780h1L3lfc=/3750x3750/smart/filters:no_upscale()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg',
      [new Ingredient('Chicken', 1), new Ingredient('Salad', 1)]
    ),
    new Recipe(
      'Belgian waffle',
      'A sweet, crunchy belgian waffle with syrop',
      'https://tornadoughalli.com/wp-content/uploads/2021/03/BELGIAN-WAFFLE-RECIPE-1-2.jpg',
      [new Ingredient('Milk', 1), new Ingredient('Eggs', 2)]
    ),
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
