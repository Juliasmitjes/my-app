import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../ui/toast/toast.service';
import { inject } from '@angular/core';
import { UploadUnit } from '../upload-unit/upload-unit';

type UploadType = 'image' | 'text' | 'video';

interface OverlayButton {
  label: string;
  type: UploadType;
}

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

  @Output() configChange = new EventEmitter<{ layout: string | null; config?: any; contentSaved?: boolean }>();

  isSaved = false;

  private toast = inject(ToastService);

  currentIndex = 0;

  layoutOptions = [
    { id: 1, type: 'image-text', label: 'Foto boven tekst' },
    { id: 2, type: 'text-image', label: 'Tekst boven foto' },
    { id: 3, type: 'text-video', label: 'Tekst boven video' },
    { id: 4, type: 'video-text', label: 'Video boven tekst' },
    { id: 5, type: 'text-only', label: 'Alleen tekst' }
  ];

  selectedLayout: string | null = null;

  ngOnInit() {
    this.syncFromInputs();
    this.emitChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['layoutConfig'] || changes['contentSaved']) {
      this.syncFromInputs();
    }
  }

  get currentOption() {
    return this.layoutOptions[this.currentIndex];
  }

  private syncFromInputs() {
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

  nextOption() {
    if (this.locked) return;
    this.currentIndex = (this.currentIndex + 1) % this.layoutOptions.length;
    this.selectedLayout = this.currentOption.type;
    this.emitChange();
  }

  private emitChange() {
  this.configChange.emit({
    layout: 'single',
    config: {
      variantType: this.currentOption.type
    }
  });
}

  // --- upload-unit binding helpers ---

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
        uploadKey
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
        clearUploadKeys: keysToClear
      },
      contentSaved: false
    });
  }
}
