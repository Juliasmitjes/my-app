import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-two-columns',
  templateUrl: './two-columns.html',
   imports: [
    CommonModule, FormsModule  
  ]
})
export class TwoColumns {
  @Output() change = new EventEmitter<{ col1: string; col2: string }>();

  col1 = 'text';
  col2 = 'image';

  emit() {
    this.change.emit({
      col1: this.col1,
      col2: this.col2,
    });
  }
}
