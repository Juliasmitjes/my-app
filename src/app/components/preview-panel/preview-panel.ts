// preview-panel.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BuilderState } from '../../types/builder-state';
import { PreviewStep } from '../preview-step/preview-step';
import { Button } from '../../components/ui/button/button';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PreviewStep, Button ],
  templateUrl: './preview-panel.html',
  styleUrls: ['./preview-panel.css']
})
export class PreviewPanel {
  @Input() open = false;
  @Input() builderState?: BuilderState;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}