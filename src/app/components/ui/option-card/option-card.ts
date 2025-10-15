import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ChangeDetectionStrategy } from '@angular/core';
import { LayoutOption } from '../../layout-step/layout-step';


@Component({
  selector: 'app-option-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './option-card.html',
  styleUrl: './option-card.css',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class OptionCard {
  @Input() layout!: LayoutOption;
  @Input() icon?: string; // later een component of SVG gebruiken!! nu string voor gemak
  @Input() selected = false;
  @Input() description?: string;
  @Output() select = new EventEmitter<void>();

  onClick() {
    this.select.emit();
  }  
}
