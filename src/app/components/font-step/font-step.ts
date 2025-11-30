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
  // --- Modern ---
  { id: 'inter', name: 'Inter', sample: 'Strak en modern' },
  { id: 'roboto', name: 'Roboto', sample: 'Geometrisch en vriendelijk' },
  { id: 'raleway', name: 'Raleway', sample: 'Modern en licht' },

  // --- Klassiek---
  { id: 'merriweather', name: 'Merriweather', sample: 'Klassiek en leesbaar' },
  { id: 'playfair', name: 'Playfair Display', sample: 'Elegant en verfijnd' },
  { id: 'lora', name: 'Lora', sample: 'Warm en literair' },

  // --- Opvallend ---
  { id: 'montserrat', name: 'Montserrat', sample: 'Vet en opvallend' },
  { id: 'oswald', name: 'Oswald', sample: 'Sterk en karaktervol' },
] as const;


  updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }

  isSelected(variantId: string): boolean {
    return (
      this.builderState.fontVariant === variantId
    );
  }

  onSelectVariant(variantId: string) {
  this.update.emit({
    fontVariant: variantId as BuilderState['fontVariant'],
    fontSample: this.userSampleText   
  });
  }

  public fontMap = fontMap;
}
