import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { PageContentModal } from '../page-content-modal';

@Component({
  selector: 'app-page-content-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page-content-preview.html'
})
export class PageContentPreview {
  @Input({ required: true }) modal!: PageContentModal;

  get selectedThemeColors() { return this.modal.selectedThemeColors; }
  get headingFont() { return this.modal.headingFont; }
  get bodyFont() { return this.modal.bodyFont; }
  get builderState() { return this.modal.builderState; }
  get title() { return this.modal.title; }
  get subtitle() { return this.modal.subtitle; }
  get body() { return this.modal.body; }
  get previewImage() { return this.modal.previewImage; }
  get previewBackgroundImage() { return this.modal.previewBackgroundImage; }
  get previewPortraitImage() { return this.modal.previewPortraitImage; }
  get isAboutPage() { return this.modal.isAboutPage; }
  get isBlogPage() { return this.modal.isBlogPage; }
  get isContactPage() { return this.modal.isContactPage; }
  get isServicesPage() { return this.modal.isServicesPage; }
  get isTeamPage() { return this.modal.isTeamPage; }
  get isFaqPage() { return this.modal.isFaqPage; }
  get isReviewsPage() { return this.modal.isReviewsPage; }
  get aboutSectionTitle() { return this.modal.aboutSectionTitle; }
  get aboutSocialLinks() { return this.modal.aboutSocialLinks; }
  get bodyColumns() { return this.modal.bodyColumns; }
  get blogHeroLabel() { return this.modal.blogHeroLabel; }
  get blogHeroTitlePreview() { return this.modal.blogHeroTitlePreview; }
  get blogCards() { return this.modal.blogCards; }
  get contactHeadingPreview() { return this.modal.contactHeadingPreview; }
  get contactEmailPreview() { return this.modal.contactEmailPreview; }
  get contactPhonePreview() { return this.modal.contactPhonePreview; }
  get contactButtonPreview() { return this.modal.contactButtonPreview; }
  get servicesHeadingPreview() { return this.modal.servicesHeadingPreview; }
  get servicesPreviewItems() { return this.modal.servicesPreviewItems; }
  get bookingServiceTitle() { return this.modal.bookingServiceTitle; }
  get bookingDates() { return this.modal.bookingDates; }
  get bookingSlots() { return this.modal.bookingSlots; }
  get bookingConfirmed() { return this.modal.bookingConfirmed; }
  set bookingConfirmed(value: boolean) { this.modal.bookingConfirmed = value; }
  get teamKickerPreview() { return this.modal.teamKickerPreview; }
  get teamHeadingPreview() { return this.modal.teamHeadingPreview; }
  get teamIntroPreview() { return this.modal.teamIntroPreview; }
  get teamPreviewCards() { return this.modal.teamPreviewCards; }
  get faqHeadingPreview() { return this.modal.faqHeadingPreview; }
  get faqSearchPlaceholder() { return this.modal.faqSearchPlaceholder; }
  get faqCategories() { return this.modal.faqCategories; }
  get filteredFaqPreviewItems() { return this.modal.filteredFaqPreviewItems; }
  get reviewPreviewCards() { return this.modal.reviewPreviewCards; }
  get reviewsHeadingPreview() { return this.modal.reviewsHeadingPreview; }
  get reviewsIntroPreview() { return this.modal.reviewsIntroPreview; }

  get selectedBookingDate() { return this.modal.selectedBookingDate; }
  set selectedBookingDate(value: string) { this.modal.selectedBookingDate = value; }
  get selectedBookingSlot() { return this.modal.selectedBookingSlot; }
  set selectedBookingSlot(value: string) { this.modal.selectedBookingSlot = value; }
  get faqSearchQuery() { return this.modal.faqSearchQuery; }
  set faqSearchQuery(value: string) { this.modal.faqSearchQuery = value; }
  get faqActiveCategory() { return this.modal.faqActiveCategory; }
  set faqActiveCategory(value: string) { this.modal.faqActiveCategory = value; }
  get activeFaqIndex() { return this.modal.activeFaqIndex; }
  set activeFaqIndex(value: number) { this.modal.activeFaqIndex = value; }

  openBooking(title: string): void { this.modal.openBooking(title); }
  closeBooking(): void { this.modal.closeBooking(); }
  confirmBooking(): void { this.modal.confirmBooking(); }
}
