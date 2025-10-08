import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-option-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './option-card.html',
  styleUrl: './option-card.css',
})
export class OptionCard {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon?: string; // later een component of SVG gebruiken!! nu string voor gemak
  @Input() preview?: string | null;
  @Input() selected = false;
  @Output() clickCard = new EventEmitter<void>();

  onClick() {
    this.clickCard.emit();
  }
}
