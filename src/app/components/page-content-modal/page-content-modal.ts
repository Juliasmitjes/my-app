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
  }>();

  title = '';
  subtitle = '';
  body = '';
  image: File | string | null = null;
  private imagePreviewUrl: string | null = null;

  fontMap = fontMap;

  ngOnChanges(): void {
    if (!this.page) return;
    this.loadExisting();
  }

  ngOnDestroy(): void {
    this.resetPreviewUrl();
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.image = file;
    this.setPreviewUrl(file);
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
      image: this.image
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
    this.resetPreviewUrl();
    if (this.image instanceof File) {
      this.setPreviewUrl(this.image);
    }
  }

  private getExistingImage(): string | null {
    if (!this.page) return null;
    const stored = this.builderState?.uploads?.[`page_${this.page.id}_image`];
    return typeof stored === 'string' ? stored : null;
  }

  private setPreviewUrl(file: File): void {
    this.resetPreviewUrl();
    this.imagePreviewUrl = URL.createObjectURL(file);
  }

  private resetPreviewUrl(): void {
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
      this.imagePreviewUrl = null;
    }
  }
}
