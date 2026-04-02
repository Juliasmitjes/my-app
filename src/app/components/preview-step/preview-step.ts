import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BuilderState } from '../../types/builder-state';
import { fontMap } from '../../shared/fonts';
import { RequestPopup } from '../request-popup/request-popup';

@Component({
  selector: 'app-preview-step',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RequestPopup],
  templateUrl: './preview-step.html',
  styleUrl: './preview-step.css'
})

export class PreviewStep implements OnChanges, OnDestroy {
  @Input() builderState!: BuilderState;
  @Input() currentStep: number = 0;
  @Input() iconName: string = 'monitor-check';
  @Input() title: string = 'Live website preview';
  @Input() colorThemes: { id: string; colors: string[] }[] = [];
  @Input() mascotUrl!: string;
  activePageId: string | null = null;

  private _selectedThemeColors: string[] | null = null;
  private blobUrlCache = new Map<string, string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['builderState'] || changes['colorThemes']) {
      this._selectedThemeColors = null;
    }

    if (changes['builderState']) {
      this.resetBlobUrls();
      if (!this.pages.includes(this.activePageId ?? '')) {
        this.activePageId = this.pages[0] ?? 'home';
      }
    }
  }

  ngOnDestroy(): void {
    this.resetBlobUrls();
  }

  private resetBlobUrls(): void {
    for (const url of this.blobUrlCache.values()) {
      URL.revokeObjectURL(url);
    }
    this.blobUrlCache.clear();
  }

  get canShowLayout(): boolean {
    return !!this.builderState.layout;
  }

  get canShowNavigation(): boolean {
    return !!this.builderState.navigation;
  }

  get canShowPages(): boolean {
    return (this.builderState.pages?.length ?? 0) > 0;
  }

  get isSidebar(): boolean {
    return this.builderState?.navigation === 'sidebar';
  }

  get pages(): string[] {
    return this.builderState?.pages ?? ['home'];
  }

  get logoLabel(): string {
    return this.builderState?.logo || 'Jouw site';
  }

  pageLabel(p: string): string {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  get activePage(): string {
    const pages = this.pages;
    if (!pages.length) return 'home';
    if (this.activePageId && pages.includes(this.activePageId)) return this.activePageId;
    return pages[0];
  }

  setActivePage(pageId: string): void {
    this.activePageId = pageId;
  }

  get selectedThemeColors(): string[] {
    if (this._selectedThemeColors) return this._selectedThemeColors;

    const theme = this.colorThemes.find(t => t.id === this.builderState?.colorTheme);

    this._selectedThemeColors = theme
      ? theme.colors
      : [
          'hsl(0 0% 100%)',
          'hsl(214 82% 95%)',
          'hsl(223 71% 38%)',
          'hsl(214 82% 95%)',
          'hsl(215 64% 86%)',
          'hsl(218 26% 43%)',
          'hsl(220 46% 16%)',
          'hsl(193 100% 59% / 0.12)',
          'hsl(223 71% 38%)',
          'hsl(215 64% 86%)'
        ];

    return this._selectedThemeColors;
  }

  fontMap = fontMap;

  get headingFont(): string {
    const id =
      this.builderState?.headingFontVariant ??
      this.builderState?.fontVariant ??
      this.builderState?.bodyFontVariant ??
      'inter';
    return this.fontMap[id] ?? this.fontMap['inter'];
  }

  get bodyFont(): string {
    const id = this.builderState?.bodyFontVariant ?? this.builderState?.fontVariant ?? 'inter';
    return this.fontMap[id] ?? this.fontMap['inter'];
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

  get isPortfolioTemplate(): boolean {
    const group = this.builderState.layoutConfig?.templateGroup;
    const id = this.builderState.layoutConfig?.templateId ?? '';
    return group === 'portfolio' || id.startsWith('portfolio-');
  }

  get portfolioTemplateId(): string | null {
    return this.builderState.layoutConfig?.templateId ?? null;
  }

  get portfolioArtistAreas(): string {
    return '"a a b" "c d d" "e e f" "g h i"';
  }

  getPortfolioArtistArea(index: number): string {
    const areas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    return areas[index] ?? '';
  }

  getPortfolioUploadKey(index: number, type: 'image' | 'text' | 'video'): string | null {
    const id = this.portfolioTemplateId;
    if (!id) return null;
    return `grid_${id}_${index}_${type}`;
  }

  getPortfolioBusinessName(): string {
    const id = this.portfolioTemplateId;
    if (!id) return 'Bedrijfsnaam';
    const value = this.builderState.uploads?.[`business_name_${id}`];
    return typeof value === 'string' && value.trim() ? value : 'Bedrijfsnaam';
  }

  getPortfolioSubtitle(): string {
    const value = this.builderState.uploads?.['artist_subtitle'];
    return typeof value === 'string' && value.trim()
      ? value
      : 'Hier komt jouw ondertitel.';
  }

  getPortfolioTextBlock(index: number): { title: string; subtitle: string; body: string } | null {
    return this.getTextBlock(this.getPortfolioUploadKey(index, 'text'));
  }

  getPortfolioImage(index: number): string {
    return (
      this.getUploadFor(this.getPortfolioUploadKey(index, 'image')) ||
      'assets/images/exampleImage.png'
    );
  }

  getSingleUploadKey(kind: 'text' | 'image' | 'video'): string | null {
    const variant = this.builderState.layoutConfig?.variantType;
    if (!variant) return null;
    return `${variant}_${kind}`;
  }

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

  getPageText(pageId: string): { title: string; subtitle: string; body: string } | null {
    return this.getTextBlock(`page_${pageId}_text`);
  }

  getPageImage(pageId: string): string | null {
    return this.getUploadFor(`page_${pageId}_image`);
  }

  get isAboutPageActive(): boolean {
    return this.activePage === 'about';
  }

  get aboutPageSectionTitle(): string {
    return 'Over mij';
  }

  getAboutBodyColumns(pageId: string): [string, string] {
    return this.splitBodyIntoColumns(this.getPageText(pageId)?.body ?? '');
  }

  getUploadFor(key: string | null): string | null {
    if (!key) return null;

    const uploads = this.builderState.uploads;
    if (!uploads) return null;

    const file = uploads[key];
    if (!file) return null;

    if (file?.kind === 'inline') {
      return null;
    }

    if (file instanceof File) {
      const existing = this.blobUrlCache.get(key);
      if (existing) return existing;

      const url = URL.createObjectURL(file);
      this.blobUrlCache.set(key, url);
      return url;
    }

    if (typeof file === 'string') {
      return file;
    }

    return null;
  }

  openRequestPopup() {
    console.log('Button clicked!');
    this.showRequestPopup = true;
  }
  showRequestPopup: boolean = false;
  closeRequestPopup() {
    this.showRequestPopup = false;
  }

  private splitBodyIntoColumns(value: string): [string, string] {
    const fallback =
      'Vertel hier in een paar zinnen wie je bent, waar je voor staat en wat bezoekers op jouw Over-pagina moeten onthouden.';
    const normalized = (value || fallback).replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return [fallback, fallback];
    }

    const sentences = normalized.match(/[^.!?]+[.!?]?/g)?.map(part => part.trim()).filter(Boolean) ?? [];

    if (sentences.length >= 2) {
      const midpoint = Math.ceil(sentences.length / 2);
      return [
        sentences.slice(0, midpoint).join(' '),
        sentences.slice(midpoint).join(' ')
      ];
    }

    const words = normalized.split(' ');
    const midpoint = Math.ceil(words.length / 2);

    return [
      words.slice(0, midpoint).join(' '),
      words.slice(midpoint).join(' ') || words.slice(0, midpoint).join(' ')
    ];
  }
}
