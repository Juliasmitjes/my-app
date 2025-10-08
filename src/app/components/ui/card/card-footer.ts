import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  template: `<div class="flex items-center p-6 pt-0 {{ className }}"><ng-content></ng-content></div>`
})
export class CardFooter {
  @Input() className = '';
}
