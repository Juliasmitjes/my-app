import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';
import { SingleColumn } from './layout-config/single-column/single-column';
import { TwoColumns } from './layout-config/two-columns/two-columns';
import { Grid } from './layout-config/grid/grid';
import { FormsModule } from '@angular/forms'; 

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [CommonModule, OptionCard, SingleColumn, TwoColumns, Grid, FormsModule ],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css',
})
export class LayoutStep implements OnChanges {
  @Input() builderState!: BuilderState;
  @Input() selectedLayout: BuilderState['layout'] = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedConfig: any = null;
  showTextEditor = false;
  textEditorValue = '';

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

 onConfigChange(event: any) {
  this.selectedConfig = event;

  if (event.config?.uploadType) {
    this.startUploadFlow(event.config.uploadType);
  }
}
  confirmLayout() {
    this.locked = true;

    this.update.emit({
      layoutLocked: true,
      layout: this.selectedLayout,
    });
  }

  unlockLayout() {
    this.locked = false;

    this.update.emit({
      layoutLocked: false,
      layout: this.selectedLayout,
    });
  }

  onUploadsChange(uploadData: any) {
    this.uploads = uploadData;

    this.update.emit({
      uploads: this.uploads
    });
  }

startUploadFlow(type: 'image' | 'text' | 'video') {
  switch (type) {
    case 'image':
      this.fileInput.nativeElement.accept = 'image/*';
      this.fileInput.nativeElement.click();
      break;

    case 'video':
      this.fileInput.nativeElement.accept = 'video/*';
      this.fileInput.nativeElement.click();
      break;

    case 'text':
      this.openTextEditor();
      break;
  }
}

uploadTextFile() {
  this.fileInput.nativeElement.accept = '.txt,.md,.rtf,.html,.json,.csv';
  this.fileInput.nativeElement.click();
}


handleFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // hier kun je het bestand opslaan in je builder state
}

openTextEditor() {
  this.textEditorValue = '';
  this.showTextEditor = true;
}

cancelTextEditor() {
  this.showTextEditor = false;
}

saveTextEditor() {
  this.showTextEditor = false;
  // Sla op in builder state
  this.update.emit({
    uploads: {
      ...this.uploads,
      text: this.textEditorValue
    }
  });
}
}
