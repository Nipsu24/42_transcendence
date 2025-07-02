import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {

	fontFamily: {
		body: ['var(--font-body)'],
		heading: ['var(--font-heading)'],
		},
    screens: {
        xs: '480px',
        '3xl': '1600px',
      },
    },
  },
  plugins: []
};

export default config;
