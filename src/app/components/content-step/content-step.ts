// content-step.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { LucideAngularModule } from 'lucide-angular';
import { PageContentModal } from '../page-content-modal/page-content-modal';

export interface PageDef {
  id: string;
  name: string;
  description?: string;
  required?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-content-step',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    PageContentModal,
  ],
  templateUrl: './content-step.html',
  styleUrl: './content-step.css'
})
export class ContentStep {
  @Input() builderState?: BuilderState;
  @Input() contents: PageDef[] = [];
  @Input() colorThemes: { id: string; colors: string[] }[] = [];
  @Output() update = new EventEmitter<Partial<BuilderState>>();
  @Output() toggle = new EventEmitter<string>();
  activePage: PageDef | null = null;
  showModal = false;

  get pages(): string[] {
    return this.builderState?.pages ?? ['home'];
  }

  get additionalPagesCount(): number {
  const count = Math.max(0, this.pages.length - 1);
  return count;
}

isMobile = window.innerWidth < 768;

ngOnInit() {
  window.addEventListener('resize', () => {
    this.isMobile = window.innerWidth < 768;
  });
}

  onSelectPage(pageId: string, required = false) {
    if (!this.builderState) return;
    if (required) return; // verplicht, kan niet worden uitgevinkt

    const isSelected = this.pages.includes(pageId);

    if (isSelected) {
      const newPages = this.pages.filter(p => p !== pageId);
      this.removePageData(pageId);
      this.toggle.emit(pageId);
      return;
    }

    const newPages = [...this.pages, pageId];
    this.toggle.emit(pageId);
  }  

  isConfirmed(pageId: string): boolean {
    return this.builderState?.uploads?.[`page_${pageId}_confirmed`] === true;
  }

  confirmPage(pageId: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.updateUploads({ [`page_${pageId}_confirmed`]: true });
  }

  openEditor(page: PageDef, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.activePage = page;
    this.showModal = true;
  }

  closeEditor(): void {
    this.showModal = false;
  }

  savePageContent(payload: { pageId: string; title: string; subtitle: string; body: string; image?: File | string | null }): void {
    const { pageId, title, subtitle, body, image, backgroundImage, portraitImage, socials } = payload as {
      pageId: string;
      title: string;
      subtitle: string;
      body: string;
      image?: File | string | null;
      backgroundImage?: File | string | null;
      portraitImage?: File | string | null;
      blogHeroTitle?: string;
      blogPosts?: Array<{
        title: string;
        summary: string;
        image?: File | string | null;
      }>;
      contactEmail?: string;
      contactPhone?: string;
      contactButtonLabel?: string;
      socials?: {
        linkedin?: string;
        instagram?: string;
        facebook?: string;
      };
    };
    const uploads = { ...(this.builderState?.uploads ?? {}) };
    if (pageId === 'blog') {
      const blogPosts = (payload as any).blogPosts ?? [];
      const blogHeroTitle = (payload as any).blogHeroTitle ?? '';

      uploads[`page_${pageId}_text`] = {
        kind: 'inline',
        value: {
          title,
          subtitle,
          body,
          heroTitle: blogHeroTitle,
          posts: blogPosts.map((post: any) => ({
            title: post.title ?? '',
            summary: post.summary ?? ''
          }))
        }
      };

      if (backgroundImage) {
        uploads[`page_${pageId}_background_image`] = backgroundImage;
      }

      const existingBlogPostKeys = Object.keys(uploads).filter(key => key.startsWith(`page_${pageId}_post_`) && key.endsWith('_image'));
      for (const key of existingBlogPostKeys) {
        delete uploads[key];
      }

      blogPosts.forEach((post: any, index: number) => {
        if (post.image) {
          uploads[`page_${pageId}_post_${index}_image`] = post.image;
        }
      });
    } else {
      uploads[`page_${pageId}_text`] = {
        kind: 'inline',
        value: {
          title,
          subtitle,
          body,
          contactEmail: (payload as any).contactEmail ?? '',
          contactPhone: (payload as any).contactPhone ?? '',
          contactButtonLabel: (payload as any).contactButtonLabel ?? '',
          socials: socials ?? {}
        }
      };

      if (pageId === 'about') {
        if (backgroundImage) {
          uploads[`page_${pageId}_background_image`] = backgroundImage;
        }
        if (portraitImage) {
          uploads[`page_${pageId}_portrait_image`] = portraitImage;
        }
      } else if (image) {
        uploads[`page_${pageId}_image`] = image;
      }
    }

    uploads[`page_${pageId}_confirmed`] = true;
    this.update.emit({ uploads });
    this.showModal = false;
  }

  private updateUploads(patch: Record<string, any>): void {
    const uploads = { ...(this.builderState?.uploads ?? {}), ...patch };
    this.update.emit({ uploads });
  }

  private removePageData(pageId: string): void {
    const uploads = { ...(this.builderState?.uploads ?? {}) };
    delete uploads[`page_${pageId}_text`];
    delete uploads[`page_${pageId}_image`];
    delete uploads[`page_${pageId}_background_image`];
    delete uploads[`page_${pageId}_portrait_image`];
    for (const key of Object.keys(uploads)) {
      if (key.startsWith(`page_${pageId}_post_`) && key.endsWith('_image')) {
        delete uploads[key];
      }
    }
    delete uploads[`page_${pageId}_confirmed`];
    this.update.emit({ uploads });
  }
}
