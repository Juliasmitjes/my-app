import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BuilderState } from '../../types/builder-state';
import { PageDef } from '../content-step/content-step';
import { fontMap } from '../../shared/fonts';
import { PageContentEditor } from './page-content-editor/page-content-editor';
import {
  BlogPostDraft,
  FaqItemDraft,
  PageContentPayload,
  ReviewItemDraft,
  ServiceItemDraft,
  TeamMemberDraft
} from './page-content-modal.models';
import { buildSocialLinks, getFileLabel, splitBodyIntoColumns } from './page-content-modal.utils';

@Component({
  selector: 'app-page-content-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageContentEditor],
  templateUrl: './page-content-modal.html',
  styleUrl: './page-content-modal.css',
  encapsulation: ViewEncapsulation.None
})
export class PageContentModal implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Input() page: PageDef | null = null;
  @Input() builderState!: BuilderState;
  @Input() colorThemes: { id: string; colors: string[] }[] = [];
  @Output() dismiss = new EventEmitter<void>();
  @Output() save = new EventEmitter<PageContentPayload>();

  title = '';
  subtitle = '';
  body = '';
  image: File | string | null = null;
  backgroundImage: File | string | null = null;
  portraitImage: File | string | null = null;
  blogHeroTitle = '';
  blogPosts: BlogPostDraft[] = [];
  activeBlogPostIndex = 0;
  serviceItems: ServiceItemDraft[] = [];
  activeServiceIndex = 0;
  teamMembers: TeamMemberDraft[] = [];
  activeTeamMemberIndex = 0;
  faqItems: FaqItemDraft[] = [];
  activeFaqIndex = 0;
  reviewItems: ReviewItemDraft[] = [];
  activeReviewIndex = 0;
  faqActiveCategory = '';
  faqSearchQuery = '';
  bookingServiceTitle: string | null = null;
  selectedBookingDate = '';
  selectedBookingSlot = '';
  bookingConfirmed = false;
  contactEmail = '';
  contactPhone = '';
  contactButtonLabel = '';
  linkedinUrl = '';
  instagramUrl = '';
  facebookUrl = '';
  private imagePreviewUrl: string | null = null;
  private backgroundPreviewUrl: string | null = null;
  private portraitPreviewUrl: string | null = null;

  fontMap = fontMap;

  get modalContext(): this {
    return this;
  }

  ngOnChanges(): void {
    if (!this.page) return;
    this.loadExisting();
  }

  ngOnDestroy(): void {
    this.resetPreviewUrls();
  }

  get selectedThemeColors(): string[] {
    const theme = this.colorThemes.find(t => t.id === this.builderState?.colorTheme);
    return theme
      ? theme.colors
      : [
          'hsl(0 0% 100%)',
          'hsl(210 40% 96%)',
          'hsl(220 70% 15%)',
          'hsl(210 40% 96%)',
          'hsl(220 13% 91%)',
          'hsl(220 13% 46%)',
          'hsl(220 26% 14%)',
          'hsl(195 100% 50% / 0.12)',
          'hsl(220 70% 15%)',
          'hsl(220 13% 91%)'
        ];
  }

  get headingFont(): string {
    const id =
      this.builderState?.headingFontVariant ??
      this.builderState?.fontVariant ??
      this.builderState?.bodyFontVariant ??
      'inter';
    return this.fontMap[id] ?? this.fontMap['inter'];
  }

  get bodyFont(): string {
    const id = this.builderState?.bodyFontVariant ?? this.builderState?.fontVariant ?? 'inter';
    return this.fontMap[id] ?? this.fontMap['inter'];
  }

  get previewImage(): string {
    if (this.imagePreviewUrl) return this.imagePreviewUrl;
    if (typeof this.image === 'string') return this.image;
    const existing = this.getExistingImage();
    if (existing) return existing;
    return 'assets/images/exampleImage.png';
  }

  get previewBackgroundImage(): string {
    if (this.backgroundPreviewUrl) return this.backgroundPreviewUrl;
    if (typeof this.backgroundImage === 'string') return this.backgroundImage;
    const existing = this.getExistingImage('background');
    if (existing) return existing;
    return 'assets/images/exampleImage.png';
  }

  get previewPortraitImage(): string {
    if (this.portraitPreviewUrl) return this.portraitPreviewUrl;
    if (typeof this.portraitImage === 'string') return this.portraitImage;
    const existing = this.getExistingImage('portrait');
    if (existing) return existing;
    const legacy = this.getExistingImage('default');
    if (legacy) return legacy;
    return 'assets/images/exampleImage.png';
  }

  get isAboutPage(): boolean {
    return this.page?.id === 'about';
  }

  get isBlogPage(): boolean {
    return this.page?.id === 'blog';
  }

  get isContactPage(): boolean {
    return this.page?.id === 'contact';
  }

  get isServicesPage(): boolean {
    return this.page?.id === 'diensten';
  }

  get isTeamPage(): boolean {
    return this.page?.id === 'team';
  }

  get isFaqPage(): boolean {
    return this.page?.id === 'faq';
  }

  get isReviewsPage(): boolean {
    return this.page?.id === 'reviews';
  }

  get aboutSectionTitle(): string {
    return this.page?.name ?? 'Over';
  }

  get bodyColumns(): [string, string] {
    return splitBodyIntoColumns(this.body);
  }

  get aboutSocialLinks(): Array<{ platform: string; href: string; label: string }> {
    return buildSocialLinks({
      linkedin: this.linkedinUrl,
      instagram: this.instagramUrl,
      facebook: this.facebookUrl
    });
  }

  get currentBlogPost(): BlogPostDraft {
    if (!this.blogPosts.length) {
      this.blogPosts = [{ title: '', summary: '', image: null }];
      this.activeBlogPostIndex = 0;
    }

    return this.blogPosts[this.activeBlogPostIndex] ?? this.blogPosts[0];
  }

  get blogHeroLabel(): string {
    return this.subtitle?.trim() || 'Design for life';
  }

  get blogHeroTitlePreview(): string {
    return this.blogHeroTitle?.trim() || 'Jouw blog';
  }

  get teamKickerPreview(): string {
    return this.subtitle?.trim() || 'Ons team';
  }

  get teamHeadingPreview(): string {
    return this.title?.trim() || 'De mensen achter het merk';
  }

  get teamIntroPreview(): string {
    return this.body?.trim() || 'Laat zien wie er achter je bedrijf zitten en waar ieder teamlid in uitblinkt.';
  }

  get faqHeadingPreview(): string {
    return this.title?.trim() || 'Veelgestelde vragen';
  }

  get faqSearchPlaceholder(): string {
    return this.subtitle?.trim() || 'Waar ben je naar op zoek?';
  }

  get reviewsHeadingPreview(): string {
    return this.title?.trim() || 'Wat klanten zeggen';
  }

  get reviewsIntroPreview(): string {
    return this.body?.trim() || 'Geef bezoekers vertrouwen met eerlijke ervaringen en duidelijke beoordelingen.';
  }

  get contactHeadingPreview(): string {
    return this.title?.trim() || 'contact.';
  }

  get contactEmailPreview(): string {
    return this.contactEmail?.trim() || 'info@mysite.com';
  }

  get contactPhonePreview(): string {
    return this.contactPhone?.trim() || '+31 6 12345678';
  }

  get contactButtonPreview(): string {
    return this.contactButtonLabel?.trim() || 'Versturen';
  }

  get currentService(): ServiceItemDraft {
    if (!this.serviceItems.length) {
      this.serviceItems = [{ title: '', duration: '', price: '', buttonLabel: '' }];
      this.activeServiceIndex = 0;
    }

    return this.serviceItems[this.activeServiceIndex] ?? this.serviceItems[0];
  }

  get currentTeamMember(): TeamMemberDraft {
    if (!this.teamMembers.length) {
      this.teamMembers = [{ name: '', role: '', intro: '', image: null }];
      this.activeTeamMemberIndex = 0;
    }

    return this.teamMembers[this.activeTeamMemberIndex] ?? this.teamMembers[0];
  }

  get currentFaqItem(): FaqItemDraft {
    if (!this.faqItems.length) {
      this.faqItems = [{ question: '', answer: '', category: 'Algemeen' }];
      this.activeFaqIndex = 0;
    }

    return this.faqItems[this.activeFaqIndex] ?? this.faqItems[0];
  }

  get currentReview(): ReviewItemDraft {
    if (!this.reviewItems.length) {
      this.reviewItems = [{ name: '', role: '', quote: '', rating: 5 }];
      this.activeReviewIndex = 0;
    }

    return this.reviewItems[this.activeReviewIndex] ?? this.reviewItems[0];
  }

  get servicesHeadingPreview(): string {
    return this.title?.trim() || 'Onze diensten';
  }

  get servicesPreviewItems(): ServiceItemDraft[] {
    return this.serviceItems.length
      ? this.serviceItems
      : [{ title: 'Wassen & drogen', duration: '1 uur', price: '€100', buttonLabel: 'Boek nu' }];
  }

  get blogCards(): Array<{ title: string; meta: string; excerpt: string; image: string }> {
    const posts = this.blogPosts.length ? this.blogPosts : [{ title: '', summary: '', image: null }];

    return posts.map((post, index) => ({
      title: post.title?.trim() || `Blogpost ${index + 1}`,
      meta: `Beheerder • ${index + 1} min leestijd`,
      excerpt: post.summary?.trim() || 'Schrijf hier een korte introductie die uitnodigt om verder te lezen.',
      image: this.getFilePreview(post.image) || 'assets/images/exampleImage.png'
    }));
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

  get teamPreviewCards(): Array<{ name: string; role: string; intro: string; image: string }> {
    const members = this.teamMembers.length
      ? this.teamMembers
      : [{
          name: 'Sophie de Vries',
          role: 'Creatief directeur',
          intro: 'Sophie bewaakt de creatieve richting en vertaalt ideeën naar een sterk merkverhaal.',
          image: null
        }];

    return members.map((member, index) => ({
      name: member.name?.trim() || `Teamlid ${index + 1}`,
      role: member.role?.trim() || 'Functie',
      intro: member.intro?.trim() || 'Voeg hier een korte introductie van dit teamlid toe.',
      image: this.getFilePreview(member.image) || 'assets/images/exampleImage.png'
    }));
  }

  get faqCategories(): string[] {
    const categories = this.faqItems
      .map(item => item.category?.trim())
      .filter((value): value is string => !!value);
    return [...new Set(categories)].length ? [...new Set(categories)] : ['Algemeen'];
  }

  get filteredFaqPreviewItems(): Array<FaqItemDraft & { index: number }> {
    const category = this.faqActiveCategory || this.faqCategories[0];
    const query = this.faqSearchQuery.trim().toLowerCase();
    const source = this.faqItems.length
      ? this.faqItems
      : [{
          question: 'Kan ik mijn afspraak verzetten?',
          answer: 'Ja, je kunt je afspraak eenvoudig verzetten via e-mail of telefonisch contact.',
          category: 'Algemeen'
        }];

    return source
      .map((item, index) => ({ ...item, index }))
      .filter(item => {
        const matchesCategory = !category || (item.category?.trim() || 'Algemeen') === category;
        const haystack = `${item.question} ${item.answer} ${item.category}`.toLowerCase();
        const matchesQuery = !query || haystack.includes(query);
        return matchesCategory && matchesQuery;
      });
  }

  get reviewPreviewCards(): ReviewItemDraft[] {
    return this.reviewItems.length
      ? this.reviewItems
      : [{
          name: 'Sanne de Boer',
          role: 'Klant',
          quote: 'Fijne service, snel geholpen en alles voelde meteen professioneel aan.',
          rating: 5
        }];
  }

  get backgroundFileLabel(): string {
    return getFileLabel(this.backgroundImage, 'Nog geen bestand gekozen');
  }

  get portraitFileLabel(): string {
    return getFileLabel(this.portraitImage, 'Nog geen bestand gekozen');
  }

  get defaultFileLabel(): string {
    return getFileLabel(this.image, 'Nog geen bestand gekozen');
  }

  get activeBlogPostFileLabel(): string {
    return getFileLabel(this.currentBlogPost.image, 'Nog geen bestand gekozen');
  }

  get activeTeamMemberFileLabel(): string {
    return getFileLabel(this.currentTeamMember.image, 'Nog geen bestand gekozen');
  }

  get blogBackgroundFileLabel(): string {
    return getFileLabel(this.backgroundImage, 'Nog geen bestand gekozen');
  }

  onFileChange(event: Event, type: 'default' | 'background' | 'portrait' | 'blog-post' | 'team-member' = 'default'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (type === 'background') {
      this.backgroundImage = file;
      this.setPreviewUrl(file, 'background');
      return;
    }

    if (type === 'portrait') {
      this.portraitImage = file;
      this.setPreviewUrl(file, 'portrait');
      return;
    }

    if (type === 'blog-post') {
      const posts = [...this.blogPosts];
      posts[this.activeBlogPostIndex] = {
        ...this.currentBlogPost,
        image: file
      };
      this.blogPosts = posts;
      return;
    }

    if (type === 'team-member') {
      const members = [...this.teamMembers];
      members[this.activeTeamMemberIndex] = {
        ...this.currentTeamMember,
        image: file
      };
      this.teamMembers = members;
      return;
    }

    this.image = file;
    this.setPreviewUrl(file, 'default');
  }

  addBlogPost(): void {
    this.blogPosts = [...this.blogPosts, { title: '', summary: '', image: null }];
    this.activeBlogPostIndex = this.blogPosts.length - 1;
  }

  selectBlogPost(index: number): void {
    this.activeBlogPostIndex = index;
  }

  addServiceItem(): void {
    this.serviceItems = [...this.serviceItems, { title: '', duration: '', price: '', buttonLabel: '' }];
    this.activeServiceIndex = this.serviceItems.length - 1;
  }

  selectServiceItem(index: number): void {
    this.activeServiceIndex = index;
  }

  addTeamMember(): void {
    this.teamMembers = [...this.teamMembers, { name: '', role: '', intro: '', image: null }];
    this.activeTeamMemberIndex = this.teamMembers.length - 1;
  }

  selectTeamMember(index: number): void {
    this.activeTeamMemberIndex = index;
  }

  addFaqItem(): void {
    this.faqItems = [...this.faqItems, { question: '', answer: '', category: this.faqCategories[0] || 'Algemeen' }];
    this.activeFaqIndex = this.faqItems.length - 1;
  }

  selectFaqItem(index: number): void {
    this.activeFaqIndex = index;
  }

  addReviewItem(): void {
    this.reviewItems = [...this.reviewItems, { name: '', role: '', quote: '', rating: 5 }];
    this.activeReviewIndex = this.reviewItems.length - 1;
  }

  selectReviewItem(index: number): void {
    this.activeReviewIndex = index;
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

  close(): void {
    this.dismiss.emit();
  }

  onSave(): void {
    if (!this.page) return;

    this.save.emit({
      pageId: this.page.id,
      title: this.title.trim(),
      subtitle: this.subtitle.trim(),
      body: this.body.trim(),
      image: this.image,
      backgroundImage: this.backgroundImage,
      portraitImage: this.portraitImage,
      blogHeroTitle: this.blogHeroTitle.trim(),
      blogPosts: this.blogPosts.map(post => ({
        title: post.title.trim(),
        summary: post.summary.trim(),
        image: post.image
      })),
      serviceItems: this.serviceItems.map(item => ({
        title: item.title.trim(),
        duration: item.duration.trim(),
        price: item.price.trim(),
        buttonLabel: item.buttonLabel.trim()
      })),
      teamMembers: this.teamMembers.map(member => ({
        name: member.name.trim(),
        role: member.role.trim(),
        intro: member.intro.trim(),
        image: member.image
      })),
      faqItems: this.faqItems.map(item => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
        category: item.category.trim()
      })),
      reviewItems: this.reviewItems.map(item => ({
        name: item.name.trim(),
        role: item.role.trim(),
        quote: item.quote.trim(),
        rating: item.rating
      })),
      contactEmail: this.contactEmail.trim(),
      contactPhone: this.contactPhone.trim(),
      contactButtonLabel: this.contactButtonLabel.trim(),
      socials: {
        linkedin: this.linkedinUrl.trim(),
        instagram: this.instagramUrl.trim(),
        facebook: this.facebookUrl.trim()
      }
    });
  }

  private loadExisting(): void {
    if (!this.page) return;
    const pageId = this.page.id;

    const key = `page_${pageId}_text`;
    const entry = this.builderState?.uploads?.[key];
    if (entry?.kind === 'inline' && entry.value) {
      this.title = entry.value.title ?? '';
      this.subtitle = entry.value.subtitle ?? '';
      this.body = entry.value.body ?? '';
      this.blogHeroTitle = entry.value.heroTitle ?? '';
      this.serviceItems = Array.isArray(entry.value.services)
        ? entry.value.services.map((item: any) => ({
            title: item.title ?? '',
            duration: item.duration ?? '',
            price: item.price ?? '',
            buttonLabel: item.buttonLabel ?? ''
          }))
        : [];
      this.teamMembers = Array.isArray(entry.value.members)
        ? entry.value.members.map((member: any, index: number) => ({
            name: member.name ?? '',
            role: member.role ?? '',
            intro: member.intro ?? '',
            image: this.builderState?.uploads?.[`page_${pageId}_member_${index}_image`] ?? null
          }))
        : [];
      this.faqItems = Array.isArray(entry.value.faqItems)
        ? entry.value.faqItems.map((item: any) => ({
            question: item.question ?? '',
            answer: item.answer ?? '',
            category: item.category ?? 'Algemeen'
          }))
        : [];
      this.reviewItems = Array.isArray(entry.value.reviewItems)
        ? entry.value.reviewItems.map((item: any) => ({
            name: item.name ?? '',
            role: item.role ?? '',
            quote: item.quote ?? '',
            rating: typeof item.rating === 'number' ? item.rating : 5
          }))
        : [];
      this.contactEmail = entry.value.contactEmail ?? '';
      this.contactPhone = entry.value.contactPhone ?? '';
      this.contactButtonLabel = entry.value.contactButtonLabel ?? '';
      this.linkedinUrl = entry.value.socials?.linkedin ?? '';
      this.instagramUrl = entry.value.socials?.instagram ?? '';
      this.facebookUrl = entry.value.socials?.facebook ?? '';
    } else {
      this.title = '';
      this.subtitle = '';
      this.body = '';
      this.blogHeroTitle = '';
      this.serviceItems = [];
      this.teamMembers = [];
      this.faqItems = [];
      this.contactEmail = '';
      this.contactPhone = '';
      this.contactButtonLabel = '';
      this.linkedinUrl = '';
      this.instagramUrl = '';
      this.facebookUrl = '';
    }

    this.image = this.builderState?.uploads?.[`page_${pageId}_image`] ?? null;
    this.backgroundImage = this.builderState?.uploads?.[`page_${pageId}_background_image`] ?? null;
    this.portraitImage = this.builderState?.uploads?.[`page_${pageId}_portrait_image`] ?? null;

    if (this.isBlogPage) {
      const savedPosts = Array.isArray(entry?.value?.posts) && entry.value.posts.length
        ? entry.value.posts
        : [{ title: this.title, summary: this.body }];

      this.blogPosts = savedPosts.map((post: any, index: number) => ({
        title: post.title ?? '',
        summary: post.summary ?? '',
        image: this.builderState?.uploads?.[`page_${pageId}_post_${index}_image`] ?? null
      }));
      this.activeBlogPostIndex = 0;
      this.serviceItems = [];
      this.activeServiceIndex = 0;
      this.teamMembers = [];
      this.activeTeamMemberIndex = 0;
      this.faqItems = [];
      this.activeFaqIndex = 0;
      this.reviewItems = [];
      this.activeReviewIndex = 0;
    } else if (this.isServicesPage) {
      this.blogPosts = [];
      this.activeBlogPostIndex = 0;
      this.serviceItems = this.serviceItems.length
        ? this.serviceItems
        : [{ title: this.body || '', duration: '', price: '', buttonLabel: 'Boek nu' }];
      this.activeServiceIndex = 0;
      this.teamMembers = [];
      this.activeTeamMemberIndex = 0;
      this.faqItems = [];
      this.activeFaqIndex = 0;
      this.reviewItems = [];
      this.activeReviewIndex = 0;
    } else if (this.isTeamPage) {
      this.blogPosts = [];
      this.activeBlogPostIndex = 0;
      this.serviceItems = [];
      this.activeServiceIndex = 0;
      this.teamMembers = this.teamMembers.length
        ? this.teamMembers
        : [{ name: '', role: '', intro: '', image: null }];
      this.activeTeamMemberIndex = 0;
      this.faqItems = [];
      this.activeFaqIndex = 0;
      this.reviewItems = [];
      this.activeReviewIndex = 0;
    } else if (this.isFaqPage) {
      this.blogPosts = [];
      this.activeBlogPostIndex = 0;
      this.serviceItems = [];
      this.activeServiceIndex = 0;
      this.teamMembers = [];
      this.activeTeamMemberIndex = 0;
      this.faqItems = this.faqItems.length
        ? this.faqItems
        : [{
            question: 'Kan ik mijn afspraak verzetten?',
            answer: 'Ja, je kunt je afspraak eenvoudig verzetten via e-mail of telefonisch contact.',
            category: 'Algemeen'
          }];
      this.activeFaqIndex = 0;
      this.reviewItems = [];
      this.activeReviewIndex = 0;
    } else if (this.isReviewsPage) {
      this.blogPosts = [];
      this.activeBlogPostIndex = 0;
      this.serviceItems = [];
      this.activeServiceIndex = 0;
      this.teamMembers = [];
      this.activeTeamMemberIndex = 0;
      this.faqItems = [];
      this.activeFaqIndex = 0;
      this.reviewItems = this.reviewItems.length
        ? this.reviewItems
        : [{
            name: 'Sanne de Boer',
            role: 'Klant',
            quote: 'Fijne service, snel geholpen en alles voelde meteen professioneel aan.',
            rating: 5
          }];
      this.activeReviewIndex = 0;
    } else {
      this.blogPosts = [];
      this.activeBlogPostIndex = 0;
      this.serviceItems = [];
      this.activeServiceIndex = 0;
      this.teamMembers = [];
      this.activeTeamMemberIndex = 0;
      this.faqItems = [];
      this.activeFaqIndex = 0;
      this.reviewItems = [];
      this.activeReviewIndex = 0;
    }

    this.resetPreviewUrls();

    if (this.image instanceof File) {
      this.setPreviewUrl(this.image, 'default');
    }
    if (this.backgroundImage instanceof File) {
      this.setPreviewUrl(this.backgroundImage, 'background');
    }
    if (this.portraitImage instanceof File) {
      this.setPreviewUrl(this.portraitImage, 'portrait');
    }

    this.closeBooking();
    this.faqActiveCategory = this.faqCategories[0] || 'Algemeen';
    this.faqSearchQuery = '';
  }

  private getExistingImage(type: 'default' | 'background' | 'portrait' = 'default'): string | null {
    if (!this.page) return null;
    const key =
      type === 'background'
        ? `page_${this.page.id}_background_image`
        : type === 'portrait'
          ? `page_${this.page.id}_portrait_image`
          : `page_${this.page.id}_image`;
    const stored = this.builderState?.uploads?.[key];
    return typeof stored === 'string' ? stored : null;
  }

  private setPreviewUrl(file: File, type: 'default' | 'background' | 'portrait'): void {
    this.resetPreviewUrl(type);
    const url = URL.createObjectURL(file);
    if (type === 'background') {
      this.backgroundPreviewUrl = url;
      return;
    }
    if (type === 'portrait') {
      this.portraitPreviewUrl = url;
      return;
    }
    this.imagePreviewUrl = url;
  }

  private resetPreviewUrls(): void {
    this.resetPreviewUrl('default');
    this.resetPreviewUrl('background');
    this.resetPreviewUrl('portrait');
  }

  private resetPreviewUrl(type: 'default' | 'background' | 'portrait'): void {
    const current =
      type === 'background'
        ? this.backgroundPreviewUrl
        : type === 'portrait'
          ? this.portraitPreviewUrl
          : this.imagePreviewUrl;

    if (current) {
      URL.revokeObjectURL(current);
    }

    if (type === 'background') {
      this.backgroundPreviewUrl = null;
      return;
    }
    if (type === 'portrait') {
      this.portraitPreviewUrl = null;
      return;
    }
    this.imagePreviewUrl = null;
  }

  private getFilePreview(value: File | string | null): string | null {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    return null;
  }

}
