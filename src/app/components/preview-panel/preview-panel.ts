import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BuilderState } from '../../types/builder-state';

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

   get selectedThemeColors(): string[] {
    const theme = this.colorThemes?.find(t => t.id === this.builderState?.colorTheme);
    return theme ? theme.colors : ['#f3f3f3', '#e5e5e5', '#cccccc'];
  }


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

  fontMap: Record<string, string> = {
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  merriweather: "'Merriweather', serif",
  playfair: "'Playfair Display', serif",
  montserrat: "'Montserrat', sans-serif",
  oswald: "'Oswald', sans-serif"
};

}
