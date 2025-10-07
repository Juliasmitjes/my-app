import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css'
})


export class LayoutStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  selectLayout(layout: 'single' | 'two-column' | 'grid') {
    this.update.emit({ layout });
  }
}
