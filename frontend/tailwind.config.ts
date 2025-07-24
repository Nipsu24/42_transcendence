import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
		fontFamily: {
			body: ['var(--font-body)'],
			heading: ['var(--font-heading)'],
		},
  },
},
  plugins: [],
}

export default config
