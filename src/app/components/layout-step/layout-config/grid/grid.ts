import { Component, EventEmitter, Output, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export type CellType = 'text' | 'image' | 'video';

interface GridCell {
  value: CellType;
  labelMap: Record<CellType, string>;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.html',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ]
})
export class Grid {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Output() change = new EventEmitter<CellType[]>();
  @Output() configChange = new EventEmitter<any>();

  rows = 2;
  cols = 2;

  grid: GridCell[] = [];

  // opties array type-safe
  options: CellType[] = ['text', 'image', 'video'];

  constructor() {
    this.updateGrid();
  }

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

  updateGrid() {
    const total = Math.max(1, this.rows) * Math.max(1, this.cols);

    const newGrid: GridCell[] = Array.from({ length: total }, (_, i) => {
      const prev = this.grid[i];
      if (prev) {
        return {
          ...this.createDefaultCell(),
          value: prev.value
        };
      }
      return this.createDefaultCell();
    });

    this.grid = newGrid;
    this.emit();
  }

  emit() {
    this.change.emit(this.grid.map(cell => cell.value));
  }

  /** Cycle naar de volgende optie voor een cel (click) */
  nextCell(index: number) {
    const current = this.grid[index].value;
    const nextIndex = (this.options.indexOf(current) + 1) % this.options.length;
    this.grid[index].value = this.options[nextIndex];
    this.emit();
  }

  /** Helper voor template: wat is de volgende optie (voor preview) */
  cellNext(index: number): CellType {
    const current = this.grid[index].value;
    const nextIndex = (this.options.indexOf(current) + 1) % this.options.length;
    return this.options[nextIndex];
  }

  /** Template helper: ARIA state */
  cellSelected(index: number) {
    // placeholder for future selected states; returns false for now
    return false;
  }

 handleUpload(index: number, type: CellType, event: Event) {
  event.stopPropagation();

  const uploadKey = `grid_${index}_${type}`;

  this.configChange.emit({
    layout: 'grid',
    config: {
      cellIndex: index,
      uploadType: type,
      uploadKey
    }
  });
}
}
