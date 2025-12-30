import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../ui/toast/toast.service';
import { inject } from '@angular/core';
import { UploadUnit } from '../upload-unit/upload-unit';

type UploadType = 'image' | 'text' | 'video';
type TemplateGroup = 'editorial' | 'local' | 'portfolio' | 'service' | 'product' | null;

type TemplateType = 'image-text' | 'text-image' | 'text-video' | 'video-text' | 'text-only';

interface OverlayButton {
  label: string;
  type: UploadType;
}

interface TemplateOption {
  id: string;
  type: TemplateType;
  label: string;
  description: string;
  preview: UploadType[];
}

const TEMPLATE_SETS: Record<string, TemplateOption[]> = {
  editorial: [
    {
      id: 'editorial-hero',
      type: 'text-image',
      label: 'Headline + beeld',
      description: 'Sterke titel met rustig beeld eronder.',
      preview: ['text', 'image']
    },
    {
      id: 'editorial-story',
      type: 'text-only',
      label: 'Verhaal centraal',
      description: 'Alleen tekst voor een klassiek verhaal.',
      preview: ['text']
    },
    {
      id: 'editorial-cover',
      type: 'image-text',
      label: 'Cover + intro',
      description: 'Beeld boven, tekst eronder.',
      preview: ['image', 'text']
    }
  ],
  local: [
    {
      id: 'local-spotlight',
      type: 'image-text',
      label: 'Lokale blikvanger',
      description: 'Foto boven, kerntekst eronder.',
      preview: ['image', 'text']
    },
    {
      id: 'local-visit',
      type: 'text-image',
      label: 'Adres + foto',
      description: 'Intro met beeld onderaan.',
      preview: ['text', 'image']
    },
    {
      id: 'local-simple',
      type: 'text-only',
      label: 'Snel contact',
      description: 'Korte tekst en directe call-to-action.',
      preview: ['text']
    }
  ]
};

@Component({
  selector: 'app-single-column',
  standalone: true,
  templateUrl: './single-column.html',
  imports: [
    CommonModule,
    LucideAngularModule,
    UploadUnit
  ]
})
export class SingleColumn implements OnInit, OnChanges {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;
  @Input() templateGroup: TemplateGroup = null;

  @Output() configChange = new EventEmitter<{ layout: string | null; config?: any; contentSaved?: boolean }>();

  isSaved = false;

  private toast = inject(ToastService);

  currentIndex = 0;
  layoutOptions: TemplateOption[] = [];
  selectedLayout: string | null = null;

  ngOnInit() {
    this.syncTemplateSet();
    this.syncFromInputs();
    this.emitChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['templateGroup'] || changes['layoutConfig'] || changes['contentSaved']) {
      this.syncTemplateSet();
      this.syncFromInputs();
    }
  }

  get currentOption() {
    return this.layoutOptions[this.currentIndex];
  }

  private syncTemplateSet() {
    const group = this.templateGroup === 'local' ? 'local' : 'editorial';
    this.layoutOptions = TEMPLATE_SETS[group];

    if (this.currentIndex >= this.layoutOptions.length) {
      this.currentIndex = 0;
    }
  }

  private syncFromInputs() {
    if (!this.layoutOptions.length) {
      this.syncTemplateSet();
    }

    const variantType = this.layoutConfig?.variantType;
    if (variantType) {
      const index = this.layoutOptions.findIndex(option => option.type === variantType);
      if (index >= 0) {
        this.currentIndex = index;
      }
    }
    this.selectedLayout = this.currentOption.type;
    this.isSaved = !!this.contentSaved;
  }

  selectOption(option: TemplateOption) {
    if (this.locked) return;
    const index = this.layoutOptions.findIndex(item => item.id === option.id);
    if (index >= 0) {
      this.currentIndex = index;
    }
    this.selectedLayout = this.currentOption.type;
    this.emitChange();
  }

  get overlayButtons(): OverlayButton[] {
    switch (this.currentOption.type) {
      case 'image-text':
        return [
          { label: 'Foto', type: 'image' },
          { label: 'Tekst', type: 'text' }
        ];
      case 'text-image':
        return [
          { label: 'Tekst', type: 'text' },
          { label: 'Foto', type: 'image' }
        ];
      case 'text-video':
        return [
          { label: 'Tekst', type: 'text' },
          { label: 'Video', type: 'video' }
        ];
      case 'video-text':
        return [
          { label: 'Video', type: 'video' },
          { label: 'Tekst', type: 'text' }
        ];
      case 'text-only':
        return [
          { label: 'Tekst', type: 'text' }
        ];
      default:
        return [];
    }
  }

  private emitChange() {
    this.configChange.emit({
      layout: 'single',
      config: {
        variantType: this.currentOption.type,
        templateGroup: this.templateGroup
      }
    });
  }

  getUploadKey(btn: OverlayButton): string {
    return `${this.currentOption.type}_${btn.type}`;
  }

  isUploadComplete(): boolean {
    return this.overlayButtons.every(btn => {
      const key = this.getUploadKey(btn);
      return !!this.uploads[key];
    });
  }

  onRequestUpload(uploadKey: string, type: UploadType) {
    this.isSaved = false;
    this.configChange.emit({
      layout: this.selectedLayout,
      config: {
        variantIndex: this.currentIndex,
        uploadType: type,
        uploadKey,
        templateGroup: this.templateGroup
      },
      contentSaved: false
    });
  }

  onSaveClick(event: Event) {
    event.stopPropagation();

    if (!this.isUploadComplete()) {
      this.toast.info('Selecteer onderdelen');
      return;
    }

    if (this.isSaved) {
      this.isSaved = false;
      this.configChange.emit({
        layout: this.selectedLayout,
        contentSaved: false
      });
      this.toast.info('Je kunt nu weer wijzigen');
      return;
    }

    this.isSaved = true;
    this.configChange.emit({
      layout: this.selectedLayout,
      contentSaved: true
    });
    this.toast.success('Onderdelen zijn opgeslagen');
  }

  onRequestClear(uploadKey: string) {
    this.clearCurrentUploads();
  }

  clearCurrentUploads() {
    const keysToClear = this.overlayButtons.map(btn => this.getUploadKey(btn));

    this.configChange.emit({
      layout: this.selectedLayout,
      config: {
        variantIndex: this.currentIndex,
        clearUploadKeys: keysToClear,
        templateGroup: this.templateGroup
      },
      contentSaved: false
    });
  }
}
