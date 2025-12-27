import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { FormsModule } from '@angular/forms'; 
import { fontMap } from '../../shared/fonts';

@Component({
  selector: 'app-font-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './font-step.html',
  styleUrl: './font-step.css'
})
export class FontStep {
  @Input() builderState!: BuilderState;
  @Input() userSampleText: string = '';
  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() userSampleTextChange = new EventEmitter<string>();

  fontVariants = [
    { id: 'dm-sans', name: 'DM Sans', sample: 'Strak en modern' },
    { id: 'inter', name: 'Inter', sample: 'Simpel en helder' },
    { id: 'lora', name: 'Lora', sample: 'Warm en literair' },
    { id: 'manrope', name: 'Manrope', sample: 'Minimalistisch en helder' },
    { id: 'merriweather', name: 'Merriweather', sample: 'Klassiek en leesbaar' },
    { id: 'montserrat', name: 'Montserrat', sample: 'Vet en opvallend' },
    { id: 'oswald', name: 'Oswald', sample: 'Sterk en karaktervol' },
    { id: 'playfair', name: 'Playfair Display', sample: 'Elegant en verfijnd' },
    { id: 'poppins', name: 'Poppins', sample: 'Modern en vriendelijk' },
    { id: 'raleway', name: 'Raleway', sample: 'Licht en stijlvol' },
    { id: 'roboto', name: 'Roboto', sample: 'Geometrisch en betrouwbaar' },
    { id: 'space-grotesk', name: 'Space Grotesk', sample: 'Technisch en scherp' }
  ] as const;

  selectionTarget: 'headings' | 'body' = 'headings';


  updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }

  private getFontName(variantId: string | null): string {
    if (!variantId) return '—';
    return this.fontVariants.find(variant => variant.id === variantId)?.name ?? variantId;
  }

  get headingVariantId(): string | null {
    return (this.builderState.headingFontVariant ?? this.builderState.fontVariant ?? null) as string | null;
  }

  get bodyVariantId(): string | null {
    return (this.builderState.bodyFontVariant ?? this.builderState.fontVariant ?? null) as string | null;
  }

  get headingName(): string {
    return this.getFontName(this.headingVariantId);
  }

  get bodyName(): string {
    return this.getFontName(this.bodyVariantId);
  }

  isSelected(variantId: string): boolean {
    return (this.selectionTarget === 'headings' ? this.headingVariantId : this.bodyVariantId) === variantId;
  }

  isHeadingSelected(variantId: string): boolean {
    return this.headingVariantId === variantId;
  }

  isBodySelected(variantId: string): boolean {
    return this.bodyVariantId === variantId;
  }

  setTarget(target: 'headings' | 'body') {
    this.selectionTarget = target;
  }

  onSelectVariant(variantId: string) {
    const currentHeading = this.headingVariantId;
    const currentBody = this.bodyVariantId;

    if (this.selectionTarget === 'headings') {
      const nextHeading = variantId as BuilderState['headingFontVariant'];
      const nextBody = (currentBody ?? variantId) as BuilderState['bodyFontVariant'];
      this.update.emit({
        headingFontVariant: nextHeading,
        bodyFontVariant: nextBody,
        fontVariant: nextBody as BuilderState['fontVariant'],
        fontSample: this.userSampleText
      });
      return;
    }

    const nextBody = variantId as BuilderState['bodyFontVariant'];
    const nextHeading = (currentHeading ?? variantId) as BuilderState['headingFontVariant'];
    this.update.emit({
      headingFontVariant: nextHeading,
      bodyFontVariant: nextBody,
      fontVariant: nextBody as BuilderState['fontVariant'],
      fontSample: this.userSampleText
    });
  }

  public fontMap = fontMap;
}
