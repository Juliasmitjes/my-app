import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{html,ts}',     
    './app/**/*.{html,ts}',
    './components/**/*.{html,ts}',
    './pages/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1600px', // jouw nieuwe breakpoint
      }
    }
  }
}

export default config;
