import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BuilderState } from '../../types/builder-state';
import { fontMap } from '../../shared/fonts';

type PageTextBlock = {
  title: string;
  subtitle: string;
  body: string;
  contactEmail?: string;
  contactPhone?: string;
  contactButtonLabel?: string;
  services?: Array<{
    title?: string;
    duration?: string;
    price?: string;
    buttonLabel?: string;
  }>;
  members?: Array<{
    name?: string;
    role?: string;
    intro?: string;
  }>;
  faqItems?: Array<{
    question?: string;
    answer?: string;
    category?: string;
  }>;
  reviewItems?: Array<{
    name?: string;
    role?: string;
    quote?: string;
    rating?: number;
  }>;
  socials?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
};

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './preview-panel.html',
  styleUrls: ['./preview-panel.css']
})


export class PreviewPanel implements OnChanges {

  @Input() open = false;
  @Input() embedded = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input({ required: true }) builderState!: BuilderState;
  @Input({ required: true }) currentStep!: number;
  @Input() colorThemes!: { id: string; colors: string[] }[];
  @Output() closed = new EventEmitter<void>();
  activePageId: string | null = null;
  bookingServiceTitle: string | null = null;
  selectedBookingDate = '';
  selectedBookingSlot = '';
  bookingConfirmed = false;
  faqActiveCategory = '';
  faqSearchQuery = '';
  expandedFaqIndex = 0;

  iconName = 'monitor';
  title = 'Live voorbeeld';
  fontMap = fontMap;

  /* ────────────────────────────────────────────────
   * HYDRATION-SAFE CACHES
   * ────────────────────────────────────────────────
   */

  private _selectedThemeColors: string[] | null = null;
  private readonly contentPageOrder = ['about', 'diensten', 'portfolio', 'team', 'blog', 'reviews', 'faq', 'contact'];

