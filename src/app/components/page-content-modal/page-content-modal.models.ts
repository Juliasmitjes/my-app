export type BlogPostDraft = {
  title: string;
  summary: string;
  image: File | string | null;
};

export type ServiceItemDraft = {
  title: string;
  duration: string;
  price: string;
  buttonLabel: string;
};

export type TeamMemberDraft = {
  name: string;
  role: string;
  intro: string;
  image: File | string | null;
};

export type FaqItemDraft = {
  question: string;
  answer: string;
  category: string;
};

export type ReviewItemDraft = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export type PageContentPayload = {
  pageId: string;
  title: string;
  subtitle: string;
  body: string;
  image?: File | string | null;
  backgroundImage?: File | string | null;
  portraitImage?: File | string | null;
  blogHeroTitle?: string;
  blogPosts?: BlogPostDraft[];
  serviceItems?: ServiceItemDraft[];
  teamMembers?: TeamMemberDraft[];
  faqItems?: FaqItemDraft[];
  reviewItems?: ReviewItemDraft[];
  contactEmail?: string;
  contactPhone?: string;
  contactButtonLabel?: string;
  socials?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
};
