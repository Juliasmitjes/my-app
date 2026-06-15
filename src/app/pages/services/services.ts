import { Component, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { LayoutStep } from '../../components/layout-step/layout-step';
import { ColorStep } from '../../components/color-step/color-step';
import { FontStep } from '../../components/font-step/font-step';
import { ContentStep, PageDef } from '../../components/content-step/content-step';
import { PreviewPanel } from '../../components/preview-panel/preview-panel';
import { Button } from '../../components/ui/button/button';
import { ToastService } from '../../components/ui/toast/toast.service';

import { BuilderState } from '../../types/builder-state';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    LayoutStep,
    ColorStep,
    FontStep,
    ContentStep,
    PreviewPanel,
    Button,
    TitleCasePipe
  ],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class Services {
  constructor(private toast: ToastService) {}

  /* ───── STAPPEN ───── */

  readonly steps: string[] = [
    'template',
    'upload',
    'kleuren',
    'lettertype',
    'content',
    'resultaat'
  ] as const;

  readonly currentStep = signal<number>(0);
  readonly currentStepOneBased = computed(() => this.currentStep() + 1);

  readonly showPreviewPanel = signal<boolean>(false);
  readonly hasSelectedTemplate = computed<boolean>(() => !!this.builderState().layoutConfig?.templateId);

  /* ───── BUILDER STATE ───── */

  readonly builderState = signal<BuilderState>({
    layout: undefined,
    colorTheme: undefined,
    fontVariant: undefined,
    headingFontVariant: undefined,
    bodyFontVariant: undefined,
    fontSample: undefined,
    logo: '',
    navigation: 'top',
    headerStyle: 'fixed',
    pages: ['home'],
    uploads: {}
  });

  /* ───── COLOR THEMES ───── */

  readonly colorThemes = signal([
    {
      id: 'nordic-minimalism',
      name: 'Nordic Minimalism',
      description: 'Koele grijstinten, ijsblauw en zachte houtaccenten',
      colors: ['#FFFFFF','#EEF2F5','#2F3740','#F7F9FB','#DCE3E8','#6E625A','#20262C','#F2E8DD','#2F3740','#C8D1D8'],
    },
    {
      id: 'neo-futurism',
      name: 'Neo-Futurism',
      description: 'Electric blue, neon mint en zilver op diep zwart',
      colors: ['#0D1117','#161B22','#DDE7F2','#0F141B','#2A323D','#9FB3C8','#E7EEF6','#1B2430','#E7EEF6','#2F3A46'],
    },
    {
      id: 'soft-pastel-dream',
      name: 'Soft Pastel Dream',
      description: 'Poederroze, lavendel, mint en romige tinten',
      colors: ['#FFFFFF','#F4EAF3','#4A3F4E','#FBF7FB','#E9F2EC','#7B6B80','#3D343F','#E1F0E8','#4A3F4E','#D7C8D8'],
    },
    {
      id: 'urban-monochrome',
      name: 'Urban Monochrome',
      description: 'Houtskool, beton, wit en een hint staalblauw',
      colors: ['#F6F5F2','#E3E0DB','#2C2F33','#F0EFEC','#BEB8B0','#7B7470','#1F2226','#D6D1CB','#2C2F33','#AFA9A2'],
    },
    {
      id: 'botanical-greenery',
      name: 'Botanical Greenery',
      description: 'Mosgroen, salie en aarde met zacht geel',
      colors: ['#FFFFFF','#EEF3EE','#2D4A3A','#F7FAF6','#C9D5C6','#6F7A66','#263B30','#DDE7DA','#2D4A3A','#D6E0D2'],
    },
    {
      id: 'luxury-noir',
      name: 'Luxury Noir',
      description: 'Diep zwart met champagnegoud, ivoor en bordeaux',
      colors: ['#0B0B0D','#171719','#E7D6B1','#101112','#2B2522','#C8B188','#F5EFE2','#1F1A18','#F5EFE2','#3A1F2A'],
    },
    {
      id: 'earthy-clay',
      name: 'Earthy Clay',
      description: 'Roest, oker en olijf met warme bruintinten',
      colors: ['#FFF9F2','#EFE2CF','#3B2B20','#F7EFE3','#CFAE7B','#8C6A3E','#2E2016','#E4D1B2','#3B2B20','#B98B4D'],
    },
    {
      id: 'retro-pop',
      name: 'Retro Pop',
      description: 'Mosterdgeel, petrol, koraal en creme',
      colors: ['#FFFFFF','#F4E7C5','#204B5B','#FFF8E9','#E6CF85','#6F5A55','#1A3B46','#F4E6DD','#204B5B','#D9C08B'],
    },
    {
      id: 'high-tech-silver',
      name: 'High-Tech Silver',
      description: 'Staal en grafiet met ijsblauw en helder wit',
      colors: ['#F8FAFC','#E4E9F0','#1F2A36','#F1F4F8','#B6C2CF','#60708A','#121821','#D8E3F2','#1F2A36','#9FB1C6'],
    },
    {
      id: 'candy-shop',
      name: 'Candy Shop',
      description: 'Bubblegum roze, turquoise en zonnig geel',
      colors: ['#FFFFFF','#FFE6F2','#3C3C44','#FFF5FA','#FFD1E6','#6B6F78','#2C3A40','#DFF3F2','#3C3C44','#F2C4D8'],
    },
    {
      id: 'midnight-garden',
      name: 'Midnight Garden',
      description: 'Nachtblauw met smaragd, violet en goud',
      colors: ['#0C111A','#151C29','#E9DDC7','#0F1522','#24324A','#9FB0C4','#F2EBDD','#1E2A3A','#F2EBDD','#2B3A52'],
    },
    {
      id: 'scandi-warmth',
      name: 'Scandi Warmth',
      description: 'Beige, warm grijs, zacht bruin en dusty blue',
      colors: ['#FBFAF7','#E6E2DA','#3F3A36','#F5F3EE','#C9C2B6','#6F6660','#2D2A27','#9CB0B3','#3F3A36','#B7ADA3'],
    },
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
    { id: 'faq', name: 'FAQ', description: 'Veelgestelde vragen', icon: 'MessageCircle' },
    { id: 'reviews', name: 'Reviews', description: 'Wat anderen zeggen', icon: 'star' }
  ];

  /* ───── PREVIEW PANEL ───── */

  openPreviewPanel(): void {
    if (!this.hasSelectedTemplate()) {
      this.toast.info('Kies eerst een template');
      return;
    }

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

      return { ...prev, pages };
    });
  }

  /* ───── VALIDATIE PER STAP ───── */

  readonly canProceed = computed<boolean>(() => {
    const step = this.currentStep();
    const state = this.builderState();
    const hasUploads = !!state.uploads && Object.keys(state.uploads).length > 0;

    switch (step) {
      case 0: return !!state.layoutConfig?.templateId && !!state.layoutConfig?.templateGroup;
      case 1: return !!state.layout && state.layoutLocked === true && hasUploads && !!state.contentSaved;
      case 2: return !!state.colorTheme;
      case 3: return !!(state.bodyFontVariant ?? state.fontVariant) && !!(state.headingFontVariant ?? state.fontVariant);
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




