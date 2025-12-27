// content-step.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { LucideAngularModule } from 'lucide-angular';

export interface PageDef {
  id: string;
  name: string;
  description?: string;
  required?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-content-step',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './content-step.html',
  styleUrl: './content-step.css'
})
export class ContentStep {
  @Input() builderState?: BuilderState;
  @Input() contents: PageDef[] = [];
  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() toggle = new EventEmitter<string>();

  get pages(): string[] {
    return this.builderState?.pages ?? ['home'];
  }

  get additionalPagesCount(): number {
  const count = Math.max(0, this.pages.length - 1);
  console.log('ContentStep additionalPagesCount', count, 'pages:', this.pages);
  return count;
}

isMobile = window.innerWidth < 768;

ngOnInit() {
  window.addEventListener('resize', () => {
    this.isMobile = window.innerWidth < 768;
  });
}

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

    const newPages = [...this.pages, pageId];
    this.update.emit({ pages: newPages });
    this.toggle.emit(pageId);
  }  
}
