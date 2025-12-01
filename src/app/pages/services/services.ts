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
      colors: ['#FAE4D0', '#D76A2A', '#FFFFFF', '#E9B384', '#E19B63', '#E7B48A', '#C9652A', '#E87536', '#FFFFFF', '#D46B2C'],
    },
    {
      id: 'light',
      name: 'Licht',
      description: 'Fris en helder met zachte pastelkleuren',
      colors: [  '#E6F5EC', '#D9EAF7', '#2f3b32', '#EBDCF9', '#D8CFF0', '#F0E6FA', '#2e2e38', '#E2F7F1' , '#2f3b32', '#EADAF5'  ],  
     },
    {
      id: 'dark',
      name: 'Donker',
      description: 'Diep en stijlvol met luxe accenten',
      colors: ['#2A2F36', '#3E4A5C', '#1A1A1A', '#4B3A5E', '#3D2F54', '#2F3B32', '#4A3F6B', '#35524A', '#1A1A1A', '#3C2F5C'  ],
    },
    {
      id: 'cool',
      name: 'Koel',
      description: 'Rustig en modern met blauwe en paarse tonen',
      colors: ['#5A9BD5', '#90A4AE', '#D9EAF7' ],

    },
    {
      id: 'earth',
      name: 'Aards',
      description: 'Natuurlijke tinten voor een rustige uitstraling',
      colors: ['#8D6E63', '#A1887F', '#C5A880'],
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Levendig en speels met opvallende kleuren',
      colors: ['#FF4081', '#7C4DFF', '#448AFF'],
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Diep en verfrissend als de zee',
      colors: ['#00796B', '#0097A7', '#80CBC4'],
    },
    {
      id: 'sunset',
      name: 'Zonsondergang',
      description: 'Warm en dromerig met roze en perzik',
      colors: ['#FF9A8B', '#FF6A88', '#FF99AC'],
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