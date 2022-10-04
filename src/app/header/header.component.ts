import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMenuCollapsed: boolean = true;
  @Output() navigateTo: EventEmitter<string> = new EventEmitter<string>();

  onNavigateTo(page: string) {
    this.navigateTo.emit(page);
  }
}
