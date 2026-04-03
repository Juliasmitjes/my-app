import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderState } from '../../types/builder-state';
import { PageDef } from '../content-step/content-step';
import { fontMap } from '../../shared/fonts';

@Component({
  selector: 'app-page-content-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page-content-modal.html',
  styleUrl: './page-content-modal.css'
})
export class PageContentModal implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Input() page: PageDef | null = null;
  @Input() builderState!: BuilderState;
  @Input() colorThemes: { id: string; colors: string[] }[] = [];
  @Output() dismiss = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    pageId: string;
    title: string;
    subtitle: string;
    body: string;
    image?: File | string | null;
    backgroundImage?: File | string | null;
    portraitImage?: File | string | null;
  }>();

  title = '';
  subtitle = '';
  body = '';
  image: File | string | null = null;
  backgroundImage: File | string | null = null;
  portraitImage: File | string | null = null;
  private imagePreviewUrl: string | null = null;
  private backgroundPreviewUrl: string | null = null;
  private portraitPreviewUrl: string | null = null;

  fontMap = fontMap;

  ngOnChanges(): void {
    if (!this.page) return;
    this.loadExisting();
  }

  ngOnDestroy(): void {
    this.resetPreviewUrls();
  }

  get selectedThemeColors(): string[] {
    const theme = this.colorThemes.find(t => t.id === this.builderState?.colorTheme);
    return theme
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
  }

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

  get previewImage(): string {
    if (this.imagePreviewUrl) return this.imagePreviewUrl;
    if (typeof this.image === 'string') return this.image;
    const existing = this.getExistingImage();
    if (existing) return existing;
    return 'assets/images/exampleImage.png';
  }

  get previewBackgroundImage(): string {
    if (this.backgroundPreviewUrl) return this.backgroundPreviewUrl;
    if (typeof this.backgroundImage === 'string') return this.backgroundImage;
    const existing = this.getExistingImage('background');
    if (existing) return existing;
    return 'assets/images/exampleImage.png';
  }

  get previewPortraitImage(): string {
    if (this.portraitPreviewUrl) return this.portraitPreviewUrl;
    if (typeof this.portraitImage === 'string') return this.portraitImage;
    const existing = this.getExistingImage('portrait');
    if (existing) return existing;
    return this.previewBackgroundImage;
  }

  get isAboutPage(): boolean {
    return this.page?.id === 'about';
  }

  get aboutSectionTitle(): string {
    return this.page?.name ? `Over ${this.page.name.toLowerCase()}` : 'Over mij';
  }

  get bodyColumns(): [string, string] {
    return this.splitBodyIntoColumns(this.body);
  }

  onFileChange(event: Event, type: 'default' | 'background' | 'portrait' = 'default'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (type === 'background') {
      this.backgroundImage = file;
      this.setPreviewUrl(file, 'background');
      return;
    }
    if (type === 'portrait') {
      this.portraitImage = file;
      this.setPreviewUrl(file, 'portrait');
      return;
    }
    this.image = file;
    this.setPreviewUrl(file, 'default');
  }

  close(): void {
    this.dismiss.emit();
  }

  onSave(): void {
    if (!this.page) return;
    this.save.emit({
      pageId: this.page.id,
      title: this.title.trim(),
      subtitle: this.subtitle.trim(),
      body: this.body.trim(),
      image: this.image,
      backgroundImage: this.backgroundImage,
      portraitImage: this.portraitImage
    });
  }

  private loadExisting(): void {
    if (!this.page) return;
    const key = `page_${this.page.id}_text`;
    const entry = this.builderState?.uploads?.[key];
    if (entry?.kind === 'inline' && entry.value) {
      this.title = entry.value.title ?? '';
      this.subtitle = entry.value.subtitle ?? '';
      this.body = entry.value.body ?? '';
    } else {
      this.title = '';
      this.subtitle = '';
      this.body = '';
    }

    this.image = this.builderState?.uploads?.[`page_${this.page.id}_image`] ?? null;
    this.backgroundImage = this.builderState?.uploads?.[`page_${this.page.id}_background_image`] ?? null;
    this.portraitImage = this.builderState?.uploads?.[`page_${this.page.id}_portrait_image`] ?? null;

    this.resetPreviewUrls();

    if (this.image instanceof File) {
      this.setPreviewUrl(this.image, 'default');
    }
    if (this.backgroundImage instanceof File) {
      this.setPreviewUrl(this.backgroundImage, 'background');
    }
    if (this.portraitImage instanceof File) {
      this.setPreviewUrl(this.portraitImage, 'portrait');
    }
  }

  private getExistingImage(type: 'default' | 'background' | 'portrait' = 'default'): string | null {
    if (!this.page) return null;
    const key =
      type === 'background'
        ? `page_${this.page.id}_background_image`
        : type === 'portrait'
          ? `page_${this.page.id}_portrait_image`
          : `page_${this.page.id}_image`;
    const stored = this.builderState?.uploads?.[key];
    return typeof stored === 'string' ? stored : null;
  }

  private setPreviewUrl(file: File, type: 'default' | 'background' | 'portrait'): void {
    this.resetPreviewUrl(type);
    const url = URL.createObjectURL(file);
    if (type === 'background') {
      this.backgroundPreviewUrl = url;
      return;
    }
    if (type === 'portrait') {
      this.portraitPreviewUrl = url;
      return;
    }
    this.imagePreviewUrl = url;
  }

  private resetPreviewUrls(): void {
    this.resetPreviewUrl('default');
    this.resetPreviewUrl('background');
    this.resetPreviewUrl('portrait');
  }

  private resetPreviewUrl(type: 'default' | 'background' | 'portrait'): void {
    const current =
      type === 'background'
        ? this.backgroundPreviewUrl
        : type === 'portrait'
          ? this.portraitPreviewUrl
          : this.imagePreviewUrl;

    if (current) {
      URL.revokeObjectURL(current);
    }

    if (type === 'background') {
      this.backgroundPreviewUrl = null;
      return;
    }
    if (type === 'portrait') {
      this.portraitPreviewUrl = null;
      return;
    }
    this.imagePreviewUrl = null;
  }

  private splitBodyIntoColumns(value: string): [string, string] {
    const fallback =
      'Vertel hier in een paar zinnen wie je bent, waar je voor staat en waarom bezoekers juist met jou willen werken.';
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
