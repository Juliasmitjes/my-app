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
import { Portfolio } from './layout-config/portfolio/portfolio';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../ui/toast/toast.service';
import { ImageCropper } from './layout-config/image-cropper/image-cropper';

type StepMode = 'select' | 'upload';

interface TemplateCard {
  id: string;
  title: string;
  subtitle: string;
  cols: number;
  cells: Array<'text' | 'image' | 'video'>;
  visual: 'service' | 'portfolio' | 'product' ;
}

const TEMPLATE_LIBRARY: TemplateCard[] = [
  { id: 'portfolio', title: 'Portfolio', subtitle: 'Dynamische spread met storytelling', cols: 4, cells: ['image', 'image', 'image', 'image', 'text', 'text'], visual: 'portfolio' },
  { id: 'product', title: 'Product', subtitle: 'Tekstgedreven intro met visuele focus', cols: 2, cells: ['text', 'image', 'image'], visual: 'product' },
  { id: 'service', title: 'Service', subtitle: 'Speelse, asymmetrische compositie', cols: 2, cells: ['image', 'image', 'image', 'image', 'text'], visual: 'service' }
];

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [
    CommonModule,
    Portfolio,
    FormsModule,
    ImageCropper
  ],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css'
})

export class LayoutStep implements OnChanges {

  @Input() builderState!: BuilderState;
  @Input() selectedLayout: BuilderState['layout'] = null;
  @Input() mode: StepMode = 'upload';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
  private toast: ToastService
) {}

  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() selectLayout = new EventEmitter<BuilderState['layout']>();

  locked = false;
  uploads: Record<string, any> = {};

  // teksteditor
  showTextEditor = false;
  editorTitle = '';
  editorSubtitle = '';
  editorBody = '';

  // upload keys
  currentUploadKey: string | null = null;
  currentUploadKeyCol1: string | null = null;
  currentUploadKeyCol2: string | null = null;

  selectedConfig: any = null;

  showCropper = false;
  cropperFile: File | null = null;
  cropperKey: string | null = null;
  cropperAspectRatio: number | null = null;
  uploadEditing = false;

  get visibleTemplateCards(): TemplateCard[] {
    return TEMPLATE_LIBRARY;
  }

  get selectedTemplateId(): string | null {
    return this.builderState?.layoutConfig?.templateId ?? null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {
      this.uploadEditing = false;
    }

    if (changes['builderState']) {
      this.uploads = this.builderState?.uploads ?? {};
      this.locked = !!this.builderState?.layoutLocked;
      if (this.builderState?.layout) {
        this.selectedLayout = this.builderState.layout;
      }
    }
  }

  onUploadPrimaryAction(): void {
    if (!this.uploadEditing) {
      this.uploadEditing = true;
      this.update.emit({ contentSaved: false });
      return;
    }

    const hasUploads = Object.keys(this.uploads ?? {}).length > 0;
    if (!hasUploads) {
      this.toast.error('Upload eerst minimaal één item');
      return;
    }

    this.uploadEditing = false;
    this.update.emit({ contentSaved: true });
    this.toast.success('Content opgeslagen');
  }

  chooseTemplate(card: TemplateCard): void {
    this.selectedLayout = 'grid';
    this.locked = true;

    this.update.emit({
      layout: 'grid',
      layoutLocked: true,
      contentSaved: false,
      layoutConfig: {
        ...this.builderState.layoutConfig,
        templateGroup: 'portfolio',
        templateId: card.id,
        cols: card.cols,
        cells: card.cells
      }
    });
  }

  isTemplateSelected(card: TemplateCard): boolean {
    return this.selectedTemplateId === card.id;
  }

  // -----------------------------
  // CONFIG CHANGE VAN LAYOUTS
  // -----------------------------
  onConfigChange(event: any) {
  this.selectedConfig = event;

  if (event.action === 'lock') {
    this.confirmLayout();
    return;
  }

  const hasTextConfig = event.config?.businessName !== undefined || event.config?.subtitle !== undefined;
  if (hasTextConfig) {
    const value = (event.config.businessName ?? '').toString().trim();
    const subtitleValue = (event.config.subtitle ?? '').toString().trim();
    const templateId = event.config.businessNameTemplateId as string | undefined;
    const businessKey = templateId ? `business_name_${templateId}` : 'artist_business_name';
    const newUploads = { ...this.uploads };

    if (value) {
      newUploads[businessKey] = value;
    } else {
      delete newUploads[businessKey];
    }

    if (event.config?.subtitle !== undefined) {
      if (subtitleValue) {
        newUploads['artist_subtitle'] = subtitleValue;
      } else {
        delete newUploads['artist_subtitle'];
      }
    }

    this.uploads = newUploads;
    this.update.emit({ uploads: this.uploads });
  }

  // 1) LayoutConfig altijd updaten als er een "config" zonder upload-actie is
  if (event.config && !event.config.uploadType && !event.config.clearUploadKeys && !hasTextConfig) {
    this.update.emit({
      layout: event.layout ?? this.selectedLayout,
      layoutConfig: {
        ...this.builderState.layoutConfig,
        ...event.config
      }
    });
  }

  if (typeof event.contentSaved === 'boolean') {
    this.update.emit({ contentSaved: event.contentSaved });
  }

  // 2) CLEAR uploads
  if (event.config?.clearUploadKeys) {
    const newUploads = { ...this.uploads };
    event.config.clearUploadKeys.forEach((key: string) => {
      delete newUploads[key];
    });
    this.uploads = newUploads;
    this.update.emit({ uploads: this.uploads });
    this.update.emit({ contentSaved: false });
    return;
  }

  // 3) UPLOAD START
  if (event.config?.uploadType && event.config?.uploadKey) {
    this.startUploadFlow(
      event.config.uploadType,
      event.config.uploadKey,
      event.config.aspectRatio
    );
  }
}

  // -----------------------------
  // LAYOUT LOCKING
  // -----------------------------
  confirmLayout() {
    this.locked = true;
    this.update.emit({
      layoutLocked: true,
      layout: this.selectedLayout,
      contentSaved: false
    });
  }

  unlockLayout() {
    this.locked = false;
    this.update.emit({
      layoutLocked: false,
      layout: this.selectedLayout,
      contentSaved: false
    });
  }

  // -----------------------------
  // UPLOAD FLOW
  // -----------------------------
  startUploadFlow(type: 'image' | 'text' | 'video', key: string, aspectRatio?: number | null) {

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

    this.cropperAspectRatio = type === 'image' ? (aspectRatio ?? null) : null;

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

  if (!file || !key) {
    input.value = '';
    return;
  }

  if (file.type.startsWith('image')) {
    this.cropperFile = file;
    this.cropperKey = key;
    this.showCropper = true;

    input.value = '';
    return;
  }


  if (file.type.startsWith('video')) {
    this.cropperAspectRatio = null;
    this.uploads = {
      ...this.uploads,
      [key]: file
    };

    this.toast.success('Video geüpload');
    this.update.emit({ uploads: this.uploads });

    input.value = '';
    return;
  }

  this.toast.error('Dit bestandstype wordt niet ondersteund');
  this.cropperAspectRatio = null;
  input.value = '';
}

  openTextEditor(key: string) {
  this.currentUploadKey = key;

  const existing = this.uploads[key];

  // Reset standaard
  this.editorTitle = '';
  this.editorSubtitle = '';
  this.editorBody = '';

  if (existing && existing.kind === 'inline') {
    const value = existing.value;

    if (value && typeof value === 'object') {
      this.editorTitle = value.title ?? '';
      this.editorSubtitle = value.subtitle ?? '';
      this.editorBody = value.body ?? '';
    }
    else if (typeof value === 'string') {
      this.editorBody = value;
    }
  }

  this.showTextEditor = true;
}

  cancelTextEditor() {
    this.showTextEditor = false;
  }

