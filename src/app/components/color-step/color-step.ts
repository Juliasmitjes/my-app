import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { OptionCard } from '../ui/option-card/option-card';

export type ColorTheme = 'warm' | 'light' | 'dark' | 'cool';

export interface ThemeDef {
  id: ColorTheme;
  name: string;
  colors: string[];
  gradient?: string;
}

@Component({
  selector: 'app-color-step',
  standalone: true,
  imports: [CommonModule, OptionCard],
  templateUrl: './color-step.html',
  styleUrl: './color-step.css'
})
export class ColorStep {
  @Input() builderState!: BuilderState;
  @Input() themes: ThemeDef[] = [];

  @Output() update = new EventEmitter<Partial<BuilderState>>();

  updateState(updates: Partial<BuilderState>) {
    this.update.emit(updates);
  }

  onSelectTheme(id: ColorTheme) {
    this.updateState({ colorTheme: id });
  }
}