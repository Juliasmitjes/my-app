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
  @Input() label = '';                // "Foto", "Tekst", "Video"
  @Input() uploadKey = '';            // "image-text_image", "col1_image", "grid_3_text", ...
  @Input() uploads: Record<string, any> = {};
  @Input() isSaved = false;           // mag blijven als style-hint
  @Input() isComplete = false;        // idem
  @Input() compact = false;

  @Output() requestUpload = new EventEmitter<string>();   // uploadKey
  @Output() requestClear = new EventEmitter<string>();    // uploadKey

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

  onClearClick(event: Event) {
    event.stopPropagation();
    this.requestClear.emit(this.uploadKey);
  }
}