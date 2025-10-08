import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-content',
  template: `<div class="p-6 pt-0 {{ className }}"><ng-content></ng-content></div>`
})
export class CardContent {
  @Input() className = '';
}
