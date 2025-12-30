import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { Portfolio } from '../portfolio/portfolio';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.html',
  imports: [Portfolio]
})
export class Product {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;

  @Output() configChange = new EventEmitter<any>();
}
