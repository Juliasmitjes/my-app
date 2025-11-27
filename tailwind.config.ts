import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/**/*.{html,ts}',     
    './app/**/*.{html,ts}',
    './components/**/*.{html,ts}',
    './pages/**/*.{html,ts}'
  ]
}

export default config;
