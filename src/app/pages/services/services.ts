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
      description: 'Zonnig en energiek met rode tinten',
      colors: ['#F7F3F2','#09122C', '#872341', '#BE3144', '#E17564', '#3E1B3C', '#5D2A4A', '#FFFFFF', , '#E17564', '#4A1F39'],
    },
    {
      id: 'light',
      name: 'Licht',
      description: 'Fris en helder met zachte pastelkleuren',
      colors: ['#F5EFE6', '#E8DFCA', '#6D94C5', '#FFFFFF', '#D6CBB6', '#CBDCEB', '#4A5870', '#EEF4F9', '#6D94C5', '#D4E0EA'],
     },
    {
      id: 'dark',
      name: 'Donker',
      description: 'Diep en stijlvol met luxe accenten',
      colors: ["#F2F1EE","#393E46","#948979","#FFFFFF","#DFD0B8","#E8E2D5","#2E3237","#F7F5F1","#948979","#D9D2C6"],
    },
    {
      id: 'cool',
      name: 'Koel',
      description: 'Fris en modern met blauwe tonen',
      colors: ["#F2EFE7","#9ACBD0","#48A6A7","#FFFFFF","#DDE3DE","#CFE7E8","#006A71","#EFF4F3","#48A6A7","#D2E3E4"],
    },
    {
      id: 'earth',
      name: 'Aards',
      description: 'Natuurlijke tinten voor een rustige uitstraling',
      colors: ['#FAF7F3', '#F2ECE6', '#5A3E36', '#FFFFFF', '#E4D8CF', '#D4C3B9', '#6A4C42', '#EEE4DC', '#5A3E36', '#DACDC3'],
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Levendig en speels met opvallende kleuren',
      colors:["#FFF7F2","#FADFA1","#C96868","#FFFFFF","#FFEBD4","#F4D7D7","#7EACB5","#FFF3E6","#C96868","#F1DED7"],
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Diep en verfrissend als de zee',
      colors:["#F6F8F5","#4F959D","#205781","#FFFFFF","#D2E7E5","#E8F3F2","#98D2C0","#F4FAF9","#205781","#D9ECEB"],
    },
    {
      id: 'sunset',
      name: 'Zonsondergang',
      description: 'Warm en dromerig met roze en perzik',
      colors: ["#FFF9F7","#FFB4A2","#FFCDB2","#FFFFFF","#FFE7E4","#FDEDEB","#8C5C82","#FFF5F4","#FFB4A2","#F9E6E8"]
    ,
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