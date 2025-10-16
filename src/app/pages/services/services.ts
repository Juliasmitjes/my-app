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
    colors: ['#FF7A3D', '#FFB347', '#FFD166'], // oranje-geel
  },
  {
    id: 'light',
    name: 'Licht',
    description: 'Fris en helder met zachte pastelkleuren',
    colors: ['#FDF6E3', '#E3F2FD', '#C8E6C9'], // crème-blauw-groen
  },
  {
    id: 'dark',
    name: 'Donker',
    description: 'Diep en stijlvol met luxe accenten',
    colors: ['#1E1E2F', '#2C2C3A', '#3B3B4F'], // blauwgrijs-paars
  },
  {
    id: 'cool',
    name: 'Koel',
    description: 'Rustig en modern met blauwe en paarse tonen',
    colors: ['#5C6BC0', '#42A5F5', '#26C6DA'], // paars-blauw-turquoise
  },
  {
    id: 'earth',
    name: 'Aards',
    description: 'Natuurlijke tinten met groen en bruin voor een rustige uitstraling',
    colors: ['#8D6E63', '#A1887F', '#C5A880'], // bruin-groen-zand
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Levendig en speels met opvallende kleuren',
    colors: ['#FF4081', '#7C4DFF', '#448AFF'], // roze-paars-blauw
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Diep en verfrissend als de zee',
    colors: ['#00796B', '#0097A7', '#80CBC4'], // zeegroen-blauw
  },
  {
    id: 'sunset',
    name: 'Zonsondergang',
    description: 'Warm en dromerig met roze en perzik',
    colors: ['#FF9A8B', '#FF6A88', '#FF99AC'], // perzik-roze
  },
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