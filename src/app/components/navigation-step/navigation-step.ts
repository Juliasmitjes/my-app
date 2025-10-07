import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';

@Component({
  selector: 'app-navigation-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-step.html',
  styleUrl: './navigation-step.css'
})
export class NavigationStep {
  @Input() builderState!: BuilderState;
  @Input() navigationStyles: any[] = []
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  selectNavigationStyle(navigationStyle: 'top' | 'sidebar' ) {
    this.update.emit({ navigation: navigationStyle });
  }
}
