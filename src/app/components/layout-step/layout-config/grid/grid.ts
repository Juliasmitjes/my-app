import { Component, EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.html',
  imports: [
    CommonModule, FormsModule  
  ]
})
export class Grid {
  @Output() change = new EventEmitter<string[]>();

  rows = 2;
  cols = 2;

  grid: string[] = [];

  constructor() {
    this.updateGrid();
  }

  updateGrid() {
    const total = this.rows * this.cols;

    // resize grid array while keeping previous selections
    const newGrid = new Array(total)
      .fill('text')
      .map((_, i) => this.grid[i] ?? 'text');

    this.grid = newGrid;
    this.emit();
  }

  emit() {
    this.change.emit(this.grid);
  }
}
