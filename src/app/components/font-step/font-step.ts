import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';

@Component({
  selector: 'app-font-step',
  standalone: true,
  imports: [CommonModule, OptionCard],
  templateUrl: './font-step.html',
  styleUrl: './font-step.css'
})


export class FontStep {
  @Input() builderState!: BuilderState;
  @Input() fonts: any[] = []; 
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  updateState(updates: Partial<BuilderState>) {
  this.update.emit(updates);
}
}
