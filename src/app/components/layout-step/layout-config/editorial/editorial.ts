import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { UploadUnit } from '../upload-unit/upload-unit';

type UploadType = 'image' | 'text' | 'video';
type TemplateType = 'image-text' | 'text-image' | 'text-video' | 'video-text' | 'text-only';
type TemplateGroup = 'portfolio' | 'service' | 'editorial' | 'product' | 'local' | null;

interface TemplateOption {
  id: string;
  label: string;
  description: string;
  type: TemplateType;
  preview: UploadType[];
}

const TEMPLATE_SETS: Record<string, TemplateOption[]> = {
  editorial: [
    {
      id: 'editorial-story',
      label: 'Story + beeld',
      description: 'Lange tekst met een beeld.',
      type: 'text-image',
      preview: ['text', 'image']
    },
    {
      id: 'editorial-focus',
      label: 'Beeld + verhaal',
      description: 'Beeld boven met tekst eronder.',
      type: 'image-text',
      preview: ['image', 'text']
    },
    {
      id: 'editorial-plain',
      label: 'Alleen tekst',
      description: 'Klassiek verhaal, zonder beeld.',
      type: 'text-only',
      preview: ['text']
    }
  ],
  local: [
    {
      id: 'local-hero',
      label: 'Intro + foto',
      description: 'Introductie met een duidelijke foto.',
      type: 'image-text',
      preview: ['image', 'text']
    },
    {
      id: 'local-call',
      label: 'Tekst focus',
      description: 'Korte tekst, direct en helder.',
      type: 'text-only',
      preview: ['text']
    },
    {
      id: 'local-visual',
      label: 'Foto + tekst',
      description: 'Sterke foto met uitleg.',
      type: 'image-text',
      preview: ['image', 'text']
    }
  ]
};

@Component({
  selector: 'app-editorial',
  standalone: true,
  templateUrl: './editorial.html',
  imports: [CommonModule, LucideAngularModule, UploadUnit]
})
export class Editorial implements OnInit, OnChanges {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;
  @Input() templateGroup: TemplateGroup = 'editorial';

  @Output() configChange = new EventEmitter<any>();

  layoutOptions: TemplateOption[] = TEMPLATE_SETS['editorial'];
  currentOption: TemplateOption = TEMPLATE_SETS['editorial'][0];

  overlayButtons: { label: string; type: UploadType }[] = [];

  isSaved = false;

  ngOnInit() {
    this.syncTemplateSet();
    this.syncFromInputs();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['templateGroup']) {
      this.syncTemplateSet();
    }
    if (changes['layoutConfig'] || changes['contentSaved']) {
      this.syncFromInputs();
      if (!this.layoutConfig?.selectedTemplate) {
        this.emit();
      }
    }
  }

  private syncTemplateSet() {
    const group = this.templateGroup === 'local' ? 'local' : 'editorial';
    this.layoutOptions = TEMPLATE_SETS[group];
    this.currentOption = this.layoutOptions[0];
    this.updateOverlayButtons();
  }

  private syncFromInputs() {
    const selectedTemplate = this.layoutConfig?.selectedTemplate as TemplateType | undefined;
    if (selectedTemplate) {
      const found = this.layoutOptions.find(option => option.type === selectedTemplate);
      if (found) {
        this.currentOption = found;
        this.updateOverlayButtons();
      }
    }

    this.isSaved = !!this.contentSaved;
  }

  selectOption(option: TemplateOption) {
    if (this.locked) return;
    this.currentOption = option;
    this.updateOverlayButtons();
    this.emit();
  }

  updateOverlayButtons() {
    this.overlayButtons = this.getButtonsForTemplate(this.currentOption.type);
  }

  emit() {
    this.configChange.emit({
      layout: 'single',
      config: {
        selectedTemplate: this.currentOption.type,
        templateGroup: this.templateGroup
      }
    });
  }

  getUploadKey(button: { label: string; type: UploadType }): string {
    return `${this.currentOption.type}_${button.type}`;
  }

  isUploadComplete(): boolean {
    return this.overlayButtons.every(btn => this.uploads[this.getUploadKey(btn)]);
  }

  onRequestUpload(uploadKey: string, type: UploadType) {
    this.isSaved = false;

    this.configChange.emit({
      layout: 'single',
      config: {
        uploadType: type,
        uploadKey,
        templateGroup: this.templateGroup
      },
      contentSaved: false
    });
  }

  onRequestClear(uploadKey: string) {
    this.clearUploads(uploadKey);
  }

  onSaveClick(event: Event) {
    event.stopPropagation();

    if (!this.isUploadComplete()) return;

    if (this.isSaved) {
      this.isSaved = false;
      this.configChange.emit({
        layout: 'single',
        contentSaved: false
      });
      return;
    }

    this.isSaved = true;
    this.configChange.emit({
      layout: 'single',
      contentSaved: true
    });
  }

  clearUploads(uploadKey: string) {
    this.configChange.emit({
      layout: 'single',
      config: {
        clearUploadKeys: [uploadKey]
      },
      contentSaved: false
    });
  }

  private getButtonsForTemplate(template: TemplateType): Array<{ label: string; type: UploadType }> {
    switch (template) {
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
        return [{ label: 'Tekst', type: 'text' }];
      default:
        return [{ label: 'Tekst', type: 'text' }];
    }
  }
}
