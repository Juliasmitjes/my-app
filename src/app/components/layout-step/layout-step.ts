import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';


export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  icon?: string;
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
  @Input() selectedLayout: BuilderState['layout'] = null;

  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() selectLayout = new EventEmitter<BuilderState['layout']>();

  layouts: LayoutOption[] = [
    { id: 'single', name: 'Single Column', description: 'Simpel, inhoud verticaal gecentreerd', icon: 'layers' },
    { id: 'two-column', name: 'Two Columns', description: 'Zijbar met hoofdcontent', icon: 'columns2' },
    { id: 'grid', name: 'Grid', description: 'Fotos, projecten, overzicht', icon: 'layout-grid' },
  ];

 ngOnChanges(changes: SimpleChanges) {
  if (changes['selectedLayout']) {
  }
}

 trackById(index: number, item: LayoutOption) {
    return item.id;
  }


  onSelect(id: BuilderState['layout']) {
    this.selectLayout.emit(id);
    this.update.emit({ layout: id });
    this.selectedLayout = id; 
  }
}