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
      id: 'bordeaux',
      name: 'Bordeaux',
      description: 'Licht en chic met roze en bordeaux accenten',
      colors: ['#FFFFFF','#FDECEF','#4E1E2B','#FFF4F6','#F9D9E0','#E9B5C2','#3C1A24','#FCEFF3','#8B3C4C','#D89AA8'],
    },
    {
      id: 'rozenlicht',
      name: 'Rozenlicht',
      description: 'Vrolijk en zacht met frisse rozetinten',
      colors: ['#FFFFFF','#FFE8F1','#5A2A3D','#FFF2F7','#FBDCE8','#F0B7CD','#4A2232','#FFF5F9','#9A4D6B','#E3A1BB'],
    },
    {
      id: 'terracotta',
      name: 'Terracotta',
      description: 'Warm en vrolijk met perzik en terracotta',
      colors: ['#FFFFFF','#FFE7D9','#5E3423','#FFF2EA','#FDD8C6','#F0B08F','#4A2B1F','#FFF5ED','#B55A3A','#E7A07C'],
    },
    {
      id: 'zonsondergang',
      name: 'Zonsondergang',
      description: 'Kleurrijk en speels met perzik, roze en oranje',
      colors: ['#FFFFFF','#FFE4D7','#5C2C22','#FFF0E8','#FFD0B8','#FFA97E','#4A251D','#FFF3EA','#D85E3E','#F2A37B'],
    },
    {
      id: 'zonnig',
      name: 'Zonnig',
      description: 'Helder en optimistisch met geel en honing',
      colors: ['#FFFFFF','#FFF2C7','#5A4A1F','#FFF7DD','#FFE3A3','#F6C85F','#4A3A18','#FFF8E3','#B8892F','#E7BD66'],
    },
    {
      id: 'zand',
      name: 'Zand',
      description: 'Rustig en licht met beige, goud en creme',
      colors: ['#FFFFFF','#F6E9D7','#57462D','#FBF3E7','#EAD9BE','#D7BE8A','#4A3E2A','#FFF6EA','#9B7A43','#D8B77D'],
    },
    {
      id: 'bos',
      name: 'Bos',
      description: 'Fris en natuurlijk met wit, salie en hout',
      colors: ['#FFFFFF','#EAF3E6','#2F4B3A','#F4FAF1','#D9E7D1','#B7CFA7','#2A3E33','#F7FBF5','#5B7A58','#A9C19A'],
    },
    {
      id: 'mint',
      name: 'Mint',
      description: 'Licht en vrolijk met mint, aqua en creme',
      colors: ['#FFFFFF','#E6F7F1','#1F4B3D','#F2FCF8','#CDEFE5','#9FDCCB','#1E3E34','#F5FDF9','#4E8A76','#92CDBE'],
    },
    {
      id: 'aqua',
      name: 'Aqua',
      description: 'Fris en schoon met turquoise en helder blauw',
      colors: ['#FFFFFF','#E7F7FB','#1E4B53','#F2FBFD','#CFEAF2','#9AD3E2','#1E3E46','#F6FCFE','#3E7E8E','#87C2D0'],
    },
    {
      id: 'lagune',
      name: 'Lagune',
      description: 'Zacht en modern met teal en zeegroen',
      colors: ['#FFFFFF','#E5F6F4','#1E4A49','#F1FBFA','#CDE9E6','#99CFC9','#1D3D3C','#F5FCFB','#3F7C78','#86BDB7'],
    },
    {
      id: 'hemel',
      name: 'Hemel',
      description: 'Licht en ruimtelijk met blauwe pastels',
      colors: ['#FFFFFF','#E9F0FF','#1E3D6B','#F2F6FF','#D1DFF8','#A5BFEF','#1B3358','#F6F8FF','#4B6DB1','#95AEDF'],
    },
    {
      id: 'nacht',
      name: 'Nacht',
      description: 'Fris en strak met lichtblauw en navy accenten',
      colors: ['#FFFFFF','#E8EEF7','#1A2B4A','#F2F5FA','#D3DDEB','#A7B9D6','#18243A','#F6F8FB','#385A8A','#90A9CF'],
    },
    {
      id: 'inkt',
      name: 'Inkt',
      description: 'Modern en helder met indigo en lavendel',
      colors: ['#FFFFFF','#EAEAFB','#262B5A','#F2F2FF','#D7D9F4','#AEB3E6','#1F2348','#F6F6FF','#4C56A5','#9DA6D9'],
    },
    {
      id: 'schemer',
      name: 'Schemer',
      description: 'Zacht en dromerig met blauwpaars en mist',
      colors: ['#FFFFFF','#EDEEFF','#2B2F63','#F4F5FF','#D9DCF6','#B0B6EA','#252A52','#F7F8FF','#4D56A6','#9EA6D9'],
    },
    {
      id: 'amethist',
      name: 'Amethist',
      description: 'Creatief en helder met paars en lila',
      colors: ['#FFFFFF','#F1EBFF','#3B2A5F','#F7F3FF','#E0D6F8','#BFAAE8','#2F224C','#F8F4FF','#6645A8','#B4A0D9'],
    },
    {
      id: 'blush',
      name: 'Blush',
      description: 'Speels en vrolijk met roze en blush',
      colors: ['#FFFFFF','#FDE8F3','#5A2844','#FFF2F8','#F7D4E7','#E8A9C9','#4A2238','#FFF5FA','#98507A','#D89DBB'],
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

