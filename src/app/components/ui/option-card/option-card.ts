import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-option-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './option-card.html',
  styleUrl: './option-card.css',
})
export class OptionCard {
  @Input() icon?: string; // later een component of SVG gebruiken!! nu string voor gemak
  @Input() selected = false;
  @Output() clickCard = new EventEmitter<void>();
  @Input() layout!: { id: string; name: string; description: string; icon: string };
  @Output() select = new EventEmitter<void>();

  onClick() {
    this.clickCard.emit();
  }

  
}
