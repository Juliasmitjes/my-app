import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { CardComponent } from '../ui/card/card';
import { CardHeader } from '../ui/card/card-header';
import { CardTitle } from '../ui/card/card-title';
import { CardContent } from '../ui/card/card-content';
import { OptionCard } from '../ui/option-card/option-card'; 

@Component({
  selector: 'app-navigation-step',
  standalone: true,
  imports: [CommonModule, CardComponent, CardHeader, CardTitle, CardContent, OptionCard],
  templateUrl: './navigation-step.html',
  styleUrl: './navigation-step.css'
})
export class NavigationStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();

   updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }
}
