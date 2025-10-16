import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { CardComponent } from '../ui/card/card';
import { CardHeader } from '../ui/card/card-header';
import { CardTitle } from '../ui/card/card-title';
import { CardContent } from '../ui/card/card-content';
import { Label } from '../ui/label/label';
import { LucideAngularModule } from 'lucide-angular';

interface PageOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  required?: boolean;
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
    Label,
    LucideAngularModule,
  ],
  templateUrl: './content-step.html',
  styleUrl: './content-step.css',
})
export class ContentStep {
  @Input() builderState!: BuilderState;
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  // publieke lijst van beschikbare pagina's (component beheert data)
  availablePages: PageOption[] = [
    { id: 'home', name: 'Home', description: 'Main landing page', icon: 'home', required: true },
    { id: 'about', name: 'About', description: 'Tell your story', icon: 'info' },
    { id: 'blog', name: 'Blog', description: 'Share your thoughts', icon: 'file-text' },
    { id: 'contact', name: 'Contact', description: 'Get in touch', icon: 'mail' },
  ];

  /** Toggle logica zoals React onTogglePage */
  togglePage(pageId: string) {
    const isSelected = this.builderState.pages.includes(pageId);
    const maxReached = this.builderState.pages.length >= 4 && !isSelected;
    if (maxReached) return;

    let updatedPages = this.builderState.pages;
    if (isSelected) updatedPages = updatedPages.filter((p) => p !== pageId);
    else updatedPages = [...updatedPages, pageId];

    this.update.emit({ pages: updatedPages });
  }

  isSelected(pageId: string): boolean {
    return this.builderState.pages.includes(pageId);
  }

  isDisabled(page: PageOption): boolean {
    return page.required || (this.builderState.pages.length >= 4 && !this.isSelected(page.id));
  }
}
