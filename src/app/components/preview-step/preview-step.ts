// preview-step.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BuilderState } from '../../types/builder-state';

@Component({
  selector: 'app-preview-step',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './preview-step.html',
  styleUrl: './preview-step.css'
})
export class PreviewStep {
  @Input() builderState!: BuilderState;

  // readable labels for pages in header
  pageLabel(pageId: string) {
    return pageId.charAt(0).toUpperCase() + pageId.slice(1);
  }

  // compute grid template columns based on layout
  getGridColumns(): string {
    switch (this.builderState?.layout) {
      case 'grid':
        return 'repeat(3, 1fr)';
      case 'two-column':
        return 'repeat(2, 1fr)';
      default:
        return '1fr';
    }
  }

  // defensive helpers for template
  get pages(): string[] {
    return this.builderState?.pages ?? ['home'];
  }

  get logoLabel(): string {
    return this.builderState?.logo || 'Your Site';
  }
}