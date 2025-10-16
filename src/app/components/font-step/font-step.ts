import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionCard } from '../ui/option-card/option-card';
import { BuilderState } from '../../types/builder-state';

@Component({
  selector: 'app-font-step',
  standalone: true,
  imports: [CommonModule, OptionCard],
  templateUrl: './font-step.html',
  styleUrl: './font-step.css'
})
export class FontStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  fontStyles = [
    {
      id: 'modern-sans',
      name: 'Modern Sans',
      variants: [
        { id: 'inter', name: 'Inter', sample: 'Clean and modern' },
        { id: 'roboto', name: 'Roboto', sample: 'Geometric and friendly' },
      ],
    },
    {
      id: 'classic-serif',
      name: 'Classic Serif',
      variants: [
        { id: 'merriweather', name: 'Merriweather', sample: 'Traditional elegance' },
        { id: 'playfair', name: 'Playfair Display', sample: 'High-contrast style' },
      ],
    },
    {
      id: 'display',
      name: 'Display',
      variants: [
        { id: 'montserrat', name: 'Montserrat', sample: 'Urban and bold' },
        { id: 'oswald', name: 'Oswald', sample: 'Condensed impact' },
      ],
    },
  ];

  updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }

  isSelected(styleId: string, variantId: string): boolean {
    return (
      this.builderState.fontStyle === styleId &&
      this.builderState.fontVariant === variantId
    );
  }
}
