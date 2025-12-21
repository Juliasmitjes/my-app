import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../ui/toast/toast.service';
import { UploadUnit } from '../upload-unit/upload-unit';

type UploadType = 'text' | 'image' | 'video';

@Component({
  selector: 'app-two-columns',
  standalone: true,
  templateUrl: './two-columns.html',
  imports: [CommonModule, LucideAngularModule, UploadUnit]
})
export class TwoColumns {

  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};

  @Output() configChange = new EventEmitter<any>();

  isSavedCol1 = false;
  isSavedCol2 = false;

  constructor(private toast: ToastService) {}

  colOptions = [
    { type: 'text', label: 'Tekst' },
    { type: 'image', label: 'Foto' },
    { type: 'video', label: 'Video' }
  ] as const;

  col1Index = 0;
  col2Index = 0;

  get col1Current() { return this.colOptions[this.col1Index]; }
  get col2Current() { return this.colOptions[this.col2Index]; }

  nextCol1() {
    this.col1Index = (this.col1Index + 1) % this.colOptions.length;
    this.emit();
  }

  nextCol2() {
    this.col2Index = (this.col2Index + 1) % this.colOptions.length;
    this.emit();
  }

  emit() {
    this.configChange.emit({
        layout: 'two-column',
        config: {
          col1Type: this.col1Current.type,
          col2Type: this.col2Current.type
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
        uploadKey
      }
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
        this.clearUploads(1);
        this.isSavedCol1 = false;
        return;
      }
      this.isSavedCol1 = true;
    }

    if (col === 2) {
      if (this.isSavedCol2) {
        this.clearUploads(2);
        this.isSavedCol2 = false;
        return;
      }
      this.isSavedCol2 = true;
    }
  }

  clearUploads(col: 1 | 2) {
    const key = this.getUploadKey(col);

    this.configChange.emit({
      layout: 'two-column',
      config: {
        clearUploadKeys: [key]
      }
    });
  }
}