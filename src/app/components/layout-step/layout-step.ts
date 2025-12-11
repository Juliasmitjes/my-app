import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';
import { SingleColumn } from './layout-config/single-column/single-column';
import { TwoColumns } from './layout-config/two-columns/two-columns';
import { Grid } from './layout-config/grid/grid';

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [CommonModule, OptionCard, SingleColumn, TwoColumns, Grid],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css',
})
export class LayoutStep implements OnChanges {
  @Input() builderState!: BuilderState;
  @Input() selectedLayout: BuilderState['layout'] = null;
  selectedConfig: any = null;
  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() selectLayout = new EventEmitter<BuilderState['layout']>();
  locked=false;

  layouts: LayoutOption[] = [
    { id: 'single', name: 'Eén kolom', description: 'Simpel, inhoud verticaal gecentreerd', icon: 'layers' },
    { id: 'two-column', name: 'Twee kolommen', description: 'Zijbar met hoofdcontent', icon: 'columns2' },
    { id: 'grid', name: 'Rooster', description: 'Fotos, projecten, overzicht', icon: 'layout-grid' },
  ];

 ngOnChanges(changes: SimpleChanges) {
  if (changes['selectedLayout']) {
  }
}

 trackById(index: number, item: LayoutOption) {
    return item.id;
  }

  onSelect(id: string) {
  this.locked=false;
  const allowed = ['single', 'two-column', 'grid'] as const;
  const isAllowed = (allowed as readonly string[]).includes(id);

  const value: BuilderState['layout'] = isAllowed ? (id as BuilderState['layout']) : null;

  this.selectLayout.emit(value);
  this.update.emit({ layout: value });
  this.selectedLayout = value;

  /** Auto-scroll alleen voor mobiel */
  if (value === 'single' && window.innerWidth < 640) {
    setTimeout(() => {
      const el = document.getElementById('single-layout-top');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

   else if (value === 'two-column' && window.innerWidth < 640) {
    setTimeout(() => {
      const el = document.getElementById('two-layout-top');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  else if (value === 'grid' && window.innerWidth < 640) {
    setTimeout(() => {
      const el = document.getElementById('grid-layout-top');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
}}

  onConfigChange(config: any) {
  this.selectedConfig = config;
  console.log("LayoutStep: onConfigChange received", config);
}

confirmLayout() {
    console.log('LayoutStep: confirmLayout - selectedLayout, selectedConfig', this.selectedLayout, this.selectedConfig);
    this.locked = true;
    this.update.emit({
      layoutLocked: true,
      layout: this.selectedLayout,
      layoutConfig: this.selectedConfig
    });
  }}