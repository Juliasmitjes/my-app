import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';

@Component({
  selector: 'app-local-business',
  standalone: true,
  templateUrl: './local-business.html',
  imports: []
})
export class LocalBusiness {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;

  @Output() configChange = new EventEmitter<any>();
}
