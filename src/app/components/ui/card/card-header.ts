import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  template: `<div class="flex flex-col space-y-1.5 p-6 {{ className }}"><ng-content></ng-content></div>`
})
export class CardHeader {
  @Input() className = '';
}
