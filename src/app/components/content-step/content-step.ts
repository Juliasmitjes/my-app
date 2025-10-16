// content-step.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { CardComponent } from '../ui/card/card';
import { CardHeader } from '../ui/card/card-header';
import { CardTitle } from '../ui/card/card-title';
import { CardContent } from '../ui/card/card-content';
import { LucideAngularModule } from 'lucide-angular';

export interface PageDef {
  id: string;
  name: string;
  description?: string;
  required?: boolean;
  icon?: string; // optioneel: lucide icon name
}

@Component({
  selector: 'app-content-step',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeader,
    CardTitle,
    CardContent,
    LucideAngularModule,
  ],
  templateUrl: './content-step.html',
  styleUrl: './content-step.css'
})
export class ContentStep {
  @Input() builderState?: BuilderState;
  @Input() contents: PageDef[] = []; // verwacht gestructureerde items
  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() toggle = new EventEmitter<string>();

  // Veilige accessor: garandeer altijd een array (minimaal ['home'])
  get pages(): string[] {
    return this.builderState?.pages ?? ['home'];
  }

  // Toggle of add/remove pagina; respecteer required en limiet (max 4 totaal)
  onSelectPage(pageId: string, required = false) {
    if (!this.builderState) return;
    if (required) return; // verplicht, kan niet worden uitgevinkt

    const isSelected = this.pages.includes(pageId);

    if (isSelected) {
      const newPages = this.pages.filter(p => p !== pageId);
      this.update.emit({ pages: newPages });
      this.toggle.emit(pageId);
      return;
    }

    if (this.pages.length >= 4) return;

    const newPages = [...this.pages, pageId];
    this.update.emit({ pages: newPages });
    this.toggle.emit(pageId);
  }
}