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
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input({ required: true }) builderState!: BuilderState;
  @Input({ required: true }) currentStep!: number;
  @Input() colorThemes!: { id: string; colors: string[] }[];

  @Output() closed = new EventEmitter<void>();

  iconName = 'monitor';
  title = 'Live voorbeeld';
  fontMap = fontMap;

  close(): void {
    this.closed.emit();
  }

  /* ───── STAP VISIBILITY ───── */

  get canShowLayout(): boolean {
    return this.currentStep >= 0 && !!this.builderState.layout;
  }

  get singleBlocks(): Array<'text' | 'image' | 'video'> {
  switch (this.builderState.layoutConfig?.variantType) {
    case 'image-text': return ['image', 'text'];
    case 'text-image': return ['text', 'image'];
    case 'text-video': return ['text', 'video'];
    case 'video-text': return ['video', 'text'];
    case 'text-only': return ['text'];
    default: return ['text'];
  }
}

get twoColumns() {
  return [
    this.builderState.layoutConfig?.col1Type ?? 'text',
    this.builderState.layoutConfig?.col2Type ?? 'text'
  ];
}

get gridCells(): Array<'text' | 'image' | 'video'> {
  return this.builderState.layoutConfig?.cells ?? [];
}

get gridCols(): number {
  return this.builderState.layoutConfig?.cols ?? 1;
}

get gridText(): string {
  if (this.gridCols >= 4) {
    return 'Welkom in jouw nieuwe ontwerp!';
  }
  return this.builderState.fontSample || 'Welkom in jouw nieuwe ontwerp. Zie hier hoe jouw content tot leven komt.';
}

get gridFontSize(): string {
  if (this.gridCols >= 6) return 'text-xs';   
  if (this.gridCols >= 3) return 'text-sm';   
  return 'text-base';                         
}


  get canShowColors(): boolean {
    return this.currentStep >= 1 && !!this.builderState.colorTheme;
  }

  get canShowFont(): boolean {
    return this.currentStep >= 2 && !!this.builderState.fontVariant;
  }

  get canShowNavigation(): boolean {
    return this.currentStep >= 3 && !!this.builderState.navigation;
  }

  get canShowPages(): boolean {
    return this.currentStep >= 4 && (this.builderState.pages?.length ?? 0) > 0;
  }

  /* ───── STATE HELPERS ───── */

  get isEmpty(): boolean {
    return !this.builderState.layout;
  }

  get isSidebar(): boolean {
    return this.builderState.navigation === 'sidebar';
  }

  get pages(): string[] {
    return this.builderState.pages ?? ['home'];
  }

  get logoLabel(): string {
    return this.builderState.logo || 'Your Site';
  }

  getGridColumns(): string {
  if (this.builderState.layout === 'grid') {
    const cols = this.gridCols || 1;
    return `repeat(${cols}, 1fr)`;
  }
  if (this.builderState.layout === 'two-column') {
    return 'repeat(2, 1fr)';
  }
  return '1fr';
}

  pageLabel(p: string): string {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  /* ───── COLORS ───── */

  get selectedThemeColors(): string[] {
    const theme = this.colorThemes?.find(t => t.id === this.builderState.colorTheme);
    return theme
      ? theme.colors
      : [
          '#ffffff', '#f5f5f5', '#333333', '#fafafa',
          '#e0e0e0', '#d0d0d0', '#444444',
          '#eaeaea', '#555555', '#cccccc'
        ];
  }
}
