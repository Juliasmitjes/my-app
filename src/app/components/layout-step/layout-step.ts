import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';

import { OptionCard } from '../ui/option-card/option-card';
import { SingleColumn } from './layout-config/single-column/single-column';
import { TwoColumns } from './layout-config/two-columns/two-columns';
import { Grid } from './layout-config/grid/grid';

import { FormsModule } from '@angular/forms';
import { ToastService } from '../ui/toast/toast.service';

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [
    CommonModule,
    OptionCard,
    SingleColumn,
    TwoColumns,
    Grid,
    FormsModule
  ],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css'
})
export class LayoutStep implements OnChanges {

  @Input() builderState!: BuilderState;
  @Input() selectedLayout: BuilderState['layout'] = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private toast: ToastService) {}

  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() selectLayout = new EventEmitter<BuilderState['layout']>();

  locked = false;
  uploads: Record<string, any> = {};

  // teksteditor
  showTextEditor = false;
  textEditorValue = '';

  // upload keys
  currentUploadKey: string | null = null;
  currentUploadKeyCol1: string | null = null;
  currentUploadKeyCol2: string | null = null;

  currentUploadType: 'image' | 'video' | 'text' | null = null;

  selectedConfig: any = null;

  layouts = [
    { id: 'single', name: 'Eén kolom', description: 'Simpel, inhoud verticaal gecentreerd', icon: 'layers' },
    { id: 'two-column', name: 'Twee kolommen', description: 'Zijbar met hoofdcontent', icon: 'columns2' },
    { id: 'grid', name: 'Rooster', description: 'Fotos, projecten, overzicht', icon: 'layout-grid' }
  ];

  ngOnChanges(changes: SimpleChanges) {}

  trackById(index: number, item: any) {
    return item.id;
  }

  // -----------------------------
  // LAYOUT SELECTIE
  // -----------------------------
  onSelect(id: string) {
    this.locked = false;

    const allowed = ['single', 'two-column', 'grid'] as const;
    const isAllowed = (allowed as readonly string[]).includes(id);

    const value = isAllowed ? id as BuilderState['layout'] : null;

    this.selectLayout.emit(value);
    this.update.emit({ layout: value });

    this.selectedLayout = value;

    // scroll op mobiel
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

  // -----------------------------
  // CONFIG CHANGE VAN LAYOUTS
  // -----------------------------
  onConfigChange(event: any) {
  this.selectedConfig = event;

  // 1) LayoutConfig altijd updaten als er een "config" zonder upload-actie is
  if (event.config && !event.config.uploadType && !event.config.clearUploadKeys) {
    this.update.emit({
      layout: event.layout ?? this.selectedLayout,
      layoutConfig: {
        ...this.builderState.layoutConfig,
        ...event.config
      }
    });
  }

  // 2) CLEAR uploads
  if (event.config?.clearUploadKeys) {
    const newUploads = { ...this.uploads };
    event.config.clearUploadKeys.forEach((key: string) => {
      delete newUploads[key];
    });
    this.uploads = newUploads;
    this.update.emit({ uploads: this.uploads });
    return;
  }

  // 3) UPLOAD START
  if (event.config?.uploadType && event.config?.uploadKey) {
    this.startUploadFlow(event.config.uploadType, event.config.uploadKey);
  }
}

  // -----------------------------
  // LAYOUT LOCKING
  // -----------------------------
  confirmLayout() {
    this.locked = true;
    this.update.emit({
      layoutLocked: true,
      layout: this.selectedLayout
    });
  }

  unlockLayout() {
    this.locked = false;
    this.update.emit({
      layoutLocked: false,
      layout: this.selectedLayout
    });
  }

  // -----------------------------
  // UPLOAD FLOW
  // -----------------------------
  startUploadFlow(type: 'image' | 'text' | 'video', key: string) {

    // Two-column col1
    if (key.startsWith('col1_')) {
      this.currentUploadKeyCol1 = key;
      this.currentUploadKeyCol2 = null;
      this.currentUploadKey = null;
    }

    // Two-column col2
    else if (key.startsWith('col2_')) {
      this.currentUploadKeyCol2 = key;
      this.currentUploadKeyCol1 = null;
      this.currentUploadKey = null;
    }

    // Grid
    else if (key.startsWith('grid_')) {
      this.currentUploadKey = key;
      this.currentUploadKeyCol1 = null;
      this.currentUploadKeyCol2 = null;
    }

    // Single-column
    else {
      this.currentUploadKey = key;
      this.currentUploadKeyCol1 = null;
      this.currentUploadKeyCol2 = null;
    }

    this.currentUploadType = type;

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
        this.openTextEditor(key);
        break;
    }
  }

  uploadTextFile() {
    this.fileInput.nativeElement.accept =
      '.txt,.md,.rtf,.html,.json,.csv,.docx,.pdf';
    this.fileInput.nativeElement.click();
  }

  handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    const key =
      this.currentUploadKey ??
      this.currentUploadKeyCol1 ??
      this.currentUploadKeyCol2;

    if (!file || !key) return;

    const isText =
      file.type.startsWith('text') ||
      /\.(txt|md|rtf|html|json|csv|docx|pdf)$/i.test(file.name);

    this.uploads = {
      ...this.uploads,
      [key]: isText
        ? { kind: 'file', name: file.name, file }
        : file
    };

    if (isText) this.toast.success('Tekstbestand geüpload');
    if (file.type.startsWith('image')) this.toast.success('Foto geüpload');
    if (file.type.startsWith('video')) this.toast.success('Video geüpload');

    this.update.emit({ uploads: this.uploads });

    input.value = '';
  }

  // -----------------------------
  // TEKSTEDITOR
  // -----------------------------
  openTextEditor(key: string) {
  this.currentUploadKey = key;

  const existing = this.uploads[key];

  this.textEditorValue =
    existing && existing.kind === 'inline'
      ? existing.value
      : '';

  this.showTextEditor = true;
}

  cancelTextEditor() {
    this.showTextEditor = false;
  }

saveTextEditor() {
  const key = this.currentUploadKey ?? this.currentUploadKeyCol1 ?? this.currentUploadKeyCol2;
  if (!key) return;

  this.uploads[key] = {
    kind: 'inline',
    value: this.textEditorValue
  };

  this.update.emit({ uploads: this.uploads });

  this.showTextEditor = false;
}
}