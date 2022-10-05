import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from './ingredient.model';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 3),
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    if (ingredient.name && ingredient.amount > 0) {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.emit(this.ingredients.slice());
    }
  }
}
