import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-description',
  template: `<p class="text-sm text-muted-foreground {{ className }}"><ng-content></ng-content></p>`
})
export class CardDescription {
  @Input() className = '';
}
