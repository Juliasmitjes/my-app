import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navigation-step',
  standalone: true,
  imports: [CommonModule, OptionCard, LucideAngularModule],
  templateUrl: './navigation-step.html',
  styleUrl: './navigation-step.css'
})
export class NavigationStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  /** update builderState-partieel */
  updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }

  /** event voor logo input */
  onLogoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.updateState({ logo: input.value });
  }
}
