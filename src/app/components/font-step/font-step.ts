import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-font-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './font-step.html',
  styleUrl: './font-step.css'
})
export class FontStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();

 fontStyles = [
  {
    id: 'modern-sans',
    name: 'Moderne Sans',
    description: 'Strakke en eigentijdse lettertypen, perfect voor moderne merken.',
    variants: [
      {
        id: 'inter',
        name: 'Inter',
        sample: 'Strak en modern',
        preview: 'Inter is helder en veelzijdig — ideaal voor een moderne, toegankelijke uitstraling.',
      },
      {
        id: 'roboto',
        name: 'Roboto',
        sample: 'Geometrisch en vriendelijk',
        preview: 'Roboto combineert strak design met een warme uitstraling. Populair op het web.',
      },
    ],
  },
  {
    id: 'classic-serif',
    name: 'Klassieke Serif',
    description: 'Tijdloze lettertypen met karakter en elegantie.',
    variants: [
      {
        id: 'merriweather',
        name: 'Merriweather',
        sample: 'Klassiek en leesbaar',
        preview: 'Merriweather straalt vertrouwen en traditie uit — perfect voor langere teksten.',
      },
      {
        id: 'playfair',
        name: 'Playfair Display',
        sample: 'Elegant en verfijnd',
        preview: 'Playfair Display is sierlijk en stijlvol — ideaal voor luxe en creatieve merken.',
      },
    ],
  },
  {
    id: 'display',
    name: 'Display',
    description: 'Gedurfde en expressieve lettertypen die opvallen.',
    variants: [
      {
        id: 'montserrat',
        name: 'Montserrat',
        sample: 'Vet en opvallend',
        preview: 'Montserrat geeft een stedelijke, eigentijdse uitstraling — perfect voor koppen.',
      },
      {
        id: 'oswald',
        name: 'Oswald',
        sample: 'Sterk en karaktervol',
        preview: 'Oswald is compact en krachtig — ideaal voor merken met lef.',
      },
    ],
  },
] as const;

  updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }

  isSelected(styleId: string, variantId: string): boolean {
    return (
      this.builderState.fontStyle === styleId &&
      this.builderState.fontVariant === variantId
    );
  }

  onSelectVariant(styleId: string, variantId: string) {
  this.update.emit({
    fontStyle: styleId as BuilderState['fontStyle'],
    fontVariant: variantId as BuilderState['fontVariant'],
    fontSample: this.userSampleText   // ⬅ NIEUW
  });
  }

  userSampleText: string = '';
}
