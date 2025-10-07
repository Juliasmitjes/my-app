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
  @Input() themes: any[] = []; 
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  selectColorTheme(theme: 'warm' | 'light' | 'dark' | 'cool' ) {
    this.update.emit({ colorTheme: theme });
  }
}
