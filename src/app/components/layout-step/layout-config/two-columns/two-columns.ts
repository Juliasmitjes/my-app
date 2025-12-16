import { Component, EventEmitter, Output, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../ui/toast/toast.service';
import { inject } from '@angular/core';

type UploadType = 'text' | 'image' | 'video';


@Component({
  selector: 'app-two-columns',
  standalone: true,
  templateUrl: './two-columns.html',
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
})

export class TwoColumns {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Output() selectLayout = new EventEmitter<{ col1: string, col2: string }>();
  @Output() configChange = new EventEmitter<any>();

  isSavedCol1 = false;
  isSavedCol2 = false;

  private toast = inject(ToastService); 

  colOptions = [
  { type: 'text', label: 'Tekst' },
  { type: 'image', label: 'Foto' },
  { type: 'video', label: 'Video' },
] as const;

  col1Index = 0;
  col2Index = 0;

  get col1Current() { return this.colOptions[this.col1Index]; }
  get col2Current() { return this.colOptions[this.col2Index]; }

  get col1Next() {
    return this.colOptions[(this.col1Index + 1) % this.colOptions.length];
  }
  get col2Next() {
    return this.colOptions[(this.col2Index + 1) % this.colOptions.length];
  }

  get col1OverlayButtons() {
  return [
    { label: `Upload ${this.col1Current.label}`, type: this.col1Current.type }
  ];
}

  get col2OverlayButtons() {
    return [
      { label: `Upload ${this.col2Current.label}`, type: this.col2Current.type }
    ];
  }


  nextCol1() {
    this.col1Index = (this.col1Index + 1) % this.colOptions.length;
    this.emit();
  }

  nextCol2() {
    this.col2Index = (this.col2Index + 1) % this.colOptions.length;
    this.emit();
  }

  emit() {
  this.selectLayout.emit({
    col1: this.col1Current.type,
    col2: this.col2Current.type
  });

  this.configChange.emit({
    layout: 'two-column',
    config: {
      col1Type: this.col1Current.type,
      col2Type: this.col2Current.type
    }
  });
}

 handleUpload(col: 1 | 2, type: UploadType, event: Event) {
  event.stopPropagation();

  const key = `col${col}_${type}`;

  this.configChange.emit({
    layout: 'two-column',
    config: {
      col,
      uploadType: type,
      uploadKey: key
    }
  });

  if (col === 1) this.isSavedCol1 = false;
  if (col === 2) this.isSavedCol2 = false;
}

isUploadComplete(col: 1 | 2): boolean {
  const current = col === 1 ? this.col1Current : this.col2Current;
  const key = `col${col}_${current.type}`;
  return !!this.uploads[key];
}

toggleSave(col: 1 | 2, event: Event) {
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
  const current = col === 1 ? this.col1Current : this.col2Current;
  const key = `col${col}_${current.type}`;

  this.configChange.emit({
    layout: 'two-column',
    config: {
      clearUploadKeys: [key]
    }
  });
}

}
