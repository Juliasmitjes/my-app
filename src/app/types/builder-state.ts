export interface BuilderUploads {
  image?: File | string;
  video?: File | string;
  text?: string;
}

export interface BuilderState {
  /** Layout type van de website */
  layout: 'single' | 'two-column' | 'grid' | null;

  /** Kleurenthema van de website */
  colorTheme:
    | 'warm'
    | 'light'
    | 'dark'
    | 'cool'
    | 'earth'
    | 'vibrant'
    | 'ocean'
    | 'sunset'
    | null;

  /** Hoofdtypografie-categorie, bv. “modern-sans” of “display” */
  fontStyle: 'modern-sans' | 'classic-serif' | 'display' | null;

  /** Specifieke fontvariant binnen de gekozen stijl */
  fontVariant:
    | 'inter'
    | 'roboto'
    | 'merriweather'
    | 'playfair'
    | 'montserrat'
    | 'oswald'
    | null;

  /** Tekst die de gebruiker invoert voor font-preview */
  fontSample: string | null;

  /** Logo-bestandspad of -URL */
  logo: string | null;

  /** Navigatiepositie */
  navigation: 'top' | 'sidebar' | null;

  /** Header-gedrag */
  headerStyle: 'fixed' | 'scrolling' | null;

  /** Pagina’s binnen de sitebuilder */
  pages: string[];

  /** Locked state: is de layout bevestigd zodat content geüpload kan worden */
  layoutLocked?: boolean;

  /** Uploads */
  uploads?: BuilderUploads;
}
