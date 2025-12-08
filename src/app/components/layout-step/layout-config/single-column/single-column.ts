import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-single-column',
  templateUrl: './single-column.html',
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
})


export class SingleColumn {
@Output() selectLayout = new EventEmitter<string>();
currentIndex = 0;

layoutOptions = [
  { id: 1, type: 'image-text', label: 'Afbeelding – Tekst' },
  { id: 2, type: 'text-image', label: 'Tekst – Afbeelding' },
  { id: 3, type: 'text-video', label: 'Tekst – Video' },
  { id: 4, type: 'video-text', label: 'Video – Tekst' },
  { id: 5, type: 'text-only', label: 'Alleen Tekst' },
];

get currentOption() {
  return this.layoutOptions[this.currentIndex];
}

nextOption() {
  this.currentIndex = (this.currentIndex + 1) % this.layoutOptions.length;
  this.selectLayout.emit(this.currentOption.type)
}

}
