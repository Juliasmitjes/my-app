import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-unit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-unit.html'
})
export class UploadUnit {

  @Input() locked = false;

  @Input() label = '';               // "Foto", "Tekst", "Video"
  @Input() uploadKey = '';           // "col1_image", "grid_3_text", "image-text_text"
  @Input() uploads: Record<string, any> = {};

  @Input() isSaved = false;          // komt uit parent
  @Input() isComplete = false;       // komt uit parent

  @Output() requestUpload = new EventEmitter<string>();   // uploadKey
  @Output() requestSave = new EventEmitter<string>();     // uploadKey
  @Output() requestClear = new EventEmitter<string>();    // uploadKey

  get hasUpload() {
    return !!this.uploads[this.uploadKey];
  }

  get fileName() {
    const item = this.uploads[this.uploadKey];
    return item?.name ?? null;
  }

  onUploadClick(event: Event) {
    event.stopPropagation();
    this.requestUpload.emit(this.uploadKey);
  }

  onSaveClick(event: Event) {
    event.stopPropagation();
    this.requestSave.emit(this.uploadKey);
  }

  onClearClick(event: Event) {
    event.stopPropagation();
    this.requestClear.emit(this.uploadKey);
  }
}