  private blobUrlCache = new Map<string, string>();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['builderState'] || changes['colorThemes']) {
      this._selectedThemeColors = null;
    }

    if (changes['builderState']) {
      this.resetBlobUrls();
      if (!this.pages.includes(this.activePageId ?? '')) {
        this.activePageId = this.pages[0] ?? 'home';
      }
      this.resetFaqState();
    }
  }

   private resetBlobUrls(): void {
    for (const url of this.blobUrlCache.values()) {
      URL.revokeObjectURL(url);
    }
    this.blobUrlCache.clear();
  }

  /* ────────────────────────────────────────────────
   * PANEL CONTROL
   * ────────────────────────────────────────────────
   */

  close(): void {
    this.closed.emit();
  }

  /* ────────────────────────────────────────────────
   * STEP VISIBILITY
   * ────────────────────────────────────────────────
   */

  get canShowLayout(): boolean {
    return !!this.builderState.layout;
  }

  get canShowColors(): boolean {
    return !!this.builderState.colorTheme;
  }

  get canShowFont(): boolean {
    return (
      !!(this.builderState.bodyFontVariant ?? this.builderState.fontVariant) &&
      !!(this.builderState.headingFontVariant ?? this.builderState.fontVariant)
    );
  }

  get canShowNavigation(): boolean {
    return !!this.builderState.navigation;
  }

  get canShowPages(): boolean {
    return (this.builderState.pages?.length ?? 0) > 0;
  }

  get canShowHomePage(): boolean {
    return this.currentStep >= 5;
  }

  /* ────────────────────────────────────────────────
   * LAYOUT HELPERS
   * ────────────────────────────────────────────────
   */

  get singleBlocks(): Array<'text' | 'image' | 'video'> {
    switch (this.builderState.layoutConfig?.variantType) {
      case 'image-text': return ['image', 'text'];
      case 'text-image': return ['text', 'image'];
      case 'text-video': return ['text', 'video'];
      case 'video-text': return ['video', 'text'];
      case 'text-only': return ['text'];
      default: return ['text'];
    }
  }

  get twoColumns() {
    return [
      this.builderState.layoutConfig?.col1Type ?? 'text',
      this.builderState.layoutConfig?.col2Type ?? 'text'
    ];
  }

  get gridCells(): Array<'text' | 'image' | 'video'> {
    return this.builderState.layoutConfig?.cells ?? [];
  }

  get gridCols(): number {
    return this.builderState.layoutConfig?.cols ?? 1;
  }

  getGridColumns(): string {
    if (this.builderState.layout === 'grid') {
      return `repeat(${this.gridCols || 1}, 1fr)`;
    }
    if (this.builderState.layout === 'two-column') {
      return 'repeat(2, 1fr)';
    }
    return '1fr';
  }

  getGridText(i: number): string {
    const variants = [
      'Laat je verhaal tot leven komen.',
      'Een moderne basis voor jouw content.',
      'Perfect voor visuals en storytelling.',
      'Rustige opmaak met sterke typografie.',
      'Jouw ontwerp, jouw ritme.'
    ];
    return variants[i % variants.length];
  }

  get gridFontSize(): string {
    if (this.gridCols >= 6) return 'text-xs';
    if (this.gridCols >= 3) return 'text-sm';
    return 'text-base';
  }

  get isPortfolioTemplate(): boolean {
    const group = this.builderState.layoutConfig?.templateGroup;
    const id = this.builderState.layoutConfig?.templateId ?? '';
    return group === 'portfolio' || id.startsWith('portfolio-');
  }

  get portfolioTemplateId(): string | null {
    return this.builderState.layoutConfig?.templateId ?? null;
  }

  get portfolioArtistAreas(): string {
    return '"a a b" "c d d" "e e f" "g h i"';
  }

  getPortfolioArtistArea(index: number): string {
    const areas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    return areas[index] ?? '';
  }

  getPortfolioUploadKey(index: number, type: 'image' | 'text' | 'video'): string | null {
    const id = this.portfolioTemplateId;
    if (!id) return null;
    return `grid_${id}_${index}_${type}`;
  }

  getPortfolioBusinessName(): string {
    const id = this.portfolioTemplateId;
    if (!id) return 'Bedrijfsnaam';
    const value = this.builderState.uploads?.[`business_name_${id}`];
    return typeof value === 'string' && value.trim() ? value : 'Bedrijfsnaam';
  }

  getPortfolioSubtitle(): string {
    const value = this.builderState.uploads?.['artist_subtitle'];
    return typeof value === 'string' && value.trim()
      ? value
      : 'Hier komt jouw ondertitel.';
  }

  getPortfolioTextBlock(index: number): { title: string; subtitle: string; body: string } | null {
    return this.getTextBlock(this.getPortfolioUploadKey(index, 'text'));
  }

  getPortfolioImage(index: number): string {
    return (
      this.getUploadFor(this.getPortfolioUploadKey(index, 'image')) ||
      'assets/images/exampleImage.png'
    );
  }

  getPreviewImage(index: number): string {
    return this.getPortfolioImage(index);
  }

  getProductPreviewText(): PageTextBlock | null {
    return this.getPortfolioTextBlock(0);
  }

  /* ────────────────────────────────────────────────
   * STATE HELPERS
   * ────────────────────────────────────────────────
   */

  get isEmpty(): boolean {
    return !this.builderState.layout;
  }

  get isSidebar(): boolean {
    return this.builderState.navigation === 'sidebar';
  }

  get pages(): string[] {
    return this.builderState.pages ?? ['home'];
  }

  get logoLabel(): string {
    return this.builderState.logo || 'Jouw site';
  }

  get headingFont(): string {
    const id =
      this.builderState.headingFontVariant ??
      this.builderState.fontVariant ??
      this.builderState.bodyFontVariant ??
      'inter';
    return this.fontMap[id] ?? this.fontMap['inter'];
  }

  get bodyFont(): string {
    const id = this.builderState.bodyFontVariant ?? this.builderState.fontVariant ?? 'inter';
    return this.fontMap[id] ?? this.fontMap['inter'];
  }

  pageLabel(p: string): string {
    const labels: Record<string, string> = {
      home: 'Home',
      about: 'Over',
      blog: 'Blog',
      contact: 'Contact',
      diensten: 'Diensten',
      portfolio: 'Portfolio',
      team: 'Team',
      faq: 'FAQ',
      reviews: 'Reviews'
    };
    return labels[p] ?? (p.charAt(0).toUpperCase() + p.slice(1));
  }

  getPreviewNavItems(count: number, offset = 0): Array<{ id: string | null; label: string }> {
    const items = this.getOrderedContentPageItems();
    if (!items.length) {
      return Array.from({ length: count }, () => ({ id: null, label: 'Button' }));
    }

    const navItems = [{ id: 'home', label: this.pageLabel('home') }, ...items];
    return navItems.slice(offset);
  }

  getPreviewCtaItem(offset: number): { id: string | null; label: string } | null {
    const items = this.getOrderedContentPageItems();
    if (!items.length) {
      return { id: null, label: 'Button' };
    }

    return null;
  }

  getHomeActionItems(count: number): Array<{ id: string | null; label: string }> {
    const items = this.getPreferredContentPageItems(['about', 'contact', 'diensten', 'portfolio', 'reviews', 'team', 'blog', 'faq']);
    if (!items.length) {
      return Array.from({ length: count }, () => ({ id: null, label: 'Button' }));
    }

    return items.slice(0, count);
  }

  get activePage(): string {
    const pages = this.pages;
    if (!pages.length) return 'home';
    if (this.activePageId && pages.includes(this.activePageId)) return this.activePageId;
    return pages[0];
  }

  setActivePage(pageId: string): void {
    this.activePageId = pageId;
    this.closeBooking();
    this.resetFaqState();
  }

  /* ────────────────────────────────────────────────
  * TEXT BLOCK HELPERS
  * ────────────────────────────────────────────────
  */

  // Single-column: keys zoals "image-text_text", "text-image_text", etc.
  getSingleUploadKey(kind: 'text' | 'image' | 'video'): string | null {
    const variant = this.builderState.layoutConfig?.variantType;
    if (!variant) return null;
    return `${variant}_${kind}`;
  }

  // Inline text object ophalen: { title, subtitle, body }
  getTextBlock(key: string | null): PageTextBlock | null {
    if (!key) return null;
    const uploads = this.builderState.uploads;
    if (!uploads) return null;

    const entry = uploads[key];
    if (!entry || entry.kind !== 'inline' || !entry.value) return null;

    const value = entry.value;
    return {
      title: value.title ?? '',
      subtitle: value.subtitle ?? '',
      body: value.body ?? '',
      contactEmail: value.contactEmail ?? '',
      contactPhone: value.contactPhone ?? '',
      contactButtonLabel: value.contactButtonLabel ?? '',
      services: value.services ?? [],
      members: value.members ?? [],
      faqItems: value.faqItems ?? [],
      reviewItems: value.reviewItems ?? [],
      socials: value.socials ?? {}
    };
  }

  getPageText(pageId: string): PageTextBlock | null {
    return this.getTextBlock(`page_${pageId}_text`);
  }

  getPageImage(pageId: string): string | null {
    return this.getUploadFor(`page_${pageId}_image`);
  }

  getAboutBackgroundImage(pageId: string): string {
    return (
      this.getUploadFor(`page_${pageId}_background_image`) ||
      this.getPageImage(pageId) ||
      'assets/images/exampleImage.png'
    );
  }

  getAboutPortraitImage(pageId: string): string {
    return (
      this.getUploadFor(`page_${pageId}_portrait_image`) ||
      this.getPageImage(pageId) ||
      'assets/images/exampleImage.png'
    );
  }

  get isAboutPageActive(): boolean {
    return this.activePage === 'about';
  }

  get isBlogPageActive(): boolean {
    return this.activePage === 'blog';
  }

  get isContactPageActive(): boolean {
    return this.activePage === 'contact';
  }

  get isServicesPageActive(): boolean {
    return this.activePage === 'diensten';
  }

  get isTeamPageActive(): boolean {
    return this.activePage === 'team';
  }

  get isFaqPageActive(): boolean {
    return this.activePage === 'faq';
  }

  get isReviewsPageActive(): boolean {
    return this.activePage === 'reviews';
  }

  get aboutPageSectionTitle(): string {
    return 'Over';
  }

  getAboutBodyColumns(pageId: string): [string, string] {
    return this.splitBodyIntoColumns(this.getPageText(pageId)?.body ?? '');
  }

  getAboutSocialLinks(pageId: string): Array<{ platform: string; href: string; label: string }> {
    const socials = this.getPageText(pageId)?.socials ?? {};
    const resolved: Array<{ platform: string; href: string; label: string }> = [];

    for (const entry of [
      { key: 'linkedin', platform: 'linkedin', label: 'LinkedIn' },
      { key: 'instagram', platform: 'instagram', label: 'Instagram' },
      { key: 'facebook', platform: 'facebook', label: 'Facebook' }
    ] as const) {
      const raw = socials[entry.key]?.trim();
      if (!raw) continue;

      resolved.push({
        platform: entry.platform,
        href: this.normalizeUrl(raw),
        label: entry.label
      });
    }

    return resolved;
  }

  getBlogHeroLabel(pageId: string): string {
    return this.getPageText(pageId)?.subtitle?.trim() || 'Verhalen & inspiratie';
  }

  getBlogCards(pageId: string): Array<{ title: string; meta: string; excerpt: string }> {
    const text = this.getPageText(pageId);
    const title = text?.title?.trim() || 'Jouw eerste blogpost';
    const excerpt = text?.body?.trim() || 'Schrijf hier een korte introductie die uitnodigt om verder te lezen.';

    return [
      {
        title,
        meta: text?.subtitle?.trim() || 'Beheerder • 1 min leestijd',
        excerpt
      },
      {
        title: text?.title?.trim() ? `${text.title.trim()} vervolg` : 'Een tweede blogmoment',
        meta: 'Beheerder • 2 min leestijd',
        excerpt
      }
    ];
  }

  getContactPageData(pageId: string): { heading: string; email: string; phone: string; buttonLabel: string } {
    const text = this.getPageText(pageId);
    return {
      heading: text?.title?.trim() || 'contact.',
      email: text?.contactEmail?.trim() || 'info@mysite.com',
      phone: text?.contactPhone?.trim() || '+31 6 12345678',
      buttonLabel: text?.contactButtonLabel?.trim() || 'Versturen'
    };
  }

  getServicesPageData(pageId: string): { heading: string; items: Array<{ title: string; duration: string; price: string; buttonLabel: string }> } {
    const text = this.getPageText(pageId);
    const items = Array.isArray(text?.services) && text.services.length
      ? text.services.map(item => ({
          title: item.title?.trim() || 'Dienst',
          duration: item.duration?.trim() || '1 uur',
          price: item.price?.trim() || '€100',
          buttonLabel: item.buttonLabel?.trim() || 'Boek nu'
        }))
      : [{ title: 'Wassen & drogen', duration: '1 uur', price: '€100', buttonLabel: 'Boek nu' }];

    return {
      heading: text?.title?.trim() || 'Onze diensten',
      items
    };
  }

  getTeamPageData(pageId: string): { kicker: string; heading: string; intro: string; members: Array<{ name: string; role: string; intro: string; image: string }> } {
    const text = this.getPageText(pageId);
    const members = Array.isArray(text?.members) && text.members.length
      ? text.members.map((member, index) => ({
          name: member.name?.trim() || `Teamlid ${index + 1}`,
          role: member.role?.trim() || 'Functie',
          intro: member.intro?.trim() || 'Voeg hier een korte introductie van dit teamlid toe.',
          image: this.getUploadFor(`page_${pageId}_member_${index}_image`) || 'assets/images/exampleImage.png'
        }))
      : [{
          name: 'Sophie de Vries',
          role: 'Creatief directeur',
          intro: 'Sophie bewaakt de creatieve richting en vertaalt ideeën naar een sterk merkverhaal.',
          image: 'assets/images/exampleImage.png'
        }];

    return {
      kicker: text?.subtitle?.trim() || 'Ons team',
      heading: text?.title?.trim() || 'De mensen achter het merk',
      intro: text?.body?.trim() || 'Laat zien wie er achter je bedrijf zitten en waar ieder teamlid in uitblinkt.',
      members
    };
  }

  getFaqPageData(pageId: string): { heading: string; searchPlaceholder: string; intro: string; categories: string[]; items: Array<{ question: string; answer: string; category: string }> } {
    const text = this.getPageText(pageId);
    const items = Array.isArray(text?.faqItems) && text.faqItems.length
      ? text.faqItems.map((item, index) => ({
          question: item.question?.trim() || `Vraag ${index + 1}`,
          answer: item.answer?.trim() || 'Schrijf hier het antwoord op deze veelgestelde vraag.',
          category: item.category?.trim() || 'Algemeen'
        }))
      : [{
          question: 'Kan ik mijn afspraak verzetten?',
          answer: 'Ja, je kunt je afspraak eenvoudig verzetten via e-mail of telefonisch contact.',
          category: 'Algemeen'
        }];

    const categories = [...new Set(items.map(item => item.category))];

    return {
      heading: text?.title?.trim() || 'Veelgestelde vragen',
      searchPlaceholder: text?.subtitle?.trim() || 'Waar ben je naar op zoek?',
      intro: text?.body?.trim() || '',
      categories,
      items
    };
  }

  getFilteredFaqItems(pageId: string): Array<{ question: string; answer: string; category: string; index: number }> {
    const faq = this.getFaqPageData(pageId);
    const category = this.faqActiveCategory || faq.categories[0] || '';
    const query = this.faqSearchQuery.trim().toLowerCase();

    return faq.items
      .map((item, index) => ({ ...item, index }))
      .filter(item => {
        const matchesCategory = !category || item.category === category;
        const haystack = `${item.question} ${item.answer} ${item.category}`.toLowerCase();
        const matchesQuery = !query || haystack.includes(query);
        return matchesCategory && matchesQuery;
      });
  }

  getReviewsPageData(pageId: string): { kicker: string; heading: string; intro: string; items: Array<{ name: string; role: string; quote: string; rating: number }> } {
    const text = this.getPageText(pageId);
    const items = Array.isArray(text?.reviewItems) && text.reviewItems.length
      ? text.reviewItems.map((item, index) => ({
          name: item.name?.trim() || `Review ${index + 1}`,
          role: item.role?.trim() || 'Klant',
          quote: item.quote?.trim() || 'Voeg hier een korte review toe.',
          rating: Math.max(1, Math.min(5, Number(item.rating) || 5))
        }))
      : [{
          name: 'Sanne de Boer',
          role: 'Klant',
          quote: 'Fijne service, snel geholpen en alles voelde meteen professioneel aan.',
          rating: 5
        }];

    return {
      kicker: text?.subtitle?.trim() || 'Reviews',
      heading: text?.title?.trim() || 'Wat klanten zeggen',
      intro: text?.body?.trim() || 'Geef bezoekers vertrouwen met eerlijke ervaringen en duidelijke beoordelingen.',
      items
    };
  }

  get bookingDates(): Array<{ value: string; day: string; label: string }> {
    const formatter = new Intl.DateTimeFormat('nl-NL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const value = date.toISOString().slice(0, 10);
      const [day = '', ...rest] = formatter.format(date).replace(/\./g, '').split(' ');

      return {
        value,
        day,
        label: rest.join(' ')
      };
    });
  }

  get bookingSlots(): string[] {
    return ['09:00', '10:30', '13:00', '14:30', '16:00', '19:00'];
  }

  openBooking(serviceTitle: string): void {
    this.bookingServiceTitle = serviceTitle || 'Dienst';
    this.selectedBookingDate = this.bookingDates[0]?.value ?? '';
    this.selectedBookingSlot = '';
    this.bookingConfirmed = false;
  }

  closeBooking(): void {
    this.bookingServiceTitle = null;
    this.selectedBookingDate = '';
    this.selectedBookingSlot = '';
    this.bookingConfirmed = false;
  }

  confirmBooking(): void {
    if (!this.selectedBookingDate || !this.selectedBookingSlot) return;
    this.bookingConfirmed = true;
  }

  /* ────────────────────────────────────────────────
   * COLORS (HYDRATION SAFE)
   * ────────────────────────────────────────────────
   */

  get selectedThemeColors(): string[] {
    if (this._selectedThemeColors) return this._selectedThemeColors;

    const theme = this.colorThemes?.find(t => t.id === this.builderState.colorTheme);

    this._selectedThemeColors = theme
      ? theme.colors
      : [
          'hsl(0 0% 100%)',
          'hsl(214 82% 95%)',
          'hsl(223 71% 38%)',
          'hsl(214 82% 95%)',
          'hsl(215 64% 86%)',
          'hsl(218 26% 43%)',
          'hsl(220 46% 16%)',
          'hsl(193 100% 59% / 0.12)',
          'hsl(223 71% 38%)',
          'hsl(215 64% 86%)'
        ];

    return this._selectedThemeColors;
  }

  /* ────────────────────────────────────────────────
   * UPLOAD HANDLING
   * ────────────────────────────────────────────────
   */

    getUploadFor(key: string | null): string | null {
    if (!key) return null;

    const uploads = this.builderState.uploads;
    if (!uploads) return null;

    const file = uploads[key];
    if (!file) return null;

    // Inline text → hier NIET voor gebruiken
    if (file?.kind === 'inline') {
      return null;
    }

    // File → gebruik cache
    if (file instanceof File) {
      const existing = this.blobUrlCache.get(key);
      if (existing) return existing;

      const url = URL.createObjectURL(file);
      this.blobUrlCache.set(key, url);
      return url;
    }

    // Base64 / URL string
    if (typeof file === 'string') {
      return file;
    }

    return null;
  }

  private splitBodyIntoColumns(value: string): [string, string] {
    const fallback =
      'Vertel hier in een paar zinnen wie je bent, waar je voor staat en wat bezoekers op jouw Over-pagina moeten onthouden.';
    const normalized = (value || fallback).replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return [fallback, fallback];
    }

    const sentences = normalized.match(/[^.!?]+[.!?]?/g)?.map(part => part.trim()).filter(Boolean) ?? [];

    if (sentences.length >= 2) {
      const midpoint = Math.ceil(sentences.length / 2);
      return [
        sentences.slice(0, midpoint).join(' '),
        sentences.slice(midpoint).join(' ')
      ];
    }

    const words = normalized.split(' ');
    const midpoint = Math.ceil(words.length / 2);

    return [
      words.slice(0, midpoint).join(' '),
      words.slice(midpoint).join(' ') || words.slice(0, midpoint).join(' ')
    ];
  }

  private normalizeUrl(value: string): string {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value}`;
  }

  private resetFaqState(): void {
    const faq = this.getFaqPageData(this.activePage);
    this.faqActiveCategory = faq.categories[0] || '';
    this.faqSearchQuery = '';
    this.expandedFaqIndex = 0;
  }

  private getOrderedContentPageItems(): Array<{ id: string; label: string }> {
    const pages = (this.builderState.pages ?? []).filter(page => page !== 'home');
    return [...pages]
      .sort((a, b) => this.getPageSortIndex(a) - this.getPageSortIndex(b))
      .map(id => ({ id, label: this.pageLabel(id) }));
  }

  private getPreferredContentPageItems(priority: string[]): Array<{ id: string; label: string }> {
    const items = this.getOrderedContentPageItems();
    return [...items].sort((a, b) => {
      const aIndex = priority.indexOf(a.id);
      const bIndex = priority.indexOf(b.id);
      const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
      return safeA - safeB;
    });
  }

  private getPageSortIndex(pageId: string): number {
    const index = this.contentPageOrder.indexOf(pageId);
    return index === -1 ? this.contentPageOrder.length + 1 : index;
  }
}
