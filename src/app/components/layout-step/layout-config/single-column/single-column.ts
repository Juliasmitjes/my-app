import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../ui/toast/toast.service';
import { inject } from '@angular/core';

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
    LucideAngularModule
  ],
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
    { id: 5, type: 'text-only', label: 'Alleen tekst' },
  ];

  selectedLayout: string | null = null;

  ngOnInit() {
    this.selectedLayout = this.currentOption.type;
    this.emitChange(); 
  }

  get currentOption() {
    return this.layoutOptions[this.currentIndex];
  }

  nextOption() {
    if (this.locked) return;
    this.currentIndex = (this.currentIndex + 1) % this.layoutOptions.length;
    this.selectedLayout = this.currentOption.type;
    this.emitChange();
  }

  confirmLayout() {
    if (this.locked) return;
    if (!this.selectedLayout) return;
    this.emitChange(); // ensure parent has the latest config before parent locks
    console.log('SingleColumn: confirmLayout emitted', this.selectedLayout);
  }

  private emitChange() {
    const payload = {
      layout: this.selectedLayout,
      config: { variantIndex: this.currentIndex }
    };
    console.log('SingleColumn: emitChange', payload); // debug
    this.configChange.emit(payload);
  }

  
  get overlayButtons(): OverlayButton[] {
  switch (this.currentOption.type) {

    case 'image-text':
      return [
        { label: 'Upload foto', type: 'image' },
        { label: 'Upload tekst', type: 'text' }
      ];

    case 'text-image':
      return [
        { label: 'Upload tekst', type: 'text' },
        { label: 'Upload foto', type: 'image' }
      ];

    case 'text-video':
      return [
        { label: 'Upload tekst', type: 'text' },
        { label: 'Upload video', type: 'video' }
      ];

    case 'video-text':
      return [
        { label: 'Upload video', type: 'video' },
        { label: 'Upload tekst', type: 'text' }
      ];

    case 'text-only':
      return [
        { label: 'Upload tekst', type: 'text' }
      ];

    default:
      return [];
  }
}

handleUpload(type: UploadType, event: Event) {
  event.stopPropagation();

  this.isSaved = false;

  const uploadKey = `${this.currentOption.type}_${type}`;

  this.configChange.emit({
    layout: this.selectedLayout,
    config: {
      variantIndex: this.currentIndex,
      uploadType: type,
      uploadKey
    }
  });
}

isUploadComplete(): boolean {
  return this.overlayButtons.every(btn => {
    const key = `${this.currentOption.type}_${btn.type}`;
    return !!this.uploads[key];
  });
}

toggleSave(event: Event) {
  event.stopPropagation();

  // Nog niet alles gekozen
  if (!this.isUploadComplete()) {
    this.toast.info('Selecteer onderdelen');
    return;
  }

  // Annuleren → uploads verwijderen
  if (this.isSaved) {
    this.clearCurrentUploads();
    this.isSaved = false;
    this.toast.info('Wijzigingen ongedaan gemaakt');
    return;
  }

  // Opslaan
  this.isSaved = true;
  this.toast.success('Onderdelen zijn opgeslagen');
}


clearCurrentUploads() {
  const newUploads = { ...this.uploads };

  this.overlayButtons.forEach(btn => {
    const key = `${this.currentOption.type}_${btn.type}`;
    delete newUploads[key];
  });

  this.uploads = newUploads;

  // Parent informeren
  this.configChange.emit({
    layout: this.selectedLayout,
    config: {
      variantIndex: this.currentIndex,
      uploads: this.uploads
    }
  });
}

}