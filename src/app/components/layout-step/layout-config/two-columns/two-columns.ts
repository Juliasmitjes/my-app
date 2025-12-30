import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
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
      label: 'Intro + foto',
      description: 'Korte uitleg met een sterke foto.',
      col1Type: 'text',
      col2Type: 'image'
    },
    {
      id: 'service-proof',
      label: 'Foto + uitleg',
      description: 'Beeld links, service uitleg rechts.',
      col1Type: 'image',
      col2Type: 'text'
    },
    {
      id: 'service-video',
      label: 'Video + uitleg',
      description: 'Video met toelichting ernaast.',
      col1Type: 'video',
      col2Type: 'text'
    }
  ]
};

@Component({
  selector: 'app-two-columns',
  standalone: true,
  templateUrl: './two-columns.html',
  imports: [CommonModule, LucideAngularModule, UploadUnit]
})
export class TwoColumns implements OnChanges {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;
  @Input() templateGroup: TemplateGroup = null;

  @Output() configChange = new EventEmitter<any>();

  isSavedCol1 = false;
  isSavedCol2 = false;

  constructor(private toast: ToastService) {}

  templates: TemplateOption[] = TEMPLATE_SETS['service'];
  currentTemplate: TemplateOption = TEMPLATE_SETS['service'][0];

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
    if (changes['layoutConfig'] || changes['contentSaved']) {
      this.syncFromInputs();
      if (!this.layoutConfig?.col1Type || !this.layoutConfig?.col2Type) {
        this.emit();
      }
    }
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
}
