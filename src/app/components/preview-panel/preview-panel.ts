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

  iconName: string = 'monitor';
  title: string = 'Live voorbeeld';

  close() {
    this.closed.emit();
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

  /** ✅ Volledige fallback-kleurenset zodat layout altijd zichtbaar is */
  get selectedThemeColors(): string[] {
    const theme = this.colorThemes?.find(t => t.id === this.builderState?.colorTheme);

    return theme
      ? theme.colors
      : [
          '#ffffff', // 0 background
          '#f5f5f5', // 1 header bg
          '#333333', // 2 text
          '#fafafa', // 3 content bg
          '#e0e0e0', // 4 skeleton 1
          '#d0d0d0', // 5 skeleton 2
          '#444444', // 6 body text
          '#eaeaea', // 7 pill bg
          '#555555', // 8 pill text
          '#cccccc'  // 9 border
        ];
  }

  /** ✅ Check of uploads leeg zijn */
  get hasNoUploads(): boolean {
    const u = this.builderState?.uploads;
    if (!u) return true;

    const noImage = !u.image;
    const noVideo = !u.video;
    const noText = !u.text || u.text.trim() === '';

    return noImage && noVideo && noText;
  }

  /** ✅ Empty state: alleen als layout nog NIET gekozen is */
  get isEmpty(): boolean {
    return !this.builderState?.layout;
  }

  public fontMap = fontMap;
}