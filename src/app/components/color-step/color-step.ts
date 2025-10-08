import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';

@Component({
  selector: 'app-color-step',
  standalone: true,
  imports: [CommonModule, OptionCard],
  templateUrl: './color-step.html',
  styleUrl: './color-step.css'
})


export class ColorStep {
  @Input() builderState!: BuilderState;
  @Input() themes: any[] = []; 
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  selectColorTheme(theme: 'warm' | 'light' | 'dark' | 'cool' ) {
    this.update.emit({ colorTheme: theme });
  }

   updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }
}
