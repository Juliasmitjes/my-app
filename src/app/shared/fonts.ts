// mapping van font variant namen naar CSS font-family strings
export const fontMap: Record<string, string> = {
  inter: `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  roboto: `"Roboto", system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif`,
  merriweather: `"Merriweather", Georgia, "Times New Roman", Times, serif`,
  playfair: `"Playfair Display", Georgia, "Times New Roman", Times, serif`,
  montserrat: `"Montserrat", "Helvetica Neue", Arial, sans-serif`,
  oswald: `"Oswald", "Arial Narrow", Arial, sans-serif`,
  lora: `"Lora", Georgia, "Times New Roman", Times, serif`,
  raleway: `"Raleway", "Helvetica Neue", Arial, sans-serif`,
};

// Google Fonts families (format voor één link)
export const googleFontFamilies = [
  'Inter:wght@300;400;600;700',
  'Roboto:wght@300;400;500;700',
  'Merriweather:wght@300;400;700',
  'Playfair+Display:wght@400;700',
  'Montserrat:wght@400;600;700',
  'Oswald:wght@300;400;500;700',
  'Lora:wght@400;500;700',
  'Raleway:wght@300;400;600;700',
  'Poppins:wght@300;400;500;600;700'
];

// helper om de Google Fonts stylesheet url te maken
export function googleFontsUrl(): string {
  const families = googleFontFamilies.join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}