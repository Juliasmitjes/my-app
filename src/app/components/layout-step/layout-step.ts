import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class LayoutStep implements OnChanges {
  @Input() builderState!: BuilderState;
  @Input() selectedLayout: 'single' | 'two-column' | 'grid' | null = null;


  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() selectLayout = new EventEmitter<string>();

  layouts: LayoutOption[] = [
    { id: 'single', name: 'Single Column', description: 'Simpel, inhoud verticaal gecentreerd', icon: 'layers' },
    { id: 'two-column', name: 'Two Columns', description: 'Zijbar met hoofdcontent', icon: 'columns' },
    { id: 'grid', name: 'Grid', description: 'Fotos, projecten, overzicht', icon: 'layout-grid' },
  ];


  // Sync when parent changes selectedLayout
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedLayout']) {
      // eventueel extra werk wanneer selection van parent verandert
    }
  }

  // user clicked an option
  onSelect(id: string) {
    this.selectLayout.emit(id);          // parent bewaart keuze
  }
}