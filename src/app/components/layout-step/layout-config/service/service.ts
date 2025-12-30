import { Component, EventEmitter, Output, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../ui/toast/toast.service';
import { UploadUnit } from '../upload-unit/upload-unit';

type UploadType = 'text' | 'image' | 'video';
type TemplateGroup = 'service' | 'portfolio' | 'editorial' | 'product' | 'local' | null;

interface TemplateOption {
  id: string;
  label: string;
  description: string;
  col1Type: UploadType;
  col2Type: UploadType;
}

const TEMPLATE_SETS: Record<string, TemplateOption[]> = {
  service: [
    {
      id: 'service-intro',
      label: 'Restaurant',
      description: 'Elegante verdeling met focus op sfeer.',
      col1Type: 'text',
      col2Type: 'image'
    },
    {
      id: 'service-proof',
      label: 'Health & Beauty',
      description: 'Verzorgd en rustgevend met focus op detail.',
      col1Type: 'image',
      col2Type: 'text'
    },
    {
      id: 'service-video',
      label: 'Industrial',
      description: 'Stoer en strak met krachtige visuals.',
      col1Type: 'video',
      col2Type: 'text'
    }
  ]
};

@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.html',
  imports: [CommonModule, LucideAngularModule, UploadUnit]
})
export class Service implements OnChanges, OnDestroy {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;
  @Input() templateGroup: TemplateGroup = 'service';

  @Output() configChange = new EventEmitter<any>();

  isSavedCol1 = false;
  isSavedCol2 = false;

  constructor(private toast: ToastService) {}

  templates: TemplateOption[] = TEMPLATE_SETS['service'];
  currentTemplate: TemplateOption = TEMPLATE_SETS['service'][0];
  private blobUrlCache = new Map<string, string>();

  labelMap: Record<UploadType, string> = {
    text: 'Tekst',
    image: 'Foto',
    video: 'Video'
  };

  get col1Current() {
    return { type: this.currentTemplate.col1Type, label: this.labelMap[this.currentTemplate.col1Type] };
  }

