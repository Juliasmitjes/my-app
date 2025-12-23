import { Component, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { Progress } from '../../components/progress/progress';
import { LayoutStep } from '../../components/layout-step/layout-step';
import { ColorStep } from '../../components/color-step/color-step';
import { FontStep } from '../../components/font-step/font-step';
import { NavigationStep } from '../../components/navigation-step/navigation-step';
import { ContentStep, PageDef } from '../../components/content-step/content-step';
import { PreviewStep } from '../../components/preview-step/preview-step';
import { PreviewPanel } from '../../components/preview-panel/preview-panel';
import { Button } from '../../components/ui/button/button';

import { BuilderState } from '../../types/builder-state';

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
    PreviewPanel,
    Button,
    TitleCasePipe
  ],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services {

  /* ───── STAPPEN ───── */

  readonly steps: string[] = [
    'layout',
    'kleuren',
    'lettertype',
    'navigatie',
    'content',
    'resultaat'
  ] as const;

  readonly currentStep = signal<number>(0);
  readonly currentStepOneBased = computed(() => this.currentStep() + 1);

  readonly showPreviewPanel = signal<boolean>(false);

  /* ───── BUILDER STATE ───── */

  readonly builderState = signal<BuilderState>({
    layout: undefined,
    colorTheme: undefined,
    fontVariant: undefined,
    fontSample: undefined,
    logo: '',
    navigation: undefined,
    headerStyle: 'fixed',
    pages: ['home'],
    uploads: {}
  });

  /* ───── COLOR THEMES ───── */

  readonly colorThemes = signal([
    {
      id: 'warm',
      name: 'Warm',
      description: 'Zonnig en energiek met rode tinten',
      colors: ['#F7F3F2','#09122C','#872341','#BE3144','#E17564','#3E1B3C','#5D2A4A','#FFFFFF','#E17564','#4A1F39'],
    },
    {
      id: 'light',
      name: 'Licht',
      description: 'Fris en helder met zachte pastelkleuren',
      colors: ['#F5EFE6','#E8DFCA','#6D94C5','#FFFFFF','#D6CBB6','#CBDCEB','#4A5870','#EEF4F9','#6D94C5','#D4E0EA'],
    },
    {
      id: 'dark',
      name: 'Donker',
      description: 'Diep en stijlvol met luxe accenten',
      colors: ['#F2F1EE','#393E46','#948979','#FFFFFF','#DFD0B8','#71706d','#2E3237','#F7F5F1','#948979','#D9D2C6'],
    },
    {
      id: 'cool',
      name: 'Koel',
      description: 'Fris en modern met blauwe tonen',
      colors: ['#F2EFE7','#9ACBD0','#48A6A7','#FFFFFF','#DDE3DE','#6e9c9d','#006A71','#EFF4F3','#48A6A7','#D2E3E4'],
    },
    {
      id: 'earth',
      name: 'Aards',
      description: 'Natuurlijke tinten voor een rustige uitstraling',
      colors: ['#FAF7F3','#F2ECE6','#5A3E36','#FFFFFF','#E4D8CF','#b39583','#6A4C42','#EEE4DC','#5A3E36','#DACDC3'],
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Levendig en speels met opvallende kleuren',
      colors: ['#FFF7F2','#FADFA1','#C96868','#FFFFFF','#FFEBD4','#e19a9a','#7EACB5','#FFF3E6','#C96868','#F1DED7'],
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Diep en verfrissend als de zee',
      colors: ['#F6F8F5','#4F959D','#205781','#FFFFFF','#D2E7E5','#8cb6b2','#98D2C0','#F4FAF9','#205781','#D9ECEB'],
    },
    {
      id: 'sunset',
      name: 'Zonsondergang',
      description: 'Warm en dromerig met roze en perzik',
      colors: ['#FFF9F7','#FFB4A2','#FFCDB2','#FFFFFF','#FFE7E4','#fbb3aa','#8C5C82','#FFF5F4','#FFB4A2','#F9E6E8'],
    }
  ]);

  /* ───── CONTENT PAGES ───── */

  readonly availablePages: PageDef[] = [
    { id: 'home', name: 'Home', description: 'Hoofdpagina', required: true, icon: 'house' },
    { id: 'about', name: 'Over', description: 'Vertel jouw verhaal', icon: 'info' },
    { id: 'blog', name: 'Blog', description: 'Nieuws of artikelen', icon: 'file-text' },
    { id: 'contact', name: 'Contact', description: 'Neem contact op', icon: 'mail' },
    { id: 'diensten', name: 'Diensten', description: 'Wat je aanbiedt', icon: 'briefcase' },
    { id: 'portfolio', name: 'Portfolio', description: 'Projecten of werk', icon: 'image' },
    { id: 'team', name: 'Team', description: 'Voorstellen', icon: 'users' },
    { id: 'faq', name: 'FAQ', description: 'Veelgestelde vragen', icon: 'message-circle' },
    { id: 'reviews', name: 'Reviews', description: 'Wat anderen zeggen', icon: 'star' }
  ];

  /* ───── PREVIEW PANEL ───── */

  openPreviewPanel(): void {
    this.showPreviewPanel.set(true);
  }

  closePreviewPanel(): void {
    this.showPreviewPanel.set(false);
  }

  togglePreviewPanel(): void {
    this.showPreviewPanel.update(v => !v);
  }

  /* ───── STATE UPDATES ───── */

  updateState(update: Partial<BuilderState>): void {
    this.builderState.update(prev => ({ ...prev, ...update }));
  }

  togglePage(pageId: string): void {
  this.builderState.update(prev => {
    const currentPages = prev.pages ?? ['home'];

    const pages = currentPages.includes(pageId)
      ? currentPages.filter(p => p !== pageId)
      : [...currentPages, pageId];

    return pages.length <= 4
      ? { ...prev, pages }
      : prev;
  });
}

  /* ───── VALIDATIE PER STAP ───── */

  readonly canProceed = computed<boolean>(() => {
    const step = this.currentStep();
    const state = this.builderState();
    const hasUploads = !!state.uploads && Object.keys(state.uploads).length > 0;

    switch (step) {
      case 0: return !!state.layout && state.layoutLocked === true && hasUploads && !!state.contentSaved;
      case 1: return !!state.colorTheme;
      case 2: return !!state.fontVariant;
      case 3: return !!state.navigation;
      case 4: return Array.isArray(state.pages) && state.pages.length > 0;
      default: return false;
    }
  });

  /* ───── NAVIGATIE ───── */

  nextStep(): void {
    if (!this.canProceed()) return;

    const max = this.steps.length - 1;
    this.currentStep.update(s => (s < max ? s + 1 : s));

    this.scrollToContentOnMobile();
  }

  prevStep(): void {
    this.currentStep.update(s => (s > 0 ? s - 1 : s));
    this.scrollToContentOnMobile();
  }

  private scrollToContentOnMobile(): void {
    if (window.innerWidth < 768) {
      document
        .getElementById('contentSection')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
