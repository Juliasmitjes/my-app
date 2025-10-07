export interface BuilderState {
  layout: 'single' | 'two-column' | 'grid' | null;
  colorTheme: 'warm' | 'light' | 'dark' | 'cool' | null;
  font:
    | 'modern-inter'
    | 'modern-roboto'
    | 'serif-merriweather'
    | 'serif-playfair'
    | 'display-montserrat'
    | 'display-oswald'
    | null;
  logo: string;
  navigation: 'top' | 'sidebar';
  headerStyle: 'fixed' | 'scrolling';
  pages: string[];
}
