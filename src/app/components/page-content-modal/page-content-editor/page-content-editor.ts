import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { PageContentModal } from '../page-content-modal';

@Component({
  selector: 'app-page-content-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page-content-editor.html'
})
export class PageContentEditor {
  @Input({ required: true }) modal!: PageContentModal;

  get selectedThemeColors() { return this.modal.selectedThemeColors; }
  get isAboutPage() { return this.modal.isAboutPage; }
  get isBlogPage() { return this.modal.isBlogPage; }
  get isContactPage() { return this.modal.isContactPage; }
  get isServicesPage() { return this.modal.isServicesPage; }
  get isTeamPage() { return this.modal.isTeamPage; }
  get isFaqPage() { return this.modal.isFaqPage; }
  get isReviewsPage() { return this.modal.isReviewsPage; }
  get blogPosts() { return this.modal.blogPosts; }
  get serviceItems() { return this.modal.serviceItems; }
  get teamMembers() { return this.modal.teamMembers; }
  get faqItems() { return this.modal.faqItems; }
  get reviewItems() { return this.modal.reviewItems; }
  get activeBlogPostIndex() { return this.modal.activeBlogPostIndex; }
  get activeServiceIndex() { return this.modal.activeServiceIndex; }
  get activeTeamMemberIndex() { return this.modal.activeTeamMemberIndex; }
  get activeFaqIndex() { return this.modal.activeFaqIndex; }
  get activeReviewIndex() { return this.modal.activeReviewIndex; }
  get currentBlogPost() { return this.modal.currentBlogPost; }
  get currentService() { return this.modal.currentService; }
  get currentTeamMember() { return this.modal.currentTeamMember; }
  get currentFaqItem() { return this.modal.currentFaqItem; }
  get currentReview() { return this.modal.currentReview; }
  get blogBackgroundFileLabel() { return this.modal.blogBackgroundFileLabel; }
  get activeBlogPostFileLabel() { return this.modal.activeBlogPostFileLabel; }
  get activeTeamMemberFileLabel() { return this.modal.activeTeamMemberFileLabel; }
  get backgroundFileLabel() { return this.modal.backgroundFileLabel; }
  get portraitFileLabel() { return this.modal.portraitFileLabel; }
  get defaultFileLabel() { return this.modal.defaultFileLabel; }

  get title() { return this.modal.title; }
  set title(value: string) { this.modal.title = value; }
  get subtitle() { return this.modal.subtitle; }
  set subtitle(value: string) { this.modal.subtitle = value; }
  get body() { return this.modal.body; }
  set body(value: string) { this.modal.body = value; }
  get blogHeroTitle() { return this.modal.blogHeroTitle; }
  set blogHeroTitle(value: string) { this.modal.blogHeroTitle = value; }
  get contactEmail() { return this.modal.contactEmail; }
  set contactEmail(value: string) { this.modal.contactEmail = value; }
  get contactPhone() { return this.modal.contactPhone; }
  set contactPhone(value: string) { this.modal.contactPhone = value; }
  get contactButtonLabel() { return this.modal.contactButtonLabel; }
  set contactButtonLabel(value: string) { this.modal.contactButtonLabel = value; }
  get linkedinUrl() { return this.modal.linkedinUrl; }
  set linkedinUrl(value: string) { this.modal.linkedinUrl = value; }
  get instagramUrl() { return this.modal.instagramUrl; }
  set instagramUrl(value: string) { this.modal.instagramUrl = value; }
  get facebookUrl() { return this.modal.facebookUrl; }
  set facebookUrl(value: string) { this.modal.facebookUrl = value; }

  onFileChange(event: Event, type?: 'default' | 'background' | 'portrait' | 'blog-post' | 'team-member'): void {
    this.modal.onFileChange(event, type);
  }
  addBlogPost(): void { this.modal.addBlogPost(); }
  selectBlogPost(index: number): void { this.modal.selectBlogPost(index); }
  addServiceItem(): void { this.modal.addServiceItem(); }
  selectServiceItem(index: number): void { this.modal.selectServiceItem(index); }
  addTeamMember(): void { this.modal.addTeamMember(); }
  selectTeamMember(index: number): void { this.modal.selectTeamMember(index); }
  addFaqItem(): void { this.modal.addFaqItem(); }
  selectFaqItem(index: number): void { this.modal.selectFaqItem(index); }
  addReviewItem(): void { this.modal.addReviewItem(); }
  selectReviewItem(index: number): void { this.modal.selectReviewItem(index); }
  close(): void { this.modal.close(); }
  onSave(): void { this.modal.onSave(); }
}
