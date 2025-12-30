import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { Editorial } from '../editorial/editorial';

@Component({
  selector: 'app-local-business',
  standalone: true,
  templateUrl: './local-business.html',
  imports: [Editorial]
})
export class LocalBusiness {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;

  @Output() configChange = new EventEmitter<any>();
}
