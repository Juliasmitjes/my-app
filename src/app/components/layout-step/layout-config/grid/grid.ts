import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UploadUnit } from '../upload-unit/upload-unit';

export type CellType = 'text' | 'image' | 'video';

interface GridCell {
  value: CellType;
  labelMap: Record<CellType, string>;
}

@Component({
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.html',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    UploadUnit
  ]
})
export class Grid {

  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};

  @Output() configChange = new EventEmitter<any>();

  rows = 2;
  cols = 2;

  grid: GridCell[] = [];

  // opslaan-status per cel
  isSaved: Record<number, boolean> = {};

  options: CellType[] = ['text', 'image', 'video'];

  ngOnInit() {
  this.updateGrid();
  }


  /* ---------------------------------------------------
     Helpers
  --------------------------------------------------- */

  private createDefaultCell(): GridCell {
    return {
      value: 'text',
      labelMap: {
        text: 'Tekst',
        image: 'Foto',
        video: 'Video'
      }
    };
  }

  private emitConfig() {
    this.configChange.emit({
      layout: 'grid',
      config: {
        cols: this.cols,
        cells: this.grid.map(c => c.value)
      }
    });
  }

  /* ---------------------------------------------------
     Grid opbouwen
  --------------------------------------------------- */

  updateGrid() {
    const total = Math.max(1, this.rows) * Math.max(1, this.cols);

    this.grid = Array.from({ length: total }, (_, i) => {
      const prev = this.grid[i];
      return prev
        ? { ...this.createDefaultCell(), value: prev.value }
        : this.createDefaultCell();
    });

    this.emitConfig();
  }

  nextCell(index: number) {
    if (this.locked) return;

    const current = this.grid[index].value;
    const nextIndex = (this.options.indexOf(current) + 1) % this.options.length;

    this.grid[index].value = this.options[nextIndex];

    this.emitConfig();
  }

  /* ---------------------------------------------------
     Upload helpers
  --------------------------------------------------- */

  getUploadKey(index: number): string {
    const cell = this.grid[index];
    return `grid_${index}_${cell.value}`;
  }

  isUploadComplete(index: number): boolean {
    return !!this.uploads[this.getUploadKey(index)];
  }

  onRequestUpload(index: number, uploadKey: string, type: CellType) {
    this.isSaved[index] = false;

    this.configChange.emit({
      layout: 'grid',
      config: {
        cellIndex: index,
        uploadType: type,
        uploadKey
      },
      contentSaved: false
    });
  }

  onRequestClear(index: number, uploadKey: string) {
    this.clearUploads(index);
  }

  /* ---------------------------------------------------
     Opslaan / annuleren
  --------------------------------------------------- */

  onSaveClick(index: number, event: Event) {
    event.stopPropagation();

    if (!this.isUploadComplete(index)) return;

    // annuleren
    if (this.isSaved[index]) {
      this.isSaved[index] = false;
      this.configChange.emit({
        layout: 'grid',
        contentSaved: false
      });
      return;
    }

    // opslaan
    this.isSaved[index] = true;
    const allSaved = this.grid.every((_, i) => this.isSaved[i]);
    this.configChange.emit({
      layout: 'grid',
      contentSaved: allSaved
    });
  }

  clearUploads(index: number) {
    const key = this.getUploadKey(index);

    this.configChange.emit({
      layout: 'grid',
      config: {
        clearUploadKeys: [key]
      },
      contentSaved: false
    });

    // na clear opnieuw config uitsturen
    this.emitConfig();
  }
}
