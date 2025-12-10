import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

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

  @Output() selectLayout = new EventEmitter<{ col1: string, col2: string }>();

  colOptions = [
    { type: 'text',  label: 'Tekst' },
    { type: 'image', label: 'Afbeelding' },
    { type: 'video', label: 'Video' },
  ];

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
  }
}
