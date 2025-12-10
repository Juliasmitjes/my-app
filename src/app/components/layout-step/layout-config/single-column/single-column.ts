import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-single-column',
  standalone: true,
  templateUrl: './single-column.html',
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
})
export class SingleColumn {
  @Input() locked = false;
  @Output() selectLayout = new EventEmitter<string>();

  currentIndex = 0;

  layoutOptions = [
  { id: 1, type: 'image-text', label: 'Foto boven tekst' },
  { id: 2, type: 'text-image', label: 'Tekst boven foto' },
  { id: 3, type: 'text-video', label: 'Tekst boven video' },
  { id: 4, type: 'video-text', label: 'Video boven tekst' },
  { id: 5, type: 'text-only', label: 'Alleen tekst' },
];

  /** Huidige optie */
  get currentOption() {
    return this.layoutOptions[this.currentIndex];
  }

  /** Volgende optie preview – gebruikt in de HTML */
  get nextOptionPreview() {
    const nextIndex = (this.currentIndex + 1) % this.layoutOptions.length;
    return this.layoutOptions[nextIndex];
  }

  /** Ga naar de volgende layout */
  nextOption() {
    this.currentIndex = (this.currentIndex + 1) % this.layoutOptions.length;
    this.selectLayout.emit(this.currentOption.type);
  }
}
