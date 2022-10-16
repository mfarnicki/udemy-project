import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm!: NgForm;
  subscription!: Subscription;
  editedItem: Ingredient | null = null;

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe((state) => {
      if (state.editedIngredient) {
        this.editedItem = state.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      } else {
        this.editedItem = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editedItem) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    this.onClear();
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredients());
    this.onClear();
  }

  onClear() {
    this.editedItem = null;
    this.slForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