  get col2Current() {
    return { type: this.currentTemplate.col2Type, label: this.labelMap[this.currentTemplate.col2Type] };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['templateGroup']) {
      this.syncTemplateSet();
    }
    if (changes['uploads']) {
      this.resetBlobUrls();
    }
    if (changes['layoutConfig'] || changes['contentSaved']) {
      this.syncFromInputs();
      if (!this.layoutConfig?.col1Type || !this.layoutConfig?.col2Type) {
        this.emit();
      }
    }
  }

  ngOnDestroy(): void {
    this.resetBlobUrls();
  }

  private syncTemplateSet() {
    this.templates = TEMPLATE_SETS['service'];
    if (!this.templates.length) {
      this.templates = TEMPLATE_SETS['service'];
    }
    if (!this.currentTemplate) {
      this.currentTemplate = this.templates[0];
    }
  }

  private syncFromInputs() {
    const col1Type = this.layoutConfig?.col1Type;
    const col2Type = this.layoutConfig?.col2Type;

    if (col1Type && col2Type) {
      const match = this.templates.find(template => template.col1Type === col1Type && template.col2Type === col2Type);
      if (match) {
        this.currentTemplate = match;
      }
    }

    this.isSavedCol1 = !!this.contentSaved;
    this.isSavedCol2 = !!this.contentSaved;
  }

  selectTemplate(template: TemplateOption) {
    if (this.locked) return;
    this.currentTemplate = template;
    this.emit();
  }

  onTemplateAction(template: TemplateOption, event?: Event) {
    event?.stopPropagation();

    if (this.locked) {
      if (template.id !== this.currentTemplate.id) {
        this.currentTemplate = template;
        this.emit();
        this.configChange.emit({
          layout: 'two-column',
          contentSaved: false
        });
        return;
      }

      this.configChange.emit({
        layout: 'two-column',
        contentSaved: !this.contentSaved
      });
      return;
    }

    this.selectTemplate(template);
    this.configChange.emit({
      layout: 'two-column',
      action: 'lock'
    });
  }

  isFirstTemplate(template?: TemplateOption | null): boolean {
    const target = template ?? this.currentTemplate;
    return target?.id === 'service-intro';
  }

  emit() {
    this.configChange.emit({
      layout: 'two-column',
      config: {
        col1Type: this.currentTemplate.col1Type,
        col2Type: this.currentTemplate.col2Type,
        templateGroup: this.templateGroup
      }
    });
  }

  getUploadKey(col: 1 | 2): string {
    const current = col === 1 ? this.col1Current : this.col2Current;
    return `col${col}_${current.type}`;
  }

  getUploadKeyForTemplate(template: TemplateOption, col: 1 | 2): string {
    const type = col === 1 ? template.col1Type : template.col2Type;
    return `col${col}_${type}`;
  }

  isUploadComplete(col: 1 | 2): boolean {
    return !!this.uploads[this.getUploadKey(col)];
  }

  onRequestUpload(col: 1 | 2, uploadKey: string, type: UploadType) {
    if (col === 1) this.isSavedCol1 = false;
    if (col === 2) this.isSavedCol2 = false;

    this.configChange.emit({
      layout: 'two-column',
      config: {
        col,
        uploadType: type,
        uploadKey,
        templateGroup: this.templateGroup
      },
      contentSaved: false
    });
  }

  onRequestClear(col: 1 | 2, uploadKey: string) {
    this.clearUploads(col);
  }

  onSaveClick(col: 1 | 2, event: Event) {
    event.stopPropagation();

    if (!this.isUploadComplete(col)) {
      this.toast.info('Selecteer onderdelen');
      return;
    }

    if (col === 1) {
      if (this.isSavedCol1) {
        this.isSavedCol1 = false;
        this.configChange.emit({
          layout: 'two-column',
          contentSaved: false
        });
        return;
      }
      this.isSavedCol1 = true;
      this.configChange.emit({
        layout: 'two-column',
        contentSaved: this.isSavedCol1 && this.isSavedCol2
      });
    }

    if (col === 2) {
      if (this.isSavedCol2) {
        this.isSavedCol2 = false;
        this.configChange.emit({
          layout: 'two-column',
          contentSaved: false
        });
        return;
      }
      this.isSavedCol2 = true;
      this.configChange.emit({
        layout: 'two-column',
        contentSaved: this.isSavedCol1 && this.isSavedCol2
      });
    }
  }

  clearUploads(col: 1 | 2) {
    const key = this.getUploadKey(col);

    this.configChange.emit({
      layout: 'two-column',
      config: {
        clearUploadKeys: [key]
      },
      contentSaved: false
    });
  }

  getTextContentForKey(key: string): { title?: string; subtitle?: string; body?: string } | null {
    const entry = this.uploads?.[key];
    if (!entry) return null;

    if (entry?.kind === 'inline') {
      const value = entry.value;
      if (value && typeof value === 'object') {
        return {
          title: value.title ?? '',
          subtitle: value.subtitle ?? '',
          body: value.body ?? ''
        };
      }
      if (typeof value === 'string') {
        return { body: value };
      }
    }

    if (entry && typeof entry === 'object') {
      const value = entry as { title?: string; subtitle?: string; body?: string };
      if (value.title || value.subtitle || value.body) {
        return {
          title: value.title ?? '',
          subtitle: value.subtitle ?? '',
          body: value.body ?? ''
        };
      }
    }

    if (typeof entry === 'string') {
      return { body: entry };
    }

    return null;
  }

  getImagePreviewForKey(key: string): string | null {
    const entry = this.uploads?.[key];
    if (!entry || entry?.kind === 'inline') return null;

    if (entry instanceof File) {
      const cached = this.blobUrlCache.get(key);
      if (cached) return cached;
      const url = URL.createObjectURL(entry);
      this.blobUrlCache.set(key, url);
      return url;
    }

    if (typeof entry === 'string') {
      return entry;
    }

    return null;
  }

  private resetBlobUrls(): void {
    for (const url of this.blobUrlCache.values()) {
      URL.revokeObjectURL(url);
    }
    this.blobUrlCache.clear();
  }
}
