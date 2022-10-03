import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'Caesar salad',
      'Fresh, yummy dish',
      'https://www.seriouseats.com/thmb/ugNLQE6hZcoZx0Tzu780h1L3lfc=/3750x3750/smart/filters:no_upscale()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg'
    ),
  ];
  constructor() {}

  ngOnInit(): void {}
}
