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
      'Tomato',
      'A ripe, red tomato',
      'https://bi.im-g.pl/im/03/da/17/z25010179ICR,Kiedy-kupujemy-pomidory--wybierajmy-sztuki-dojrzal.jpg'
    ),
  ];
  constructor() {}

  ngOnInit(): void {}
}
