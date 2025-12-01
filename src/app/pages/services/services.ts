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
import { Button } from '../../components/ui/button/button';

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
    PreviewPanel,
    Button
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
    {
      id: 'warm',
      name: 'Warm',
      description: 'Zonnig en energiek met oranje en gouden tinten',
      colors: ['#fff7ed', '#fed7aa', '#ea580c', '#ffedd5', '#fdba74', '#f97316', '#7c2d12', '#ffe0b2', '#ea580c', '#ffb74d'],
    },
    {
      id: 'light',
      name: 'Licht',
      description: 'Fris en helder met zachte pastelkleuren',
      colors: ['#fdfaf6', '#e6ddc6', '#4a7c59', '#d9cbb2', '#b6a28e', '#8fb996', '#3a4a3f', '#f5f0e8', '#4a7c59', '#cbbf9d'],  
     },
    {
      id: 'dark',
      name: 'Donker',
      description: 'Diep en stijlvol met luxe accenten',
      colors: ['#fafafa', '#e5e5e5', '#374151', '#f3f4f6', '#d1d5db', '#9ca3af', '#1f2937', '#eeeeee', '#374151', '#bdbdbd'],
    },
    {
      id: 'cool',
      name: 'Koel',
      description: 'Rustig en modern met blauwe en paarse tonen',
      colors: ['#f0f9ff', '#e0f2fe', '#1e3a8a', '#dbeafe', '#93c5fd', '#3b82f6', '#1e40af', '#e3f2fd', '#1e3a8a', '#64b5f6'],
    },
    {
      id: 'earth',
      name: 'Aards',
      description: 'Natuurlijke tinten voor een rustige uitstraling',
      colors: ['#fdfaf6', '#e6ccb2', '#7f5539', '#ede0d4', '#ddb892', '#b08968', '#5e503f', '#f5ebe0', '#7f5539', '#c19a6b'],
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Levendig en speels met opvallende kleuren',
      colors: ['#fff9c4', '#ffcc80', '#43a047', '#f48fb1', '#64b5f6', '#ff7043', '#6a1b9a', '#c8e6c9', '#1e88e5', '#ffb300'],
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Diep en verfrissend als de zee',
      colors:['#fef9f4', '#d6e2de', '#2a9d8f', '#e9ece6', '#a8dadc', '#457b9d', '#264653', '#f1faee', '#e76f51', '#ffb703'],
    },
    {
      id: 'sunset',
      name: 'Zonsondergang',
      description: 'Warm en dromerig met roze en perzik',
      colors: ['#fff0f6', '#fbcfe8', '#be185d', '#fde2e4', '#f9bec7', '#f06292', '#7a1f3d', '#f8bbd0', '#be185d', '#f48fb1'],
    },
  ]);

  availablePages: PageDef[] = [
    { id: 'home', name: 'Home', description: 'Hoofdpagina van de website', required: true, icon: 'house' },
    { id: 'about', name: 'Over', description: 'Vertel jouw verhaal', icon: 'info' },
    { id: 'blog', name: 'Blog', description: 'Deel berichten of nieuws', icon: 'file-text' },
    { id: 'contact', name: 'Contact', description: 'Neem contact op', icon: 'mail' },
    { id: 'diensten', name: 'Diensten', description: 'Wat je aanbiedt of doet', icon: 'briefcase' },
    { id: 'portfolio', name: 'Portfolio', description: 'Laat jouw werk of projecten zien', icon: 'image' },
    { id: 'team', name: 'Team', description: 'Stel het team voor', icon: 'users' },
    { id: 'faq', name: 'FAQ', description: 'Veelgestelde vragen', icon: 'MessageCircleQuestionMark' },
    { id: 'reviews', name: 'Reviews', description: 'Wat anderen over je zeggen', icon: 'star' },
    { id: 'galerij', name: 'Galerij', description: 'Een overzicht van foto’s of media', icon: 'camera' },
    { id: 'evenementen', name: 'Evenementen', description: 'Toon aankomende activiteiten', icon: 'calendar' },
    { id: 'shop', name: 'Shop', description: 'Verkoop producten of tickets', icon: 'ShoppingCart' },
    { id: 'donatie', name: 'Donatie', description: 'Ondersteun je initiatief', icon: 'heart' },
    { id: 'nieuwsbrief', name: 'Nieuwsbrief', description: 'Laat bezoekers zich inschrijven', icon: 'send' },
  ];

  readonly builderState = signal<BuilderState>({
    layout: null,
    colorTheme: null,
    fontStyle: null,
    fontVariant: null,
    fontSample: null,
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

  // Stap-specifieke validatie op basis van builderState
  get canProceed(): boolean {
    const step = this.currentStep();
    const max = this.steps.length - 1;

    if (step === max) return false; // laatste stap: geen volgende

    const state = this.builderState();

    switch (step) {
      case 0: // Layout
        return !!state.layout;
      case 1: // Kleuren
        return !!state.colorTheme;
      case 2: // Lettertype
        return !!state.fontVariant;
      case 3: // Navigatie
        return !!state.navigation;
      case 4: // Content
        return Array.isArray(state.pages) && state.pages.length > 0;
      default:
        return true;
    }
  }

 nextStep() {
  if (!this.canProceed) return;
  const max = this.steps.length - 1;
  this.currentStep.update(n => (n < max ? n + 1 : n));

  // Scroll naar header op mobiel
  if (window.innerWidth < 768) {
    const section =  document.getElementById('contentSection');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

prevStep() {
  this.currentStep.update(n => (n > 0 ? n - 1 : n));

  if (window.innerWidth < 768) {
    const section =  document.getElementById('contentSection');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

  togglePage(page: string) {
    this.builderState.update(prev => {
      const pages = prev.pages.includes(page) ? prev.pages.filter(p => p !== page) : [...prev.pages, page];
      return pages.length <= 4 ? { ...prev, pages } : prev;
    });
  }
}