import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [CommonModule, OptionCard],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css'
})


export class LayoutStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  selectLayout(layout: 'single' | 'two-column' | 'grid') {
    this.update.emit({ layout });
  }

   updateState(newState: Partial<BuilderState>) {
    this.update.emit(newState);
}
}