import { Component, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Progress } from '../../components/progress/progress';
import { LayoutStep } from '../../components/layout-step/layout-step';
import { ColorStep } from '../../components/color-step/color-step';
import { FontStep } from '../../components/font-step/font-step';
import { NavigationStep } from '../../components/navigation-step/navigation-step';
import { ContentStep, PageDef } from '../../components/content-step/content-step';
import { PreviewStep } from '../../components/preview-step/preview-step';
import { BuilderState } from '../../types/builder-state';
import { PreviewPanel } from '../../components/preview-panel/preview-panel';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    Progress,
    LayoutStep,
    ColorStep,
    FontStep,
    NavigationStep,
    ContentStep,
    PreviewStep,
    TitleCasePipe,
    PreviewPanel
  ],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services {
  readonly steps = ['Layout', 'Kleuren', 'Lettertype', 'Navigatie', 'Content', 'Resultaat'];

  readonly currentStep = signal(0);
  readonly currentStepOneBased = computed(() => this.currentStep() + 1);
  readonly showPreviewPanel = signal(false);


  readonly colorThemes = signal([
    { id: 'warm', name: 'Warm', colors: ['#FF6B4A', '#FF8E73', '#FFA99C'] },
    { id: 'light', name: 'Light', colors: ['#E3F2FD', '#BBDEFB', '#90CAF9'] },
    { id: 'dark', name: 'Dark', colors: ['#424242', '#616161', '#757575'] },
    { id: 'cool', name: 'Cool', colors: ['#4FC3F7', '#29B6F6', '#03A9F4'] }
  ]);

  readonly fontOptions = signal([
    { id: 'modern-inter', category: 'Modern Sans', name: 'Inter', preview: 'Clean and modern typography' },
    { id: 'modern-roboto', category: 'Modern Sans', name: 'Roboto', preview: 'Google signature font' },
    { id: 'serif-merriweather', category: 'Classic Serif', name: 'Merriweather', preview: 'Perfect for reading' },
    { id: 'serif-playfair', category: 'Classic Serif', name: 'Playfair Display', preview: 'Elegant and sophisticated' },
    { id: 'display-montserrat', category: 'Display', name: 'Montserrat', preview: 'Bold and impactful' },
    { id: 'display-oswald', category: 'Display', name: 'Oswald', preview: 'Strong and distinctive' }
  ]);

  availablePages: PageDef[] = [
    { id: 'home', name: 'Home', description: 'Main landing page', required: true, icon: 'House' },
    { id: 'about', name: 'About', description: 'Tell your story', icon: 'info' },
    { id: 'blog', name: 'Blog', description: 'Share posts', icon: 'file-text' },
    { id: 'contact', name: 'Contact', description: 'Get in touch', icon: 'mail' },
  ];

  readonly builderState = signal<BuilderState>({
    layout: null,
    colorTheme: null,
    fontStyle: null,
    fontVariant: null,
    logo: '',
    navigation: 'top',
    headerStyle: 'fixed',
    pages: ['home']
  });

  openPreviewPanel() {
  this.showPreviewPanel.set(true);
  }

  closePreviewPanel() {
    this.showPreviewPanel.set(false);
  }

  togglePreviewPanel() {
    this.showPreviewPanel.update(v => !v);
  }

  
  updateState(updates: Partial<BuilderState>) {
    this.builderState.update(prev => ({ ...prev, ...updates }));
  }

  nextStep() {
    const max = this.steps.length - 1;
    this.currentStep.update(n => (n < max ? n + 1 : n));
  }

  prevStep() {
    this.currentStep.update(n => (n > 0 ? n - 1 : n));
  }

  // togglePage is called when ContentStep emits toggle
  togglePage(page: string) {
    this.builderState.update(prev => {
      const pages = prev.pages.includes(page) ? prev.pages.filter(p => p !== page) : [...prev.pages, page];
      return pages.length <= 4 ? { ...prev, pages } : prev;
    });
  }
}