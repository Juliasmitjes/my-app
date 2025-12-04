import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export type CellType = 'text' | 'image' | 'video';

interface GridCell {
  value: CellType;
  open: boolean;
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
  @Output() change = new EventEmitter<CellType[]>();

  rows = 2;
  cols = 2;

  grid: GridCell[] = [];

  // opties array type-safe
  options: CellType[] = ['text', 'image', 'video'];

  constructor() {
    this.updateGrid();
  }

  // standaard cel
  private createDefaultCell(): GridCell {
    return {
      value: 'text',
      open: false,
      labelMap: {
        text: 'Tekst',
        image: 'Afbeelding',
        video: 'Video'
      }
    };
  }

  // Grid op basis van rijen + kolommen
  updateGrid() {
    const total = this.rows * this.cols;

    const newGrid: GridCell[] = Array.from({ length: total }, (_, i) => {
      const prev = this.grid[i];

      // behoud vorige keuze
      if (prev) {
        return {
          ...this.createDefaultCell(),
          value: prev.value
        };
      }

      // nieuwe cel
      return this.createDefaultCell();
    });

    this.grid = newGrid;
    this.emit();
  }

  emit() {
    this.change.emit(this.grid.map(cell => cell.value));
  }

  setCellValue(index: number, type: CellType) {
    this.grid[index].value = type;
    this.grid[index].open = false;
    this.emit();
  }

  toggle(index: number) {
    this.grid[index].open = !this.grid[index].open;
  }

  closeAll() {
    this.grid.forEach(cell => (cell.open = false));
  }
}