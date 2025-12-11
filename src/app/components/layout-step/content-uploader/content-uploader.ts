import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

export interface UploadSlot {
  id: string;
  type: 'image' | 'video' | 'text';
  label: string;
  value?: any;  // file, video, text
}

@Component({
  selector: 'app-content-uploader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-uploader.html'
})

export class ContentUploader {
  @Input() slots: UploadSlot[] = [];
  @Output() change = new EventEmitter<UploadSlot[]>();

  typingSlot: string | null = null;
  typedText: string = '';

  onFileUpload(event: any, slot: UploadSlot) {
    const file = event.target.files[0];
    slot.value = file;
    this.change.emit(this.slots);
  }

  openTyping(slot: UploadSlot) {
    this.typingSlot = slot.id;
    this.typedText = slot.value || '';
  }

  confirmText(slot: UploadSlot) {
    slot.value = this.typedText;
    this.typingSlot = null;
    this.change.emit(this.slots);
  }
}