saveTextEditor() {
  const isEmpty = !this.editorBody.trim();

  if (isEmpty) {
    this.toast.error('Vul de uitgebreide tekst in');
    return;
  }

  const key =
    this.currentUploadKey ??
    this.currentUploadKeyCol1 ??
    this.currentUploadKeyCol2;

  if (!key) return;

  this.uploads = {
    ...this.uploads,
    [key]: {
      kind: 'inline',
      value: {
        title: this.editorTitle,
        subtitle: this.editorSubtitle,
        body: this.editorBody
      }
    }
  };

  this.update.emit({ uploads: this.uploads });
  this.showTextEditor = false;
}

get canSaveText(): boolean {
  return this.editorBody.trim().length > 0;
}


onImageCropped(blob: Blob) {
  if (!this.cropperKey) return;

  const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });

  this.uploads = {
    ...this.uploads,
    [this.cropperKey]: file
  };

  this.update.emit({ uploads: this.uploads });
  this.update.emit({ contentSaved: true });

  this.showCropper = false;
  this.uploadEditing = false;
  this.cropperFile = null;
  this.cropperKey = null;
  this.cropperAspectRatio = null;

  this.toast.success('Foto bijgewerkt');
}

  onCropperCancel() {
    this.showCropper = false;
    this.cropperFile = null;
    this.cropperKey = null;
    this.cropperAspectRatio = null;
  }
}
