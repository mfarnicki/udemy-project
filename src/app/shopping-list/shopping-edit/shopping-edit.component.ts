import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from 'src/app/shared/shopping-list.service';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {}

  onAddIngredient(name: string, amount: number) {
    this.shoppingListService.addIngredient(new Ingredient(name, amount));
  }
}
