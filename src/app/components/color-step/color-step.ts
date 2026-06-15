import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';

@Component({
  selector: 'app-color-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-step.html',
  styleUrl: './color-step.css'
})
export class ColorStep {
  @Input() builderState!: BuilderState;
  @Input() themes: { id: string; name: string; colors: string[]; gradient?: string; description?: string }[] = [];

  @Output() update = new EventEmitter<Partial<BuilderState>>();

  updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }

  onSelectTheme(id: string) {
    this.update.emit({ colorTheme: id as BuilderState['colorTheme'] });
  }
}
