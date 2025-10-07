import { Component } from '@angular/core';
import { Progress } from '../../components/progress/progress';
import { LayoutStep } from 'src/app/components/layout-step/layout-step';
import { ColorStep } from 'src/app/components/color-step/color-step';
import { FontStep } from 'src/app/components/font-step/font-step';
import { NavigationStep } from 'src/app/components/navigation-step/navigation-step';
import { ContentStep } from 'src/app/components/content-step/content-step';
import { PreviewStep } from 'src/app/components/preview-step/preview-step';

interface BuilderState {
layout: 'single' | 'two-column' | 'grid' | null;
colorTheme: 'warm' | 'light' | 'dark' | 'cool' | null;
font: 'modern-inter' | 'modern-roboto' | 'serif-merriweather' | 'serif-playfair' | 'display-montserrat' | 'display-oswald' | null;
logo: string;
navigation: 'top' | 'sidebar';
headerStyle: 'fixed' | 'scrolling';
pages: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Progress,
    LayoutStep,
    ColorStep,
    FontStep,
    NavigationStep,
    ContentStep,
    PreviewStep],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
currentStep = 0;
steps = ['Layout', 'Colors', 'Typography', 'Navigation', 'Content', 'Preview'];

colorThemes = [
{ id: 'warm', name: 'Warm', colors: ['#FF6B4A', '#FF8E73', '#FFA99C'] },
{ id: 'light', name: 'Light', colors: ['#E3F2FD', '#BBDEFB', '#90CAF9'] },
{ id: 'dark', name: 'Dark', colors: ['#424242', '#616161', '#757575'] },
{ id: 'cool', name: 'Cool', colors: ['#4FC3F7', '#29B6F6', '#03A9F4'] },
];

fontOptions = [
{ id: 'modern-inter', category: 'Modern Sans', name: 'Inter', preview: 'Clean and modern typography' },
{ id: 'modern-roboto', category: 'Modern Sans', name: 'Roboto', preview: 'Google signature font' },
{ id: 'serif-merriweather', category: 'Classic Serif', name: 'Merriweather', preview: 'Perfect for reading' },
{ id: 'serif-playfair', category: 'Classic Serif', name: 'Playfair Display', preview: 'Elegant and sophisticated' },
{ id: 'display-montserrat', category: 'Display', name: 'Montserrat', preview: 'Bold and impactful' },
{ id: 'display-oswald', category: 'Display', name: 'Oswald', preview: 'Strong and distinctive' },
];

builderState: BuilderState = {
layout: null,
colorTheme: null,
font: null,
logo: '',
navigation: 'top',
headerStyle: 'fixed',
pages: ['home']
};


updateState(updates: Partial<BuilderState>) {
this.builderState = { ...this.builderState, ...updates };
}

nextStep() {
if (this.currentStep < this.steps.length - 1) this.currentStep++;
}

prevStep() {
if (this.currentStep > 0) this.currentStep--;
}

togglePage(page: string) {
const pages = this.builderState.pages.includes(page)
? this.builderState.pages.filter(p => p !== page)
: [...this.builderState.pages, page];

if (pages.length <= 4) {
  this.updateState({ pages });
}}

}
