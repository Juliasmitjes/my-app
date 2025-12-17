import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BuilderState } from '../../types/builder-state';
import { fontMap } from '../../shared/fonts';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './preview-panel.html',
  styleUrls: ['./preview-panel.css']
})
export class PreviewPanel {
  @Input() open = false;
  @Input() builderState?: BuilderState;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() closed = new EventEmitter<void>();
  @Input() colorThemes!: { id: string; colors: string[] }[];
  @Input() userSampleText: string = '';

   get selectedThemeColors(): string[] {
    const theme = this.colorThemes?.find(t => t.id === this.builderState?.colorTheme);
    return theme ? theme.colors : ['#f3f3f3', '#e5e5e5', '#cccccc'];
  }

  iconName: string = 'monitor';
  title: string = 'Live voorbeeld';

  close() {
    this.closed.emit();
  }

  get hasNoUploads(): boolean {
  const u = this.builderState?.uploads;
  if (!u) return true;

  const noImage = !u.image;
  const noVideo = !u.video;
  const noText = !u.text || u.text.trim() === '';

  return noImage && noVideo && noText;
}


  get isEmpty(): boolean {
  const noUploads = this.hasNoUploads;
  const defaultLayout = !this.builderState?.layout || this.builderState.layout === 'single';
  const defaultPages = !this.builderState?.pages || this.builderState.pages.length <= 1;
  const noSampleText = !this.builderState?.fontSample || this.builderState.fontSample.trim() === '';

  return noUploads && defaultLayout && defaultPages && noSampleText;
}

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

  pageLabel(p: string) {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }


public fontMap = fontMap;

}
