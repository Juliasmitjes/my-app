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
  @Input() iconName: string = 'monitor-check';
  @Input() title: string = 'Live website preview';
  @Input() colorThemes: { id: string; colors: string[] }[] = [];
  @Input() mascotUrl: string = '/assets/mascot.png'; // voeg jouw mascotte hier toe

  get isSidebar(): boolean {
    return this.builderState?.navigation === 'sidebar';
  }

  get pages(): string[] {
    return this.builderState?.pages ?? ['home'];
  }

  get logoLabel(): string {
    return this.builderState?.logo || 'Your Site';
  }

  getGridColumns(): string {
    switch (this.builderState?.layout) {
      case 'grid': return 'repeat(3, 1fr)';
      case 'two-column': return 'repeat(2, 1fr)';
      default: return '1fr';
    }
  }

  pageLabel(p: string): string {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  get selectedThemeColors(): string[] {
    const theme = this.colorThemes.find(t => t.id === this.builderState?.colorTheme);
    return theme?.colors ?? ['#e5e7eb', '#d1d5db', '#9ca3af']; 
  }
}
