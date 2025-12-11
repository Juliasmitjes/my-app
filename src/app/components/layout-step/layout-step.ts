import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState, GridLayoutConfig, TwoColumnConfig } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';
import { SingleColumn } from './layout-config/single-column/single-column';
import { TwoColumns } from './layout-config/two-columns/two-columns';
import { Grid } from './layout-config/grid/grid';
import { ContentUploader, UploadSlot } from '../layout-step/content-uploader/content-uploader'; 

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [CommonModule, OptionCard, SingleColumn, TwoColumns, Grid, ContentUploader],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css',
})
export class LayoutStep implements OnChanges {
  @Input() builderState!: BuilderState;
  @Input() selectedLayout: BuilderState['layout'] = null;

  selectedConfig: any = null;

  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() selectLayout = new EventEmitter<BuilderState['layout']>();

  locked = false;

  uploads: any = {};

  layouts: LayoutOption[] = [
    { id: 'single', name: 'Eén kolom', description: 'Simpel, inhoud verticaal gecentreerd', icon: 'layers' },
    { id: 'two-column', name: 'Twee kolommen', description: 'Zijbar met hoofdcontent', icon: 'columns2' },
    { id: 'grid', name: 'Rooster', description: 'Fotos, projecten, overzicht', icon: 'layout-grid' },
  ];

  ngOnChanges(changes: SimpleChanges) {}

  trackById(index: number, item: LayoutOption) {
    return item.id;
  }

  onSelect(id: string) {
    this.locked = false;

    const allowed = ['single', 'two-column', 'grid'] as const;
    const isAllowed = (allowed as readonly string[]).includes(id);

    const value: BuilderState['layout'] = isAllowed ? (id as BuilderState['layout']) : null;

    this.selectLayout.emit(value);
    this.update.emit({ layout: value });
    this.selectedLayout = value;

    /** Auto-scroll alleen voor mobiel */
    const scrollMap: any = {
      single: 'single-layout-top',
      'two-column': 'two-layout-top',
      grid: 'grid-layout-top'
    };

    if (value && window.innerWidth < 640) {
      setTimeout(() => {
        const el = document.getElementById(scrollMap[value]);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

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
  }

  unlockLayout() {
    this.locked = false;

    this.update.emit({
      layoutLocked: false,
      layout: this.selectedLayout,
      layoutConfig: this.selectedConfig
    });

    console.log("LayoutStep: layout unlocked");
  }

  onUploadsChange(uploadData: any) {
    this.uploads = uploadData;

    this.update.emit({
      uploads: this.uploads
    });
  }

  /**
   * ============================================================
   *  DIT IS DE COMPLETE getUploadSlots() MAPPING
   * ============================================================
   */
  getUploadSlots(): UploadSlot[] {
    if (!this.selectedLayout || !this.selectedConfig) return [];

    const variant = this.selectedConfig?.layout;

    /**
     * --------------------------------
     * SINGLE COLUMN
     * --------------------------------
     */
    if (this.selectedLayout === 'single') {
      const map: any = {
        'image-text': [
          { id: 'img', type: 'image', label: 'Afbeelding' },
          { id: 'txt', type: 'text', label: 'Tekst' },
        ],
        'text-image': [
          { id: 'txt', type: 'text', label: 'Tekst' },
          { id: 'img', type: 'image', label: 'Afbeelding' },
        ],
        'text-video': [
          { id: 'txt', type: 'text', label: 'Tekst' },
          { id: 'vid', type: 'video', label: 'Video' },
        ],
        'video-text': [
          { id: 'vid', type: 'video', label: 'Video' },
          { id: 'txt', type: 'text', label: 'Tekst' },
        ],
        'text-only': [
          { id: 'txt', type: 'text', label: 'Tekst' },
        ],
      };

      return map[variant] ?? [];
    }

    /**
     * --------------------------------
     * TWO COLUMN
     *
     * Using BuilderState → TwoColumnConfig:
     *   left:  'text' | 'image' | 'video'
     *   right: 'text' | 'image' | 'video'
     * --------------------------------
     */
    if (this.selectedLayout === 'two-column') {
      const cfg = this.selectedConfig.config as TwoColumnConfig;

      return [
        { id: 'left', type: cfg.left, label: 'Linkerkolom' },
        { id: 'right', type: cfg.right, label: 'Rechterkolom' }
      ];
    }

    /**
     * --------------------------------
     * GRID
     *
     * Using BuilderState → GridLayoutConfig:
     *   rows, cols, cells[]
     * --------------------------------
     */
    if (this.selectedLayout === 'grid') {
      const cfg = this.selectedConfig.config as GridLayoutConfig;

      return cfg.cells.map((cell, i) => ({
        id: `cell-${i}`,
        type: cell.value,
        label: `Vak ${i + 1}`
      }));
    }

    return [];
  }
}
