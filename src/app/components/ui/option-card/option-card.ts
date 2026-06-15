import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-option-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './option-card.html',
  styleUrl: './option-card.css',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class OptionCard {
  @Input() layout?: { id: string; name: string; description?: string; icon?: string };
  @Input() preview?: string[]; 
  @Input() selected = false;
  @Output() select = new EventEmitter<void>();

  onClick() {
    this.select.emit();
  }  
}
