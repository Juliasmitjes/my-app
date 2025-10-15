import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [CommonModule, OptionCard],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css',
})


export class LayoutStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Input() selectedLayout: string | null = null;
  @Output() selectLayout = new EventEmitter<string>();

   updateState(newState: Partial<BuilderState>) {
    this.update.emit(newState);
}

layouts: LayoutOption[] = [
    {
      id: 'een-kolom',
      name: 'Single Column',
      description: 'Simpel, inhoud verticaal gecentreerd',
      icon: 'layers',
    },
    {
      id: 'twee-kolommen',
      name: 'Two Columns',
      description: 'Zijbar met hoofdcontent',
      icon: 'columns',
    },
    {
      id: 'grid',
      name: 'Grid',
      description: 'Fotos, projecten, overzicht',
      icon: 'layout-grid',
    },
  ];

  onSelect(id: string) {
    this.selectLayout.emit(id);
  }
}