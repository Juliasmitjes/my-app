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
import { Portfolio } from './layout-config/portfolio/portfolio';
import { Service } from './layout-config/service/service';
import { LocalBusiness } from './layout-config/local-business/local-business';
import { NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../ui/toast/toast.service';
import { ImageCropper } from './layout-config/image-cropper/image-cropper';

@Component({
  selector: 'app-layout-step',
  standalone: true,
  imports: [
    CommonModule,
    OptionCard,
    Portfolio,
    Service,
    LocalBusiness,
    FormsModule,
    ImageCropper
  ],
  templateUrl: './layout-step.html',
  styleUrl: './layout-step.css'
})

export class LayoutStep implements OnChanges {

  @Input() builderState!: BuilderState;
  @Input() selectedLayout: BuilderState['layout'] = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
  private toast: ToastService,
  private ngZone: NgZone
) {}

  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() selectLayout = new EventEmitter<BuilderState['layout']>();

  locked = false;
  uploads: Record<string, any> = {};

  // teksteditor
  showTextEditor = false;
  textEditorValue = '';
  editorTitle = '';
  editorSubtitle = '';
  editorBody = '';

  // upload keys
  currentUploadKey: string | null = null;
  currentUploadKeyCol1: string | null = null;
  currentUploadKeyCol2: string | null = null;

  currentUploadType: 'image' | 'video' | 'text' | null = null;

  selectedConfig: any = null;
  selectedCategory: 'portfolio' | 'service' | 'product' | 'local' | null = null;

  showCropper = false;
  cropperFile: File | null = null;
  cropperKey: string | null = null;
  cropperAspectRatio: number | null = null;

  layouts = [
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Werk, cases of projecten laten zien',
      icon: 'palette',
      layoutType: 'grid',
      hidden: false
    },
    {
      id: 'service',
      name: 'Service',
      description: 'Diensten overzichtelijk presenteren',
      icon: 'hand-platter',
      layoutType: 'grid',
      hidden: false
    },
    {
      id: 'product',
      name: 'Product',
      description: 'Producten of aanbod tonen',
      icon: 'shopping-cart',
      layoutType: 'grid',
      hidden: false
    }
  ] as const;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['builderState']) {
      this.uploads = this.builderState?.uploads ?? {};
      this.locked = !!this.builderState?.layoutLocked;
      if (this.builderState?.layout) {
        this.selectedLayout = this.builderState.layout;
      }
      if (this.builderState?.layoutConfig?.templateGroup) {
        this.selectedCategory = this.builderState.layoutConfig.templateGroup;
      }
    }
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  // -----------------------------
  // LAYOUT SELECTIE
  // -----------------------------
  onSelect(id: string) {
    this.locked = false;

    const selected = this.layouts.find(layout => layout.id === id);
    if (!selected) return;

    const value = selected.layoutType as BuilderState['layout'];

    this.selectLayout.emit(value);
    this.update.emit({
      layout: value,
      layoutConfig: {
        ...this.builderState.layoutConfig,
        templateGroup: selected.id
      }
    });
    this.update.emit({ contentSaved: false });

    this.selectedLayout = value;
    this.selectedCategory = selected.id;

    // scroll op mobiel
    const scrollMap: Record<string, string> = {
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
      const templateGroup = event.config?.templateGroup ?? 'portfolio';
      const templateId = event.config?.businessNameTemplateId as string | undefined;
      const subtitleKeyMap: Record<string, string> = {
        portfolio: 'artist_subtitle',
        service: 'service_subtitle',
        product: 'product_subtitle'
      };
      const subtitleKey =
        (templateGroup === 'service' || templateGroup === 'product') && templateId
          ? `${templateGroup}_subtitle_${templateId}`
          : subtitleKeyMap[templateGroup] ?? 'artist_subtitle';
      if (subtitleValue) {
        newUploads[subtitleKey] = subtitleValue;
      } else {
        delete newUploads[subtitleKey];
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

    this.currentUploadType = type;
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

  this.showCropper = false;
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
