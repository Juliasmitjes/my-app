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
      id: 'nordic-minimalism',
      name: 'Nordic Minimalism',
      description: 'Koele grijstinten, ijsblauw en zachte houtaccenten',
      colors: ['#FFFFFF','#EEF2F5','#2F3740','#F7F9FB','#DCE3E8','#E8DCCB','#20262C','#F2E8DD','#2F3740','#C8D1D8'],
    },
    {
      id: 'desert-sunset',
      name: 'Desert Sunset',
      description: 'Terracotta, warm zand, gedempt roze en nachtblauw',
      colors: ['#FFFDFB','#F1E6DB','#2D3B4C','#FAF2EA','#E3C7B8','#F0D4C8','#25303D','#E07E5D','#FFFDFB','#C8B1A2'],
    },
    {
      id: 'neo-futurism',
      name: 'Neo-Futurism',
      description: 'Electric blue, neon mint en zilver op diep zwart',
      colors: ['#0D1117','#161B22','#DDE7F2','#0F141B','#2A323D','#1B2430','#E7EEF6','#3A7BFF','#0D1117','#2F3A46'],
    },
    {
      id: 'soft-pastel-dream',
      name: 'Soft Pastel Dream',
      description: 'Poederroze, lavendel, mint en romige tinten',
      colors: ['#FFFFFF','#F4EAF3','#4A3F4E','#FBF7FB','#E9F2EC','#F2DCE7','#3D343F','#E1F0E8','#4A3F4E','#D7C8D8'],
    },
    {
      id: 'urban-monochrome',
      name: 'Urban Monochrome',
      description: 'Houtskool, beton, wit en een hint staalblauw',
      colors: ['#FFFFFF','#EEF1F4','#2A2F36','#F7F8FA','#C7D1DB','#E1E6EB','#1F2328','#B8C7D6','#2A2F36','#D2DAE2'],
    },
    {
      id: 'botanical-greenery',
      name: 'Botanical Greenery',
      description: 'Mosgroen, salie en aarde met zacht geel',
      colors: ['#FFFFFF','#EEF3EE','#2D4A3A','#F7FAF6','#C9D5C6','#EEE7D6','#263B30','#8FA88F','#2D4A3A','#D6E0D2'],
    },
    {
      id: 'luxury-noir',
      name: 'Luxury Noir',
      description: 'Diep zwart met champagnegoud, ivoor en bordeaux',
      colors: ['#0B0B0D','#171719','#E7D6B1','#101112','#2B2522','#1C1A1A','#F5EFE2','#E7D6B1','#0B0B0D','#3A1F2A'],
    },
    {
      id: 'coastal-breeze',
      name: 'Coastal Breeze',
      description: 'Zeeblauw, zand, schelpwit en zeeschuimgroen',
      colors: ['#FFFFFF','#EAF2F7','#23424F','#F6F9FB','#D9E6EF','#EADFCF','#1E343E','#74A7B8','#23424F','#CBD8DF'],
    },
    {
      id: 'cyber-glow',
      name: 'Cyber Glow',
      description: 'Magenta en cyan met paars op donkergrijs',
      colors: ['#111115','#1A1B22','#E9EEF6','#151620','#2A2A36','#242436','#F1F2F8','#FF5CA8','#111115','#34354A'],
    },
    {
      id: 'earthy-clay',
      name: 'Earthy Clay',
      description: 'Roest, oker en olijf met warme bruintinten',
      colors: ['#FFFFFF','#F2E8DD','#3A2F25','#FAF5EF','#D7C2AE','#E7D1BE','#2F241B','#B36A4A','#3A2F25','#D1B59F'],
    },
    {
      id: 'retro-pop',
      name: 'Retro Pop',
      description: 'Mosterdgeel, petrol, koraal en creme',
      colors: ['#FFFFFF','#F4E7C5','#204B5B','#FFF8E9','#E6CF85','#F2D6C9','#1A3B46','#E67E6B','#204B5B','#D9C08B'],
    },
    {
      id: 'high-tech-silver',
      name: 'High-Tech Silver',
      description: 'Staal en grafiet met ijsblauw en helder wit',
      colors: ['#FFFFFF','#EEF2F6','#2B3138','#F8FAFC','#C7D0DA','#E4E9EF','#1F242B','#BFD7EA','#2B3138','#D5DEE7'],
    },
    {
      id: 'candy-shop',
      name: 'Candy Shop',
      description: 'Bubblegum roze, turquoise en zonnig geel',
      colors: ['#FFFFFF','#FFE6F2','#3C3C44','#FFF5FA','#FFD1E6','#E8F6F4','#2C3A40','#47C6C7','#3C3C44','#F2C4D8'],
    },
    {
      id: 'midnight-garden',
      name: 'Midnight Garden',
      description: 'Nachtblauw met smaragd, violet en goud',
      colors: ['#0C111A','#151C29','#E9DDC7','#0F1522','#24324A','#1E2A3A','#F2EBDD','#3C8E7A','#0C111A','#2B3A52'],
    },
    {
      id: 'scandi-warmth',
      name: 'Scandi Warmth',
      description: 'Beige, warm grijs, zacht bruin en dusty blue',
      colors: ['#FFFFFF','#EFE7DE','#4A3C33','#FBF7F2','#D6C7B7','#E7DED3','#3A2F28','#9AB3C6','#4A3C33','#CFC2B4'],
    },
    {
      id: 'solar-energy',
      name: 'Solar Energy',
      description: 'Warm geel en oranje met krachtig donkerblauw',
      colors: ['#FFFFFF','#FFF2CC','#243B63','#FFFBF2','#FFD77A','#F3C17A','#1B2B4A','#F79A3E','#243B63','#E3C38F'],
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



