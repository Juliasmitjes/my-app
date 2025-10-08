import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-title',
  template: `<h3 class="text-2xl font-semibold leading-none tracking-tight {{ className }}"><ng-content></ng-content></h3>`
})
export class CardTitle {
  @Input() className = '';
}
