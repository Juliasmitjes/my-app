export interface SingleLayoutConfig {
  type: 'text' | 'image' | 'video';
}

export interface TwoColumnConfig {
  left: 'text' | 'image' | 'video';
  right: 'text' | 'image' | 'video';
}

export interface GridCellType {
  value: 'text' | 'image' | 'video';
}

export interface GridLayoutConfig {
  rows: number;
  cols: number;
  cells: GridCellType[]; // lengte = rows * cols
}

export type LayoutConfig =
  | SingleLayoutConfig
  | TwoColumnConfig
  | GridLayoutConfig
  | null;
  

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

  /** Layoutconfiguratie (per layout-type anders) */
  layoutConfig?: LayoutConfig;

  uploads?: any[];
}
