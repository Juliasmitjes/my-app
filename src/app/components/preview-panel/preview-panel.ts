import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class PreviewPanel implements OnChanges {

  @Input() open = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input({ required: true }) builderState!: BuilderState;
  @Input({ required: true }) currentStep!: number;
  @Input() colorThemes!: { id: string; colors: string[] }[];

  @Output() closed = new EventEmitter<void>();

  iconName = 'monitor';
  title = 'Live voorbeeld';
  fontMap = fontMap;

  /* ────────────────────────────────────────────────
   * HYDRATION-SAFE CACHES
   * ────────────────────────────────────────────────
   */

  private _selectedThemeColors: string[] | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['builderState'] || changes['colorThemes']) {
      this._selectedThemeColors = null;
    }
  }

  /* ────────────────────────────────────────────────
   * PANEL CONTROL
   * ────────────────────────────────────────────────
   */

  close(): void {
    this.closed.emit();
  }

  /* ────────────────────────────────────────────────
   * STEP VISIBILITY
   * ────────────────────────────────────────────────
   */

  get canShowLayout(): boolean {
    return this.currentStep >= 0 && !!this.builderState.layout;
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

  /* ────────────────────────────────────────────────
   * LAYOUT HELPERS
   * ────────────────────────────────────────────────
   */

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

  getGridColumns(): string {
    if (this.builderState.layout === 'grid') {
      return `repeat(${this.gridCols || 1}, 1fr)`;
    }
    if (this.builderState.layout === 'two-column') {
      return 'repeat(2, 1fr)';
    }
    return '1fr';
  }

  getGridText(i: number): string {
    const variants = [
      'Laat je verhaal tot leven komen.',
      'Een moderne basis voor jouw content.',
      'Perfect voor visuals en storytelling.',
      'Rustige opmaak met sterke typografie.',
      'Jouw ontwerp, jouw ritme.'
    ];
    return variants[i % variants.length];
  }

  get gridFontSize(): string {
    if (this.gridCols >= 6) return 'text-xs';
    if (this.gridCols >= 3) return 'text-sm';
    return 'text-base';
  }

  /* ────────────────────────────────────────────────
   * STATE HELPERS
   * ────────────────────────────────────────────────
   */

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

  pageLabel(p: string): string {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  /* ────────────────────────────────────────────────
  * TEXT BLOCK HELPERS
  * ────────────────────────────────────────────────
  */

  // Single-column: keys zoals "image-text_text", "text-image_text", etc.
  getSingleUploadKey(kind: 'text' | 'image' | 'video'): string | null {
    const variant = this.builderState.layoutConfig?.variantType;
    if (!variant) return null;
    return `${variant}_${kind}`;
  }

  // Inline text object ophalen: { title, subtitle, body }
  getTextBlock(key: string | null): { title: string; subtitle: string; body: string } | null {
    if (!key) return null;
    const uploads = this.builderState.uploads;
    if (!uploads) return null;

    const entry = uploads[key];
    if (!entry || entry.kind !== 'inline' || !entry.value) return null;

    const value = entry.value;
    return {
      title: value.title ?? '',
      subtitle: value.subtitle ?? '',
      body: value.body ?? ''
    };
  }

  /* ────────────────────────────────────────────────
   * COLORS (HYDRATION SAFE)
   * ────────────────────────────────────────────────
   */

  get selectedThemeColors(): string[] {
    if (this._selectedThemeColors) return this._selectedThemeColors;

    const theme = this.colorThemes?.find(t => t.id === this.builderState.colorTheme);

    this._selectedThemeColors = theme
      ? theme.colors
      : [
          'hsl(0 0% 100%)',
          'hsl(210 40% 96%)',
          'hsl(220 70% 15%)',
          'hsl(210 40% 96%)',
          'hsl(220 13% 91%)',
          'hsl(220 13% 46%)',
          'hsl(220 26% 14%)',
          'hsl(195 100% 50% / 0.12)',
          'hsl(220 70% 15%)',
          'hsl(220 13% 91%)'
        ];

    return this._selectedThemeColors;
  }

  /* ────────────────────────────────────────────────
   * UPLOAD HANDLING
   * ────────────────────────────────────────────────
   */

    getUploadFor(key: string | null): string | null {
      if (!key) return null;

      const uploads = this.builderState.uploads;
      if (!uploads) return null;

      const file = uploads[key];
      if (!file) return null;

      // Inline text → hier NIET voor gebruiken
      if (file?.kind === 'inline') {
        return null;
      }

      // File → blob URL
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }

      // Base64 / URL
      if (typeof file === 'string') {
        return file;
      }

      return null;
    }
}