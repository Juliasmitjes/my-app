import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
export class SingleColumn implements OnInit {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};

  @Output() configChange = new EventEmitter<{ layout: string | null; config?: any }>();

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
    this.selectedLayout = this.currentOption.type;
    this.emitChange();
  }

  get currentOption() {
    return this.layoutOptions[this.currentIndex];
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
      }
    });
  }

  onSaveClick(event: Event) {
  event.stopPropagation();

  if (!this.isUploadComplete()) {
    this.toast.info('Selecteer onderdelen');
    return;
  }

  if (this.isSaved) {
    this.clearCurrentUploads();
    this.isSaved = false;
    this.toast.info('Wijzigingen ongedaan gemaakt');
    return;
  }

  this.isSaved = true;
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
      }
    });
  }
}