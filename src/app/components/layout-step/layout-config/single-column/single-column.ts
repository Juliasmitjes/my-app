import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
export class SingleColumn implements OnInit {
  @Input() locked = false;
  @Output() configChange = new EventEmitter<{ layout: string | null; config?: any }>();

  currentIndex = 0;

  layoutOptions = [
    { id: 1, type: 'image-text', label: 'Foto boven tekst' },
    { id: 2, type: 'text-image', label: 'Tekst boven foto' },
    { id: 3, type: 'text-video', label: 'Tekst boven video' },
    { id: 4, type: 'video-text', label: 'Video boven tekst' },
    { id: 5, type: 'text-only', label: 'Alleen tekst' },
  ];

  selectedLayout: string | null = null;

  ngOnInit() {
    this.selectedLayout = this.currentOption.type;
    this.emitChange(); 
  }

  get currentOption() {
    return this.layoutOptions[this.currentIndex];
  }

  nextOption() {
    if (this.locked) return;
    this.currentIndex = (this.currentIndex + 1) % this.layoutOptions.length;
    this.selectedLayout = this.currentOption.type;
    this.emitChange();
  }

  confirmLayout() {
    if (this.locked) return;
    if (!this.selectedLayout) return;
    this.emitChange(); // ensure parent has the latest config before parent locks
    console.log('SingleColumn: confirmLayout emitted', this.selectedLayout);
  }

  private emitChange() {
    const payload = {
      layout: this.selectedLayout,
      config: { variantIndex: this.currentIndex }
    };
    console.log('SingleColumn: emitChange', payload); // debug
    this.configChange.emit(payload);
  }
}