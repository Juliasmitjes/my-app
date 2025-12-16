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

  // "Foto", "Tekst", "Video"
  @Input() label = '';

  // Unieke key: "image-text_image", "col1_image", "grid_3_text", etc.
  @Input() uploadKey = '';

  // Volledige uploads-map uit LayoutStep
  @Input() uploads: Record<string, any> = {};

  // Opslag-status (per blok/kolom/cel)
  @Input() isSaved = false;

  // Of alle vereiste uploads voor deze unit compleet zijn
  @Input() isComplete = false;

  @Output() requestUpload = new EventEmitter<string>(); // uploadKey
  @Output() requestSave = new EventEmitter<string>();   // uploadKey
  @Output() requestClear = new EventEmitter<string>();  // uploadKey

  get hasUpload(): boolean {
    return !!this.uploads[this.uploadKey];
  }

  get fileName(): string | null {
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