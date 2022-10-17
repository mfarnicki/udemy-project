import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = '[ShoppingList] ADD_INGREDIENT';
export const ADD_MULTIPLE_INGREDIENTS =
  '[ShoppingList] ADD_MULTIPLE_INGREDIENTS';
export const UPDATE_INGREDIENT = '[ShoppingList] UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = '[ShoppingList] DELETE_INGREDIENT';
export const START_EDIT = '[ShoppingList] START_EDIT';
export const STOP_EDIT = '[ShoppingList] STOP_EDIT';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddMultipleIngredients implements Action {
  readonly type = ADD_MULTIPLE_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class DeleteIngredients implements Action {
  readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;
  constructor(public payload: number) {}
}

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}

export type ShoppingListActions =
  | AddIngredient
  | AddMultipleIngredients
  | UpdateIngredient
  | DeleteIngredients
  | StartEdit
  | StopEdit;
