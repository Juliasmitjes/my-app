import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { CardComponent } from '../ui/card/card';
import { CardHeader } from '../ui/card/card-header';
import { CardTitle } from '../ui/card/card-title';
import { CardContent } from '../ui/card/card-content';
import { Label } from '../ui/label/label';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-content-step',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeader,
    CardTitle,
    CardContent,
    Label,
    LucideAngularModule,
  ],
  templateUrl: './content-step.html',
  styleUrl: './content-step.css'
})
export class ContentStep {
  @Input() builderState?: BuilderState;
  @Input() contents: string[] = []; // verwacht bv ['about','blog','contact']
  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() toggle = new EventEmitter<string>();

  get pages(): string[] {
    return this.builderState?.pages ?? ['home'];
  }

  onSelectPage(page: string) {
    if (!this.builderState) return;

    const isSelected = this.pages.includes(page);

    if (page === 'home') return;

    if (isSelected) {
      const newPages = this.pages.filter(p => p !== page);
      this.update.emit({ pages: newPages });
      this.toggle.emit(page);
      return;
    }

    if (this.pages.length >= 4) return;

    const newPages = [...this.pages, page];
    this.update.emit({ pages: newPages });
    this.toggle.emit(page);
  }
}