export interface BuilderUploads {
  image?: File | string;
  video?: File | string;
  text?: string;
}

export interface BuilderState {
  /** Layout type van de website */
  layout?: 'single' | 'two-column' | 'grid' | null;

  layoutConfig?: {
    // homepage business category
    templateGroup?: 'portfolio' | 'service' | 'editorial' | 'product' | 'local';

    // single
    variantType?: string;

    // two-column
    col1Type?: 'text' | 'image' | 'video';
    col2Type?: 'text' | 'image' | 'video';

    // grid
    rows?: number;
    cols?: number;
    cells?: Array<'text' | 'image' | 'video'>;
  };

  /** Kleurenthema van de website */
  colorTheme?:
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
  fontStyle?: 'modern-sans' | 'classic-serif' | 'display' | null;

  /** Specifieke fontvariant binnen de gekozen stijl */
  fontVariant?:
    | 'inter'
    | 'raleway'
    | 'lora'
    | 'dm-sans'
    | 'manrope'
    | 'poppins'
    | 'roboto'
    | 'space-grotesk'
    | 'merriweather'
    | 'playfair'
    | 'montserrat'
    | 'oswald'
    | null;

  /** Font voor kopjes */
  headingFontVariant?:
    | 'inter'
    | 'raleway'
    | 'lora'
    | 'dm-sans'
    | 'manrope'
    | 'poppins'
    | 'roboto'
    | 'space-grotesk'
    | 'merriweather'
    | 'playfair'
    | 'montserrat'
    | 'oswald'
    | null;

  /** Font voor hoofdtekst */
  bodyFontVariant?:
    | 'inter'
    | 'raleway'
    | 'lora'
    | 'dm-sans'
    | 'manrope'
    | 'poppins'
    | 'roboto'
    | 'space-grotesk'
    | 'merriweather'
    | 'playfair'
    | 'montserrat'
    | 'oswald'
    | null;

  /** Tekst die de gebruiker invoert voor font-preview */
  fontSample?: string | null;

  /** Logo-bestandspad of -URL */
  logo?: string | null;

  /** Navigatiepositie */
  navigation?: 'top' | 'sidebar' | null;

  /** Header-gedrag */
  headerStyle?: 'fixed' | 'scrolling' | null;

  /** Pagina’s binnen de sitebuilder */
  pages?: string[];

  /** Locked state: is de layout bevestigd zodat content geüpload kan worden */
  layoutLocked?: boolean;

  /** Uploads */
  uploads?: Record<string, any>;

  contentSaved?: boolean;
}
